/**
 * The shell. Owns the two things the tracks share and nothing else: the primary
 * track choice (Merchant / Shopper) and each track's state. Each track brings its
 * own chrome — the merchant track its wp-admin / onboarding shells, the shopper
 * track its storefront — so App just routes and hosts the switcher.
 *
 * Every step is history-navigable: the track and each track's current screen
 * (plus the wallet tab and the open product) live in the URL, and each
 * navigation pushes a history entry, so the browser Back/Forward buttons step
 * through the prototype and any state is a shareable link.
 */
import { useEffect, useState } from 'react';
import TrackSwitcher from './TrackSwitcher';
import Snackbar from './Snackbar';
import { DEFAULT_TRACK, TRACK_IDS, TRACK_PARAM, type Track } from './tracks';
import { readParam, readRaw, buildUrl, pushUrl, replaceUrl } from './urlState';
import MerchantApp from './merchant/MerchantApp';
import ShopperApp from './shopper/ShopperApp';
import {
  INITIAL_STATE, MERCHANT_SCREENS, WALLET_TABS, type MerchantState,
} from './merchant/flow';
import {
  INITIAL_SHOPPER_STATE, SHOPPER_SCREENS, type ShopperState,
} from './shopper/flow';

/** The navigation-relevant slice of state, read from / written to the URL. */
type Nav = {
  track: Track;
  m: MerchantState[ 'screen' ];
  mt: MerchantState[ 'walletTab' ];
  s: ShopperState[ 'screen' ];
  p: string;
};

const readNav = (): Nav => ( {
  track: readParam( TRACK_PARAM, TRACK_IDS, DEFAULT_TRACK ),
  m: readParam( 'm', MERCHANT_SCREENS, INITIAL_STATE.screen ),
  mt: readParam( 'mt', WALLET_TABS, INITIAL_STATE.walletTab ),
  s: readParam( 's', SHOPPER_SCREENS, INITIAL_SHOPPER_STATE.screen ),
  p: readRaw( 'p', INITIAL_SHOPPER_STATE.product ),
} );

/** True `ms` after `active` turns true; false again immediately when it turns off. */
function useDelayed( active: boolean, ms: number ): boolean {
  const [ shown, setShown ] = useState( false );
  useEffect( () => {
    if ( ! active ) { setShown( false ); return; }
    const t = setTimeout( () => setShown( true ), ms );
    return () => clearTimeout( t );
  }, [ active, ms ] );
  return shown;
}

export default function App() {
  const start = readNav();
  const [ track, setTrack ] = useState< Track >( start.track );
  const [ merchant, setMerchant ] = useState< MerchantState >( () => ( {
    ...INITIAL_STATE, screen: start.m, walletTab: start.mt,
  } ) );
  const [ shopper, setShopper ] = useState< ShopperState >( () => ( {
    ...INITIAL_SHOPPER_STATE, screen: start.s, product: start.p,
  } ) );
  const [ merchantNudgeDismissed, setMerchantNudgeDismissed ] = useState( false );
  const [ orderNudgeDismissed, setOrderNudgeDismissed ] = useState( false );
  /* Once a shopper order has been placed, the "go to Shopper view" nudge has done
     its job — don't show it again when the merchant returns to wp-admin. */
  const [ orderPlaced, setOrderPlaced ] = useState( false );

  /** Current navigation slice → URL param map. */
  const navParams = () => ( {
    [ TRACK_PARAM ]: track,
    m: merchant.screen,
    mt: merchant.screen === 'wallet-manage' ? merchant.walletTab : undefined,
    s: shopper.screen,
    p: shopper.screen === 'product' ? shopper.product : undefined,
  } );

  /* Normalize the initial URL to the canonical param set (replace, not push). */
  useEffect( () => { replaceUrl( navParams() ); }, [] ); // eslint-disable-line react-hooks/exhaustive-deps

  /* Push a history entry when a navigation value changes — but only when the URL
     doesn't already describe it. That single guard covers the initial mount,
     React StrictMode's double effect-invocation, and Back/Forward restores (all
     of which already match the current URL), so no duplicate entries are made
     and no mount/pop ref bookkeeping is needed. */
  useEffect( () => {
    const target = buildUrl( navParams() );
    if ( window.location.pathname + window.location.search !== target ) {
      pushUrl( navParams() );
    }
  }, [ track, merchant.screen, merchant.walletTab, shopper.screen, shopper.product ] ); // eslint-disable-line react-hooks/exhaustive-deps

  /* Scroll to the top on every screen/track change, like a real page navigation
     (covers both tracks; the storefront also scrolls its own way). */
  useEffect( () => {
    window.scrollTo( 0, 0 );
  }, [ track, merchant.screen, shopper.screen, shopper.product ] );

  /* Back/Forward → restore the navigation slice from the URL. The push effect
     above then sees the URL already matches and skips, so no entry is added. */
  useEffect( () => {
    const onPop = () => {
      const nav = readNav();
      setTrack( nav.track );
      setMerchant( ( s ) => ( { ...s, screen: nav.m, walletTab: nav.mt } ) );
      setShopper( ( s ) => ( { ...s, screen: nav.s, product: nav.p } ) );
    };
    window.addEventListener( 'popstate', onPop );
    return () => window.removeEventListener( 'popstate', onPop );
  }, [] );

  /* Cross-track nudges appear 2s after their condition holds. */
  const showMerchantNudge = useDelayed(
    track === 'merchant' && merchant.productsDone && ! orderPlaced && ! merchantNudgeDismissed,
    2000
  );
  const showOrderNudge = useDelayed(
    track === 'shopper' && shopper.screen === 'order-received' && ! orderNudgeDismissed,
    2000
  );

  return (
    <>
      { track === 'merchant'
        ? <MerchantApp state={ merchant } setState={ setMerchant } />
        : <ShopperApp
            state={ shopper }
            setState={ setShopper }
            onPurchase={ () => {
              /* A shopper purchase both arms the notice and points the merchant
                 track at the Home tasklist, so switching to Merchant view from the
                 order-received page lands on wp-admin with the banner showing. */
              setMerchant( ( s ) => ( { ...s, pendingPayment: true, productsDone: true, screen: 'home' } ) );
              setOrderPlaced( true );
            } }
          /> }

      { showMerchantNudge && (
        <Snackbar
          title="Store is live, customers can already pay."
          cta="Go to shop"
          onGo={ () => setTrack( 'shopper' ) }
          onDismiss={ () => setMerchantNudgeDismissed( true ) }
        />
      ) }

      { showOrderNudge && (
        <Snackbar
          title="An order has been placed."
          desc="The merchant has been notified."
          cta="Back to WooCommerce"
          onGo={ () => setTrack( 'merchant' ) }
          onDismiss={ () => setOrderNudgeDismissed( true ) }
        />
      ) }

      <TrackSwitcher
        track={ track }
        onTrack={ setTrack }
        merchant={ merchant }
        setMerchant={ setMerchant }
        shopper={ shopper }
        setShopper={ setShopper }
      />
    </>
  );
}

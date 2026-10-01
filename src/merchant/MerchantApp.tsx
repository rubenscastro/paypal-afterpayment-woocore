/**
 * The merchant track: one state object, one `screen` field, and the navigation
 * that links the Figma frames into a click-through prototype. Onboarding screens
 * render full-screen; wp-admin screens render inside the admin shell.
 *
 * `state` and `setState` are lifted to `App` so the track switcher can jump to
 * any screen and preset the states (PayPal connected? payment pending?) that make
 * the screens differ.
 */
import { useEffect, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import WpAdminShell from '../chrome/WpAdminShell';
import { type MerchantState, type WalletTab } from './flow';
import WelcomeStep from './onboarding/WelcomeStep';
import ProfileStep from './onboarding/ProfileStep';
import BusinessInfoStep from './onboarding/BusinessInfoStep';
import ExtensionsStep from './onboarding/ExtensionsStep';
import FunLoader from './onboarding/FunLoader';
import JetpackConnectStep from './onboarding/JetpackConnectStep';
import BusinessLocationStep from './onboarding/BusinessLocationStep';
import HomeTasklist from './admin/HomeTasklist';
import OrdersPage from './admin/OrdersPage';
import OrderDetails from './admin/OrderDetails';
import PaymentsSettings from './admin/PaymentsSettings';
import WalletWizard from './admin/wallet/WalletWizard';
import WalletManage from './admin/wallet/WalletManage';
import PayPalConnectFlow from './admin/wallet/PayPalConnectFlow';
import { track } from '../analytics';

/** Coaching popover pointing at the Settings (Payment Settings) sidebar item,
 *  shown on the order-details screen after returning from the storefront.
 *  Portal + fixed positioning so it overlays the content; dismisses on any click. */
function PaymentsMenuTip( { onDismiss }: { onDismiss: () => void } ) {
  /* Appear 4s after landing on the order details page. */
  const [ shown, setShown ] = useState( false );
  const [ pos, setPos ] = useState< { top: number; left: number } | null >( null );
  useEffect( () => {
    const t = window.setTimeout( () => setShown( true ), 4000 );
    return () => window.clearTimeout( t );
  }, [] );
  useLayoutEffect( () => {
    if ( ! shown ) return;
    const measure = () => {
      const el = document.querySelector( '.wp-sub-item[data-target="payments"]' );
      if ( ! el ) return;
      const r = el.getBoundingClientRect();
      /* Sit close to the "Settings" label (arrow just past the text); overlapping
         the sidebar is fine. */
      setPos( { top: r.top + r.height / 2, left: r.left + 92 } );
    };
    measure();
    window.addEventListener( 'resize', measure );
    window.addEventListener( 'scroll', measure, true );
    return () => {
      window.removeEventListener( 'resize', measure );
      window.removeEventListener( 'scroll', measure, true );
    };
  }, [ shown ] );
  useEffect( () => {
    if ( ! shown ) return;
    const dismiss = () => onDismiss();
    const t = window.setTimeout( () => document.addEventListener( 'mousedown', dismiss ), 0 );
    return () => { window.clearTimeout( t ); document.removeEventListener( 'mousedown', dismiss ); };
  }, [ shown, onDismiss ] );
  if ( ! shown || ! pos ) return null;
  return createPortal(
    <div className="hm-tip hm-tip--right" role="status" style={ { top: pos.top, left: pos.left, width: 236 } }>
      <span className="hm-tip__arrow" aria-hidden />
      <div className="hm-tip__body">
        <span className="hm-tip__title"><span aria-hidden>👉</span> Prototype control</span>
        <span className="hm-tip__text">Open Settings for another way to connect PayPal Wallet</span>
      </div>
      <button type="button" className="hm-tip__close" aria-label="Dismiss" onClick={ onDismiss }>×</button>
    </div>,
    document.body
  );
}

export default function MerchantApp( {
  state,
  setState,
  onViewStore,
  homeTipDismissed = false,
  onDismissHomeTip,
  paymentsTipActive = false,
  onDismissPaymentsTip,
}: {
  state: MerchantState;
  setState: ( updater: ( s: MerchantState ) => MerchantState ) => void;
  /** Open the storefront (shopper track) — wired to the top bar's site name. */
  onViewStore?: () => void;
  /** First-visit "click Add products" popover: whether it's been dismissed. */
  homeTipDismissed?: boolean;
  onDismissHomeTip?: () => void;
  /** Coaching popover on order details pointing at the Settings menu item. */
  paymentsTipActive?: boolean;
  onDismissPaymentsTip?: () => void;
} ) {
  const go = ( screen: MerchantState['screen'] ) => setState( ( s ) => ( { ...s, screen } ) );
  const update = ( patch: Partial< MerchantState > ) => setState( ( s ) => ( { ...s, ...patch } ) );

  /* Pending setup tasks (of 5) — shown as the blue badge on the Home submenu.
     Kept in sync with the Home tasklist: adding products completes both "Add
     your products" and "Launch your store"; connecting PayPal adds "Set up
     payments". */
  const productsDone = state.productsDone || state.paypal === 'active';
  const completedSetup =
    ( productsDone ? 1 : 0 ) + ( state.paypal === 'active' ? 1 : 0 ) + ( productsDone ? 1 : 0 );
  const pendingTasks = 5 - completedSetup;

  /* The PayPal integration popup (mac-browser overlay). Opened from the wallet
     wizard's "Set up PayPal Wallet"; completing it ("Return to WooCommerce")
     marks PayPal connected, then the wizard's CTA spins for 2s before redirecting
     to the Wallet management screen — no "Connecting your account" loader. */
  const [ connectOpen, setConnectOpen ] = useState( false );
  const [ ctaLoading, setCtaLoading ] = useState( false );
  const connectFlow = (
    <PayPalConnectFlow
      open={ connectOpen }
      onClose={ () => setConnectOpen( false ) }
      onComplete={ () => {
        setConnectOpen( false );
        setCtaLoading( true );
        track( 'PayPal Wallet Connected', { integration: 'PayPal Wallet' } );
        update( { paypal: 'active', pendingPayment: false } );
        setTimeout( () => {
          setCtaLoading( false );
          update( { walletTab: 'overview', screen: 'wallet-manage' } );
        }, 2000 );
      } }
    />
  );

  switch ( state.screen ) {
    case 'welcome':
      return <WelcomeStep onNext={ () => go( 'profile' ) } onSkip={ () => go( 'skip-location' ) } />;
    case 'profile':
      return <ProfileStep onNext={ () => go( 'business' ) } onSkip={ () => go( 'business' ) } />;
    case 'business':
      return <BusinessInfoStep onNext={ () => go( 'extensions' ) } onSkip={ () => go( 'extensions' ) } />;
    case 'extensions':
      return <ExtensionsStep onNext={ () => go( 'features-loader' ) } onSkip={ () => go( 'features-loader' ) } />;
    case 'features-loader':
      return (
        <FunLoader
          title="Woo! Let's get your features ready"
          image="/logos/woo/loader-developing.svg"
          delay={ 4000 }
          onDone={ () => go( 'jetpack-connect' ) }
        />
      );
    case 'jetpack-connect':
      return <JetpackConnectStep onConnect={ () => go( 'account-loader' ) } onSwitchUser={ () => go( 'account-loader' ) } />;
    case 'account-loader':
      return (
        <FunLoader
          title="Connecting your account"
          image="/logos/woo/loader-developing.svg"
          delay={ 4000 }
          onDone={ () => go( 'home' ) }
        />
      );

    case 'skip-location':
      return <BusinessLocationStep onNext={ () => go( 'skip-loader' ) } />;
    case 'skip-loader':
      return (
        <FunLoader
          title="Turning on the lights"
          image="/logos/woo/loader-lightbulb.svg"
          fact="Explore powerful extensions and themes at WooCommerce.com to enhance your store."
          delay={ 4000 }
          onDone={ () => go( 'home' ) }
        />
      );

    case 'home':
      return (
        <WpAdminShell activeSub="Home" onSelectSub={ go } onViewStore={ onViewStore } homeBadge={ pendingTasks }>
          <HomeTasklist
            state={ state }
            onConnectPaypal={ () => go( 'wallet-welcome' ) }
            onGoPayments={ () => go( 'payments' ) }
            onCompleteProducts={ () => update( { productsDone: true } ) }
            homeTipDismissed={ homeTipDismissed }
            onDismissHomeTip={ onDismissHomeTip }
          />
        </WpAdminShell>
      );

    case 'orders':
      return (
        <WpAdminShell activeSub="Orders" onSelectSub={ go } onViewStore={ onViewStore } homeBadge={ pendingTasks }>
          <OrdersPage state={ state } onViewOrder={ () => go( 'order-details' ) } />
        </WpAdminShell>
      );

    case 'order-details':
      return (
        <>
          <WpAdminShell activeSub="Orders" onSelectSub={ go } onViewStore={ onViewStore } homeBadge={ pendingTasks }>
            <OrderDetails
              state={ state }
              onConnectPaypal={ () => go( 'wallet-welcome' ) }
            />
          </WpAdminShell>
          { paymentsTipActive && <PaymentsMenuTip onDismiss={ () => onDismissPaymentsTip?.() } /> }
        </>
      );

    case 'payments':
      return (
        <WpAdminShell activeSub="Settings" onSelectSub={ go } onViewStore={ onViewStore } homeBadge={ pendingTasks }>
          <PaymentsSettings
            state={ state }
            onCompleteSetup={ () => go( 'wallet-welcome' ) }
            onManage={ () => update( { screen: 'wallet-manage', walletTab: 'overview' } ) }
          />
        </WpAdminShell>
      );

    case 'wallet-welcome':
      return (
        <WpAdminShell activeSub="Settings" onSelectSub={ go } onViewStore={ onViewStore } homeBadge={ pendingTasks }>
          <WalletWizard
            onBack={ () => go( 'payments' ) }
            onConnect={ () => setConnectOpen( true ) }
            loading={ ctaLoading }
            pendingOrder={ state.pendingPayment && state.paypal !== 'active' }
          />
          { connectFlow }
        </WpAdminShell>
      );

    case 'wallet-connecting':
      return (
        <WpAdminShell activeSub="Settings" onSelectSub={ go } onViewStore={ onViewStore } homeBadge={ pendingTasks }>
          <FunLoader
            title="Connecting your account"
            image="/logos/woo/loader-openingthedoors.svg"
            delay={ 4000 }
            onDone={ () => update( { paypal: 'active', pendingPayment: false, screen: 'wallet-manage', walletTab: 'overview' } ) }
          />
        </WpAdminShell>
      );

    case 'wallet-manage':
      return (
        <WpAdminShell activeSub="Settings" onSelectSub={ go } onViewStore={ onViewStore } homeBadge={ pendingTasks }>
          <WalletManage
            state={ state }
            onBack={ () => go( 'payments' ) }
            onTab={ ( tab: WalletTab ) => update( { walletTab: tab } ) }
            update={ update }
          />
        </WpAdminShell>
      );
  }
}

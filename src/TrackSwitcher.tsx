/**
 * The floating prototype control, pinned bottom-left over the chrome. Its first
 * choice is the track (Merchant / Shopper). For the merchant track it also jumps
 * to any screen and flips the two states that make screens differ — PayPal
 * connected, and a payment pending — so the whole flow is demoable without
 * clicking through it.
 */
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@wordpress/ui';
import { chevronUp } from '@wordpress/icons';
import { SwitcherDivider, SwitcherLabel, SwitcherRadio, SwitcherToggle } from './switcherUi';
import { TRACK_IDS, TRACK_LABEL, type Track } from './tracks';
import {
  MERCHANT_SCREENS, SCREEN_LABEL, type MerchantScreen, type MerchantState, type PayPalStatus,
} from './merchant/flow';
import {
  SHOPPER_SCREENS, SHOPPER_SCREEN_LABEL, type ShopperScreen, type ShopperState,
} from './shopper/flow';

export default function TrackSwitcher( {
  track,
  onTrack,
  merchant,
  setMerchant,
  shopper,
  setShopper,
}: {
  track: Track;
  onTrack: ( t: Track ) => void;
  merchant: MerchantState;
  setMerchant: ( updater: ( s: MerchantState ) => MerchantState ) => void;
  shopper: ShopperState;
  setShopper: ( updater: ( s: ShopperState ) => ShopperState ) => void;
} ) {
  const [ open, setOpen ] = useState( false );
  const btnRef = useRef< HTMLButtonElement >( null );
  const popRef = useRef< HTMLDivElement >( null );

  useEffect( () => {
    if ( ! open ) return;
    const onDown = ( e: MouseEvent ) => {
      const t = e.target as Node;
      if ( ! popRef.current?.contains( t ) && ! btnRef.current?.contains( t ) ) setOpen( false );
    };
    const onKey = ( e: KeyboardEvent ) => e.key === 'Escape' && setOpen( false );
    document.addEventListener( 'mousedown', onDown );
    document.addEventListener( 'keydown', onKey );
    return () => {
      document.removeEventListener( 'mousedown', onDown );
      document.removeEventListener( 'keydown', onKey );
    };
  }, [ open ] );

  const detail = track === 'merchant'
    ? SCREEN_LABEL[ merchant.screen ]
    : SHOPPER_SCREEN_LABEL[ shopper.screen ];

  const goScreen = ( screen: MerchantScreen ) => setMerchant( ( s ) => ( { ...s, screen } ) );
  const setPaypal = ( paypal: PayPalStatus ) => setMerchant( ( s ) => ( { ...s, paypal } ) );
  const goShopper = ( screen: ShopperScreen ) => setShopper( ( s ) => ( { ...s, screen } ) );

  return (
    <div className="store-switcher">
      <button
        ref={ btnRef }
        type="button"
        className="store-switcher__btn"
        onClick={ () => setOpen( ( o ) => ! o ) }
        aria-haspopup="menu"
        aria-expanded={ open }
      >
        <span className="store-switcher__btn-label">
          <span className="store-switcher__btn-caption">Prototype</span>
          <span className="store-switcher__btn-value">
            { TRACK_LABEL[ track ] }
            { detail && <span className="store-switcher__btn-detail"> · { detail.replace( /^.*· /, '' ) }</span> }
          </span>
        </span>
        <Icon icon={ chevronUp } size={ 20 } />
      </button>

      { open && (
        <div ref={ popRef } className="store-switcher__popup" role="menu">
          <SwitcherLabel>Track</SwitcherLabel>
          { TRACK_IDS.map( ( t ) => (
            <SwitcherRadio
              key={ t }
              label={ TRACK_LABEL[ t ] }
              checked={ track === t }
              onClick={ () => { onTrack( t ); setOpen( false ); } }
            />
          ) ) }

          { track === 'merchant' && (
            <>
              <SwitcherDivider />
              <SwitcherLabel>Go to screen</SwitcherLabel>
              { MERCHANT_SCREENS.map( ( screen ) => (
                <SwitcherRadio
                  key={ screen }
                  label={ SCREEN_LABEL[ screen ] }
                  checked={ merchant.screen === screen }
                  onClick={ () => goScreen( screen ) }
                />
              ) ) }

              <SwitcherDivider />
              <SwitcherLabel>PayPal status</SwitcherLabel>
              { ( [ 'needs_action', 'active' ] as PayPalStatus[] ).map( ( st ) => (
                <SwitcherRadio
                  key={ st }
                  label={ st === 'active' ? 'Active (connected)' : 'Needs action' }
                  checked={ merchant.paypal === st }
                  onClick={ () => setPaypal( st ) }
                />
              ) ) }

              <SwitcherDivider />
              <SwitcherToggle
                label="Payment pending banner"
                checked={ merchant.pendingPayment }
                onClick={ () => setMerchant( ( s ) => ( { ...s, pendingPayment: ! s.pendingPayment } ) ) }
              />
            </>
          ) }

          { track === 'shopper' && (
            <>
              <SwitcherDivider />
              <SwitcherLabel>Go to screen</SwitcherLabel>
              { SHOPPER_SCREENS.map( ( screen ) => (
                <SwitcherRadio
                  key={ screen }
                  label={ SHOPPER_SCREEN_LABEL[ screen ] }
                  checked={ shopper.screen === screen }
                  onClick={ () => goShopper( screen ) }
                />
              ) ) }
            </>
          ) }
        </div>
      ) }
    </div>
  );
}

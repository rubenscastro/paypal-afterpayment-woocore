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
  onReset,
}: {
  track: Track;
  onTrack: ( t: Track ) => void;
  merchant: MerchantState;
  setMerchant: ( updater: ( s: MerchantState ) => MerchantState ) => void;
  shopper: ShopperState;
  setShopper: ( updater: ( s: ShopperState ) => ShopperState ) => void;
  onReset: () => void;
} ) {
  const [ open, setOpen ] = useState( false );
  /* Reveal the control only when the cursor is in the bottom-left corner — within
     the bottom 120px AND the left 200px (keep it up while the panel is open so it
     can't vanish mid-use). */
  const [ inCorner, setInCorner ] = useState( false );
  const btnRef = useRef< HTMLButtonElement >( null );
  const popRef = useRef< HTMLDivElement >( null );

  useEffect( () => {
    const onMove = ( e: MouseEvent ) => {
      const near = e.clientY >= window.innerHeight - 120 && e.clientX <= 200;
      setInCorner( ( prev ) => ( prev === near ? prev : near ) );
    };
    window.addEventListener( 'mousemove', onMove );
    return () => window.removeEventListener( 'mousemove', onMove );
  }, [] );

  const revealed = open || inCorner;

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

  const goScreen = ( screen: MerchantScreen ) => setMerchant( ( s ) => ( { ...s, screen } ) );
  const setPaypal = ( paypal: PayPalStatus ) => setMerchant( ( s ) => ( { ...s, paypal } ) );
  const goShopper = ( screen: ShopperScreen ) => setShopper( ( s ) => ( { ...s, screen } ) );

  return (
    <div className={ `store-switcher${ revealed ? ' is-revealed' : '' }` }>
      <button
        ref={ btnRef }
        type="button"
        className="store-switcher__btn"
        onClick={ () => setOpen( ( o ) => ! o ) }
        aria-haspopup="menu"
        aria-expanded={ open }
      >
        <span className="store-switcher__btn-value">Prototype settings</span>
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
              <select
                className="ts-select"
                value={ merchant.screen }
                onChange={ ( e ) => goScreen( e.target.value as MerchantScreen ) }
              >
                { MERCHANT_SCREENS.map( ( screen ) => (
                  <option key={ screen } value={ screen }>{ SCREEN_LABEL[ screen ] }</option>
                ) ) }
              </select>

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
                label="Products added"
                checked={ merchant.productsDone }
                onClick={ () => setMerchant( ( s ) => ( { ...s, productsDone: ! s.productsDone } ) ) }
              />
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
              <select
                className="ts-select"
                value={ shopper.screen }
                onChange={ ( e ) => goShopper( e.target.value as ShopperScreen ) }
              >
                { SHOPPER_SCREENS.map( ( screen ) => (
                  <option key={ screen } value={ screen }>{ SHOPPER_SCREEN_LABEL[ screen ] }</option>
                ) ) }
              </select>
            </>
          ) }

          <SwitcherDivider />
          <button
            type="button"
            className="ts-reset"
            onClick={ () => { onReset(); setOpen( false ); } }
          >
            Reset prototype
          </button>
        </div>
      ) }
    </div>
  );
}

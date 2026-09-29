/**
 * The PayPal integration flow, shown as a "mac mini browser" popup over a black
 * overlay when the merchant clicks "Set up PayPal Wallet". It reproduces the
 * six screens from the Figma "PayPal Payments Integration → PayPal Connection
 * Flow" (node 11488-61384): the initial load, the Connect-account form, the
 * PayPal login, the post-login load, the account-type choice, and "You're all
 * set!". Loading screens auto-advance; the form screens advance on their CTA.
 * "Return to WooCommerce" calls onComplete (which hands back to the Woo
 * "Connecting your account" loader), the red traffic light / overlay cancels.
 */
import { useEffect, useRef, useState } from 'react';

type Step =
  | 'loading'
  | 'connect'
  | 'login'
  | 'login-loading'
  | 'account'
  | 'account-loading'
  | 'done';

/** Chrome (tab title + address) per step, matching the Figma screenshots. */
const CHROME: Record< Step, { title: string; url: string; blank?: boolean } > = {
  loading: { title: 'about:blank', url: 'about:blank', blank: true },
  connect: { title: 'Connect a PayPal account to start accepting payments on WooCommerce', url: 'paypal.com/bizsignup/partner#/checkAccount' },
  login: { title: 'Log in to your PayPal account', url: 'paypal.com/signin?returnUri=https%3A%2F%2F…' },
  'login-loading': { title: 'Log in to your PayPal account', url: 'paypal.com/signin?returnUri=https%3A%2F%2F…' },
  account: { title: 'Set up your business account - PayPal', url: 'paypal.com/unifiedonboarding/sellerIntentDecisionExisting' },
  'account-loading': { title: 'Set up your business account - PayPal', url: 'paypal.com/unifiedonboarding/sellerIntentDecisionExisting' },
  done: { title: 'Set up your business account - PayPal', url: 'paypal.com/unifiedonboarding/casualSellerDone' },
};

/* ---- Brand marks: the exact PayPal SVGs supplied for each screen. ---- */

/** Two-tone colored PayPal wordmark (loading screen + connect-screen header). */
function PPWordmarkColor( { size = 30 }: { size?: number } ) {
  return <img className="ppc-mark" src="/logos/paypal/pp-wordmark-color.svg" alt="PayPal" style={ { height: size } } />;
}

/** Black PayPal wordmark (the login / password screen). */
function PPWordmarkBlack( { size = 28 }: { size?: number } ) {
  return <img className="ppc-mark" src="/logos/paypal/pp-wordmark-black.svg" alt="PayPal" style={ { height: size } } />;
}

/** PayPal PP monogram (account-type + "You're all set!" screens). */
function PPMonogram( { size = 40 }: { size?: number } ) {
  return <img className="ppc-mark" src="/logos/paypal/pp-monogram.svg" alt="PayPal" style={ { height: size } } />;
}

/** The "You're all set!" overlapping-cards illustration (supplied asset). */
function CardsArt() {
  return <img className="ppc-cards" src="/logos/paypal/pp-cards.svg" alt="" width={ 96 } height={ 96 } aria-hidden />;
}

function AcornIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 9.5h14a0 0 0 0 1 0 0c0 4.7-3.1 8-7 8s-7-3.3-7-8a0 0 0 0 1 0 0z" stroke="#111" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M4.5 9.5c0-1.3 1-2.4 2.3-2.4h10.4c1.3 0 2.3 1.1 2.3 2.4" stroke="#111" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M12 7V4.5" stroke="#111" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/* ---- Address-bar glyphs ---- */
function SlidersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="8" cy="7" r="2.2" stroke="#c9c9cf" strokeWidth="1.6" />
      <circle cx="16" cy="17" r="2.2" stroke="#c9c9cf" strokeWidth="1.6" />
      <path d="M10.2 7H20M4 7h1.8M4 17h9.8M18.2 17H20" stroke="#c9c9cf" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="#c9c9cf" strokeWidth="1.6" />
      <path d="M12 11v5M12 8h.01" stroke="#c9c9cf" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 4v10m0 0 4-4m-4 4-4-4M5 19h14" stroke="#c9c9cf" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function KeyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="8" cy="12" r="3.2" stroke="#c9c9cf" strokeWidth="1.6" />
      <path d="M11 12h9m-3 0v3m-3-3v2" stroke="#c9c9cf" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function PayPalConnectFlow( {
  open,
  onClose,
  onComplete,
}: {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
} ) {
  const [ step, setStep ] = useState< Step >( 'loading' );
  const [ account, setAccount ] = useState< 'business' | 'personal' >( 'business' );
  const timer = useRef< ReturnType< typeof setTimeout > >();

  /* Reset to the first screen each time the popup opens. */
  useEffect( () => {
    if ( open ) {
      setStep( 'loading' );
      setAccount( 'business' );
    }
  }, [ open ] );

  /* Auto-advance the loading screens. */
  useEffect( () => {
    if ( ! open ) return;
    clearTimeout( timer.current );
    if ( step === 'loading' ) {
      timer.current = setTimeout( () => setStep( 'connect' ), 1900 );
    } else if ( step === 'login-loading' ) {
      timer.current = setTimeout( () => setStep( 'account' ), 1900 );
    } else if ( step === 'account-loading' ) {
      timer.current = setTimeout( () => setStep( 'done' ), 1900 );
    }
    return () => clearTimeout( timer.current );
  }, [ step, open ] );

  if ( ! open ) return null;

  const chrome = CHROME[ step ];
  const go = ( s: Step ) => setStep( s );

  /* Closing the popup on the final "You're all set!" screen means the same thing
     as clicking "Return to WooCommerce" — the account is connected, so hand back
     to Woo (onComplete) rather than cancelling (onClose). */
  const handleClose = () => ( step === 'done' ? onComplete() : onClose() );

  return (
    <div className="ppc-overlay" onClick={ handleClose }>
      <div className="ppc-window" role="dialog" aria-label="PayPal integration" onClick={ ( e ) => e.stopPropagation() }>
        {/* Title bar */}
        <div className="ppc-titlebar">
          <div className="ppc-lights">
            <button type="button" className="ppc-light ppc-light--red" aria-label="Close" onClick={ handleClose } />
            <span className="ppc-light ppc-light--amber" />
            <span className="ppc-light ppc-light--green" />
          </div>
          <span className="ppc-title">{ chrome.title }</span>
        </div>
        {/* Address bar */}
        <div className="ppc-address">
          <span className="ppc-address__lead">{ chrome.blank ? <InfoIcon /> : <SlidersIcon /> }</span>
          <span className="ppc-url">{ chrome.url }</span>
          <span className="ppc-address__tail">
            { ! chrome.blank && <KeyIcon /> }
            <DownloadIcon />
          </span>
        </div>

        {/* Viewport */}
        <div className={ `ppc-viewport${ chrome.blank ? ' ppc-viewport--blank' : '' }` }>
          { ( step === 'loading' ) && (
            <div className="ppc-loading">
              <PPWordmarkColor size={ 30 } />
              <span className="ppc-spinner" aria-label="Loading" />
            </div>
          ) }

          { step === 'connect' && (
            <div className="ppc-page">
              <div className="ppc-page__logo"><PPWordmarkColor size={ 22 } /></div>
              <div className="ppc-band" />
              <div className="ppc-connect">
                <h1 className="ppc-connect__title">Connect a PayPal account to start accepting payments on WooCommerce</h1>
                <p className="ppc-connect__lede">It’s free to connect, whether you have an existing PayPal account, or want to create a new account.</p>
                <label className="ppc-field">
                  <input className="ppc-input" type="email" placeholder="Email" defaultValue="test@store.com" />
                </label>
                <label className="ppc-field ppc-select">
                  <span className="ppc-select__label">Country or region</span>
                  <span className="ppc-select__value">United States</span>
                  <span className="ppc-select__chevron" aria-hidden>⌄</span>
                </label>
                <button type="button" className="ppc-btn ppc-btn--blue" onClick={ () => go( 'login' ) }>Next</button>
              </div>
              <div className="ppc-footer ppc-footer--pipes">
                <span>Privacy Statement</span><span>Legal agreements</span><span>Help</span><span>Contact Us</span>
              </div>
            </div>
          ) }

          { ( step === 'login' || step === 'login-loading' ) && (
            <div className={ `ppc-page ppc-login${ step === 'login-loading' ? ' is-loading' : '' }` }>
              <div className="ppc-login__logo"><PPWordmarkBlack size={ 30 } /></div>
              <p className="ppc-login__id">
                test@store.com <a href="#" onClick={ ( e ) => e.preventDefault() }>Change</a>
              </p>
              <label className="ppc-field">
                <input className="ppc-input ppc-input--tall" type="password" placeholder="Password" defaultValue="Woo!PayPal2024" />
              </label>
              <a className="ppc-link ppc-link--left" href="#" onClick={ ( e ) => e.preventDefault() }>Forgot password?</a>
              <button type="button" className="ppc-btn ppc-btn--pillblue" onClick={ () => go( 'login-loading' ) }>Log In</button>
              <a className="ppc-link ppc-link--center" href="#" onClick={ ( e ) => e.preventDefault() }>Try another way</a>
              <div className="ppc-lang">
                <span className="ppc-flag" aria-hidden>🇺🇸</span>
                <svg className="ppc-lang__chevron" width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M6 9l6 6 6-6" stroke="#6c7378" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="ppc-lang__list"><strong>English</strong> | Français | Español | 中文</span>
              </div>
              <div className="ppc-footer ppc-login__footer">
                <span>Contact Us</span><span>Privacy</span><span>Legal</span><span>Policy Updates</span><span>Worldwide</span>
              </div>
              { step === 'login-loading' && <span className="ppc-spinner ppc-spinner--overlay" aria-label="Loading" /> }
            </div>
          ) }

          { ( step === 'account' || step === 'account-loading' ) && (
            <div className={ `ppc-page ppc-account${ step === 'account-loading' ? ' is-loading' : '' }` }>
              <div className="ppc-account__logo"><PPMonogram size={ 44 } /></div>
              <h1 className="ppc-account__title">You logged into a personal account. How do you want to continue?</h1>
              <button
                type="button"
                className={ `ppc-choice${ account === 'business' ? ' is-selected' : '' }` }
                onClick={ () => setAccount( 'business' ) }
              >
                <span className="ppc-choice__icon"><AcornIcon /></span>
                <span className="ppc-choice__text">
                  <strong>Connect a PayPal business account to WooCommerce</strong>
                  <span>Start using more features to help you grow your business.</span>
                </span>
              </button>
              <button
                type="button"
                className="ppc-choice is-disabled"
                disabled
                aria-disabled="true"
              >
                <span className="ppc-choice__icon"><AcornIcon /></span>
                <span className="ppc-choice__text">
                  <strong>Connect your personal account to WooCommerce</strong>
                  <span>Take payments with your personal account. No new features.</span>
                </span>
              </button>
              <button type="button" className="ppc-btn ppc-btn--pillblack" onClick={ () => go( 'account-loading' ) }>Next</button>
              { step === 'account-loading' && <span className="ppc-spinner ppc-spinner--overlay" aria-label="Loading" /> }
            </div>
          ) }

          { step === 'done' && (
            <div className="ppc-page ppc-done">
              <div className="ppc-done__logo"><PPMonogram size={ 44 } /></div>
              <CardsArt />
              <h1 className="ppc-done__title">You’re all set!</h1>
              <p className="ppc-done__lede">You’re ready to take payments on your WooCommerce site with your PayPal account.</p>
              <button type="button" className="ppc-btn ppc-btn--pillblack" onClick={ onComplete }>Return to WooCommerce</button>
              <a className="ppc-link ppc-link--center ppc-link--underline" href="#" onClick={ ( e ) => e.preventDefault() }>Go to your PayPal account</a>
              <div className="ppc-done__links">
                <span>Help</span><span>Contact</span><span>Sitemap</span><span>Fees</span><span>Security</span><span>About</span>
              </div>
              <div className="ppc-done__links"><span>Developers</span><span>Partners</span></div>
              <div className="ppc-done__rule" />
              <p className="ppc-done__lang">English</p>
              <p className="ppc-done__copy">Copyright © 1999-2025 PayPal. All rights reserved.</p>
            </div>
          ) }
        </div>
      </div>
    </div>
  );
}

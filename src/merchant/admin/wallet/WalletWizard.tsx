/**
 * The PayPal Wallet onboarding entry ("Welcome to PayPal Wallet"): the hero with
 * the "Set up PayPal Wallet" CTA that kicks off the connect flow, plus the
 * feature rundown (Pay with PayPal, Pay Later, Venmo, Crypto) and pricing.
 */
import { Icon } from '@wordpress/components';
import { IconButton } from '@wordpress/ui';
import { chevronLeft, chevronDown } from '@wordpress/icons';

const FEATURES = [
  { title: 'Pay with PayPal', logo: '/logos/paypal/paypal-black.svg', desc: 'Our brand recognition helps give customers the confidence to buy.', learn: true },
  { title: 'Pay Later', logo: '/logos/paypal/paypal-icon.svg', desc: 'Offer installment payment options and get paid upfront - at no extra cost to you.', learn: true },
  { title: 'Venmo', logo: '/logos/paypal/venmo-small.svg', desc: 'Automatically offer Venmo checkout to millions of active users.', learn: true },
  { title: 'Crypto', logo: '/logos/paypal/crypto.svg', desc: 'Let customers checkout with Crypto while you get paid in cash.', learn: true },
];

export default function WalletWizard( {
  onBack,
  onConnect,
  loading = false,
}: {
  onBack: () => void;
  onConnect: () => void;
  /** After the connect popup closes, the CTA spins for a moment before redirect. */
  loading?: boolean;
} ) {
  return (
    <div className="ww">
      <header className="ww-subbar">
        <IconButton className="ww-back" icon={ chevronLeft } label="Back" variant="minimal" tone="neutral" onClick={ onBack } />
        <span className="ww-subbar__title">PayPal Wallet</span>
      </header>

      <div className="ww-body">
        <div className="ww-hero">
          <img className="ww-hero__icon" src="/logos/paypal/paypalwallet.svg" alt="" width={ 64 } height={ 64 } />
          <h1 className="ww-hero__title">Welcome to PayPal Wallet</h1>
          <p className="ww-hero__lede">
            Your all-in-one integration for PayPal checkout solutions that enable
            buyers to pay via PayPal, Venmo, Pay Later, and Crypto.
          </p>
          <div className="ww-hero__logos">
            <img src="/logos/paypal/paypal-black.svg" alt="PayPal" height={ 24 } />
            <img src="/logos/paypal/paypal-icon.svg" alt="" height={ 24 } />
            <img src="/logos/paypal/venmo-small.svg" alt="Venmo" height={ 24 } />
            <img src="/logos/paypal/crypto.svg" alt="Crypto" height={ 24 } />
          </div>
          <p className="ww-hero__hint">
            Click the button below to be guided through connecting your existing
            PayPal account or creating a new one. You will be able to choose the
            payment options that are right for your store.
          </p>
          <button type="button" className="ww-cta" onClick={ onConnect } disabled={ loading }>
            <span className={ `ww-cta__label${ loading ? ' is-hidden' : '' }` }>Set up PayPal Wallet</span>
            { loading && <span className="ww-cta__spinner" aria-label="Connecting" /> }
          </button>
        </div>

        <hr className="ww-divider" />

        <div className="ww-features">
          <div className="ww-features__intro">
            <h2 className="ww-features__title">
              PayPal Wallet <span className="ww-pill">from 3.49% + $0.49 USD¹</span>
            </h2>
            <p>Our all-in-one checkout solution lets you offer PayPal, Venmo, Pay Later options, and more to help maximise conversion.</p>
          </div>

          <h3 className="ww-included">Included in PayPal Wallet</h3>
          <ul className="ww-feature-list">
            { FEATURES.map( ( f ) => (
              <li key={ f.title } className="ww-feature">
                <div className="ww-feature__head">
                  <span className="ww-feature__title">{ f.title }</span>
                  <img className="ww-feature__logo" src={ f.logo } alt="" />
                </div>
                <p className="ww-feature__desc">
                  { f.desc }{ ' ' }
                  { f.learn && <a href="#" onClick={ ( e ) => e.preventDefault() }>Learn more</a> }
                </p>
              </li>
            ) ) }
          </ul>

          <p className="ww-footnote">
            ¹Prices based on domestic transactions as of October 25th, 2024.{ ' ' }
            <a href="#" onClick={ ( e ) => e.preventDefault() }>Click here</a> for full pricing details.
          </p>

          <div className="ww-or"><span>OR</span></div>
          <button type="button" className="ww-advanced">
            See advanced options <Icon icon={ chevronDown } size={ 20 } />
          </button>
        </div>
      </div>
    </div>
  );
}

/** Checkout — WooCommerce Blocks checkout with the PayPal express + gateway. */
import { useState } from 'react';
import EpmButtons from './EpmButtons';
import { useReady } from './useReady';
import { CheckoutSkeleton } from './Skeletons';

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="9" cy="20" r="1.4" fill="currentColor" />
      <circle cx="18" cy="20" r="1.4" fill="currentColor" />
      <path d="M2 3h2.5l2.2 12.2a1.5 1.5 0 0 0 1.5 1.2h9.3a1.5 1.5 0 0 0 1.5-1.2L21 7H6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckoutHeader( { cartCount }: { cartCount: number } ) {
  return (
    <header className="co-header">
      <span className="co-header__brand">Raven Of Sacreds</span>
      <span className="co-header__cart"><CartIcon />{ cartCount > 0 && <span className="sh-cart__badge">{ cartCount }</span> }</span>
    </header>
  );
}

function Field( { label, value, optional }: { label: string; value?: string; optional?: boolean } ) {
  return (
    <label className="co-field">
      { value ? <span className="co-field__label">{ label }</span> : null }
      <input className="co-field__input" defaultValue={ value } placeholder={ value ? undefined : `${ label }${ optional ? ' (optional)' : '' }` } />
    </label>
  );
}

export default function CheckoutPage( { onPay, cartCount }: { onPay: () => void; cartCount: number } ) {
  const [ delivery, setDelivery ] = useState< 'ship' | 'pickup' >( 'ship' );
  const [ sameBilling, setSameBilling ] = useState( true );
  const [ optIn, setOptIn ] = useState( false );
  const [ note, setNote ] = useState( false );
  const ready = useReady( 'checkout' );

  if ( ! ready ) {
    return (
      <div className="co">
        <CheckoutHeader cartCount={ cartCount } />
        <CheckoutSkeleton />
      </div>
    );
  }

  return (
    <div className="co">
      <CheckoutHeader cartCount={ cartCount } />

      <div className="co-body">
        <div className="co-main">
          {/* Express checkout */}
          <div className="co-express">
            <div className="co-divider"><span>Express Checkout</span></div>
            <EpmButtons onPay={ onPay } />
            <div className="co-divider co-divider--plain"><span>Or continue below</span></div>
          </div>

          {/* Contact */}
          <section className="co-section">
            <div className="co-section__head">
              <h2 className="co-h2">Contact information</h2>
              <a className="co-login">Log in</a>
            </div>
            <Field label="Email address" />
            <label className="co-check">
              <input type="checkbox" checked={ optIn } onChange={ ( e ) => setOptIn( e.target.checked ) } />
              <span>I would like to receive exclusive emails with discounts and product information.</span>
            </label>
          </section>

          {/* Delivery */}
          <section className="co-section">
            <h2 className="co-h2">Delivery</h2>
            <div className="co-toggle">
              <button type="button" className={ `co-toggle__opt${ delivery === 'ship' ? ' is-active' : '' }` } onClick={ () => setDelivery( 'ship' ) }>
                <span className="co-toggle__title">🚚 Ship</span>
                <span className="co-toggle__sub">Sub description</span>
              </button>
              <button type="button" className={ `co-toggle__opt${ delivery === 'pickup' ? ' is-active' : '' }` } onClick={ () => setDelivery( 'pickup' ) }>
                <span className="co-toggle__title">🏬 Pickup</span>
                <span className="co-toggle__sub">Sub description</span>
              </button>
            </div>
          </section>

          {/* Shipping address */}
          <section className="co-section">
            <h2 className="co-h2">Shipping address</h2>
            <label className="co-field co-select">
              <span className="co-field__label">Country/Region</span>
              <select className="co-field__input" defaultValue="US"><option value="US">United States (US)</option></select>
            </label>
            <div className="co-row-2">
              <Field label="First name" />
              <Field label="Last name" />
            </div>
            <label className="co-field co-field--search">
              <input className="co-field__input" placeholder="Address" />
              <svg className="co-field__icon" width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6"/><path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            </label>
            <a className="co-add-line">+ Add apartment, suite number, etc.</a>
            <div className="co-row-2">
              <Field label="City" />
              <label className="co-field co-select">
                <span className="co-field__label">State</span>
                <select className="co-field__input" defaultValue="AL"><option value="AL">Alabama</option></select>
              </label>
            </div>
            <div className="co-row-2">
              <Field label="ZIP Code" />
              <Field label="Phone" optional />
            </div>
            <label className="co-check">
              <input type="checkbox" checked={ sameBilling } onChange={ ( e ) => setSameBilling( e.target.checked ) } />
              <span>Use same address for billing</span>
            </label>
          </section>

          {/* Shipping options */}
          <section className="co-section">
            <h2 className="co-h2">Shipping options</h2>
            <div className="co-empty">Enter a shipping address to view shipping options.</div>
          </section>

          {/* Payment */}
          <section className="co-section">
            <h2 className="co-h2">Payment options</h2>
            <div className="co-payment is-selected">
              <span className="co-radio" aria-hidden><span /></span>
              <div className="co-payment__body">
                <span className="co-payment__title">Paypal</span>
                <span className="co-payment__desc">Clicking "Proceed to PayPal" will redirect you to PayPal to complete your purchase.</span>
              </div>
              <img className="co-payment__logo" src="/logos/paypal.svg" alt="" width={ 28 } height={ 28 } />
            </div>
          </section>

          <label className="co-check co-note">
            <input type="checkbox" checked={ note } onChange={ ( e ) => setNote( e.target.checked ) } />
            <span>Add a note to your order</span>
          </label>

          <button type="button" className="co-place" onClick={ onPay }>Proceed to PayPal</button>
          <p className="co-terms">
            By proceeding with your purchase you agree to our{ ' ' }
            <a href="#" onClick={ ( e ) => e.preventDefault() }>Terms and Conditions</a> and{ ' ' }
            <a href="#" onClick={ ( e ) => e.preventDefault() }>Privacy Policy</a>.
          </p>
        </div>

        {/* Order summary */}
        <aside className="co-summary">
          <h2 className="co-summary__title">Order summary</h2>
          { [ 0, 1 ].map( ( i ) => (
            <div key={ i } className="co-line">
              <div className="co-line__thumb">
                <span className="co-line__qty">1</span>
              </div>
              <div className="co-line__info">
                <span className="co-line__name">Product name</span>
                <span className="co-line__price"><s>$26.00</s> $20.00</span>
                <span className="co-line__attrs">Size: Medium / Material: Porcelain / Attribute: Value /</span>
              </div>
              <span className="co-line__total">$20.00</span>
            </div>
          ) ) }
          <div className="co-summary__links">
            <a>🏷 Add a coupon</a>
            <a>🎁 Add a gift card</a>
          </div>
          <dl className="co-totals">
            <div><dt>Subtotal</dt><dd>$40.00</dd></div>
            <div><dt>Delivery</dt><dd className="co-totals__muted">Enter address to calculate</dd></div>
            <div><dt>Taxes</dt><dd>$2.40</dd></div>
          </dl>
          <div className="co-grandtotal">
            <span>Total</span>
            <span className="co-grandtotal__amt">$42.40 <span>USD</span></span>
          </div>
          <p className="co-taxnote">Includes $2.40 tax</p>
        </aside>
      </div>
    </div>
  );
}

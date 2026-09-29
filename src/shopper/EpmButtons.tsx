/**
 * PayPal express payment method (EPM) buttons — the smart buttons shown on the
 * product, cart and checkout pages: PayPal (gold), Pay Later (gold), Venmo (blue).
 * `layout="row"` sits them side by side (product/checkout), `layout="stack"`
 * stacks them full-width (cart totals). Clicking any of them opens the PayPal
 * payment-flow modal via `onPay`.
 */
export default function EpmButtons( {
  layout = 'row',
  onPay,
}: {
  layout?: 'row' | 'stack';
  onPay?: () => void;
} ) {
  return (
    <div className={ `epm epm--${ layout }` }>
      <button type="button" className="epm-btn epm-btn--gold" aria-label="PayPal" onClick={ onPay }>
        <img src="/logos/paypal/epm-paypal.svg" alt="PayPal" height={ 22 } />
      </button>
      <button type="button" className="epm-btn epm-btn--gold" aria-label="Pay Later" onClick={ onPay }>
        <img src="/logos/paypal/epm-paylater.svg" alt="PayPal Pay Later" height={ 22 } />
      </button>
      <button type="button" className="epm-btn epm-btn--venmo" aria-label="Venmo" onClick={ onPay }>
        <img src="/logos/paypal/epm-venmo.svg" alt="Venmo" height={ 16 } />
      </button>
    </div>
  );
}

/**
 * Order received — the WooCommerce order-confirmation layout (ticket-style order
 * info panel + order details table + addresses), rendered in the "Raven Of
 * Sacreds" storefront visuals. Reached after completing the PayPal payment flow.
 */
import { productById, type ShopperScreen } from './flow';
import { useReady } from './useReady';
import { OrderReceivedSkeleton } from './Skeletons';

export default function OrderReceivedPage( {
  onNavigate,
}: {
  onNavigate: ( s: ShopperScreen ) => void;
} ) {
  const product = productById( 'album' );
  const price = product.salePrice ?? product.price;
  const ready = useReady( 'order-received', 900 );
  if ( ! ready ) return <OrderReceivedSkeleton />;

  return (
    <div className="or">
      <nav className="sh-crumbs">
        <a onClick={ () => onNavigate( 'shop' ) }>Home</a> /{ ' ' }
        <a onClick={ () => onNavigate( 'checkout' ) }>Checkout</a> / <span>Order received</span>
      </nav>
      <h1 className="sh-page-title">Order received</h1>
      <p className="or-thanks">Thank you. Your order has been received.</p>

      <div className="or-ticket">
        <div className="or-ticket__row"><span className="or-ticket__label">Order number:</span><span className="or-ticket__value">233</span></div>
        <div className="or-ticket__row"><span className="or-ticket__label">Date:</span><span className="or-ticket__value">September 28, 2026</span></div>
        <div className="or-ticket__row"><span className="or-ticket__label">Email:</span><span className="or-ticket__value">shopper@example.com</span></div>
        <div className="or-ticket__row"><span className="or-ticket__label">Total:</span><span className="or-ticket__value">${ price.toFixed( 2 ) } USD</span></div>
        <div className="or-ticket__row"><span className="or-ticket__label">Payment method:</span><span className="or-ticket__value">PayPal</span></div>
      </div>

      <h2 className="or-h2">Order details</h2>
      <table className="or-details">
        <thead>
          <tr><th>Product</th><th>Total</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><a onClick={ () => onNavigate( 'product' ) }>{ product.name }</a> <span className="or-qty">× 1</span></td>
            <td>${ price.toFixed( 2 ) }</td>
          </tr>
        </tbody>
        <tfoot>
          <tr><th>Subtotal:</th><td>${ price.toFixed( 2 ) }</td></tr>
          <tr><th>Shipping:</th><td>Free shipping</td></tr>
          <tr><th>Total:</th><td>${ price.toFixed( 2 ) } USD</td></tr>
          <tr><th>Payment method:</th><td>PayPal</td></tr>
        </tfoot>
      </table>

      <div className="or-addresses">
        <div className="or-address">
          <h2 className="or-h2">Billing address</h2>
          <address>
            Jamie Rivers<br />
            185 South Congress<br />
            Austin, TX 78701<br />
            shopper@example.com
          </address>
        </div>
        <div className="or-address">
          <h2 className="or-h2">Shipping address</h2>
          <address>
            Jamie Rivers<br />
            185 South Congress<br />
            Austin, TX 78701
          </address>
        </div>
      </div>
    </div>
  );
}

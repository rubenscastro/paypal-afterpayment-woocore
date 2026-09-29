/**
 * Order received — the WooCommerce order-confirmation layout (ticket-style order
 * info panel + order details table + addresses), rendered in the "Raven Of
 * Sacreds" storefront visuals. Reached after completing the PayPal payment flow.
 */
import { productById, type CartLine, type ShopperScreen } from './flow';
import { useReady } from './useReady';
import { OrderReceivedSkeleton } from './Skeletons';

export default function OrderReceivedPage( {
  cart,
  payMethod = 'PayPal',
  onNavigate,
}: {
  cart: CartLine[];
  payMethod?: string;
  onNavigate: ( s: ShopperScreen ) => void;
} ) {
  const ready = useReady( 'order-received', 900 );
  if ( ! ready ) return <OrderReceivedSkeleton />;

  const subtotal = cart.reduce( ( s, line ) => {
    const p = productById( line.id );
    return s + ( p.salePrice ?? p.price ) * line.qty;
  }, 0 );
  const taxes = subtotal * 0.06;
  const total = subtotal + taxes;

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
        <div className="or-ticket__row"><span className="or-ticket__label">Email:</span><span className="or-ticket__value">avery.donovan@gmail.com</span></div>
        <div className="or-ticket__row"><span className="or-ticket__label">Total:</span><span className="or-ticket__value">${ total.toFixed( 2 ) } USD</span></div>
        <div className="or-ticket__row"><span className="or-ticket__label">Payment method:</span><span className="or-ticket__value">{ payMethod }</span></div>
      </div>

      <h2 className="or-h2">Order details</h2>
      <table className="or-details">
        <thead>
          <tr><th>Product</th><th>Total</th></tr>
        </thead>
        <tbody>
          { cart.map( ( line ) => {
            const p = productById( line.id );
            const unit = p.salePrice ?? p.price;
            return (
              <tr key={ line.id }>
                <td><a onClick={ () => onNavigate( 'product' ) }>{ p.name }</a> <span className="or-qty">× { line.qty }</span></td>
                <td>${ ( unit * line.qty ).toFixed( 2 ) }</td>
              </tr>
            );
          } ) }
        </tbody>
        <tfoot>
          <tr><th>Subtotal:</th><td>${ subtotal.toFixed( 2 ) }</td></tr>
          <tr><th>Shipping:</th><td>Free shipping</td></tr>
          <tr><th>Taxes:</th><td>${ taxes.toFixed( 2 ) }</td></tr>
          <tr><th>Total:</th><td>${ total.toFixed( 2 ) } USD</td></tr>
          <tr><th>Payment method:</th><td>{ payMethod }</td></tr>
        </tfoot>
      </table>

      <div className="or-addresses">
        <div className="or-address">
          <h2 className="or-h2">Billing address</h2>
          <address>
            Avery Donovan<br />
            5127 Chestnut Hollow Dr<br />
            Asheville, NC 28806<br />
            avery.donovan@gmail.com
          </address>
        </div>
        <div className="or-address">
          <h2 className="or-h2">Shipping address</h2>
          <address>
            Avery Donovan<br />
            5127 Chestnut Hollow Dr<br />
            Asheville, NC 28806
          </address>
        </div>
      </div>
    </div>
  );
}

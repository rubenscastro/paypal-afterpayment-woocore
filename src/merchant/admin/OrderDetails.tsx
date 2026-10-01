/**
 * WooCommerce → Orders → single order ("Edit order"). Follows the Figma order
 * page: the order summary (payment line + the amber "connect PayPal Wallet"
 * notice when payment is pending), General / Billing / Shipping, the line-item
 * table with totals, Fulfillment, and the right rail (Order actions, attribution,
 * customer history, notes). Populated with the prototype's order (#233, Avery
 * Donovan, Album, $15.90, PayPal).
 */
import { Button, IconButton } from '@wordpress/ui';
import { Icon } from '@wordpress/components';
import { bell, cog, help, chevronLeft, chevronDown, chevronUp, pencil } from '@wordpress/icons';
import Notice from './Notice';
import { useReady } from '../../useReady';
import { PaymentsSkeleton } from './AdminSkeleton';
import { PROTO_ORDER } from './OrdersPage';
import type { MerchantState } from '../flow';

function Topbar() {
  return (
    <header className="os-topbar">
      <span className="os-topbar__spacer" />
      <button type="button" className="os-topbar__icon" aria-label="Notifications"><Icon icon={ bell } size={ 20 } /></button>
      <button type="button" className="os-topbar__icon" aria-label="Settings"><Icon icon={ cog } size={ 20 } /></button>
      <button type="button" className="os-topbar__icon" aria-label="Help"><Icon icon={ help } size={ 20 } /></button>
    </header>
  );
}

/** A collapsible-looking right-rail panel header (chevrons are decorative). */
function RailHead( { title }: { title: string } ) {
  return (
    <div className="od-rail__head">
      <h3 className="od-rail__title">{ title }</h3>
      <span className="od-rail__chevrons" aria-hidden>
        <Icon icon={ chevronUp } size={ 24 } /><Icon icon={ chevronDown } size={ 24 } />
      </span>
    </div>
  );
}

export default function OrderDetails( {
  state,
  onConnectPaypal,
}: {
  state: MerchantState;
  onConnectPaypal: () => void;
} ) {
  const ready = useReady( 'admin-order-details', 700 );
  if ( ! ready ) return <PaymentsSkeleton />;

  const pending = state.paypal !== 'active';

  return (
    <div className="os">
      <Topbar />
      <div className="os-canvas">
        <div className="os-head">
          <h1 className="os-title">Edit order</h1>
          <Button variant="outline" tone="brand" className="os-addorder">Add order</Button>
        </div>

        <div className="od-grid">
          {/* Main column */}
          <div className="od-main">
            <section className="od-card">
              <div className="od-order__head">
                <h2 className="od-order__title">Order #{ PROTO_ORDER.number }</h2>
                <a className="od-order__edit" href="#" onClick={ ( e ) => e.preventDefault() }>Edit</a>
              </div>
              <p className="od-order__meta">
                Payment via PayPal (avery.donovan@gmail.com) (<a href="#" onClick={ ( e ) => e.preventDefault() }>2CD89675HK753625U</a>). Paid on September 28, 2026 at 11:39&nbsp;am. Customer IP: 192.168.0.1
              </p>

              { pending && (
                <Notice actionLabel="Complete setup" onAction={ onConnectPaypal } onDismiss={ () => {} }>
                  To receive the payment, connect PayPal Wallet to your store and complete the setup.
                </Notice>
              ) }

              <div className="od-cols">
                <div className="od-col">
                  <h4 className="od-col__title">General</h4>
                  <p className="od-field"><span className="od-field__label">Date created:</span><br />September 28, 2026 @ 11:39 am</p>
                  <p className="od-field"><span className="od-field__label">Customer:</span><br />{ PROTO_ORDER.customer }</p>
                  <div className="od-statusfield">
                    <span className="od-field__label">Status</span>
                    <span className="od-statusselect od-statusselect--fill"><span>Processing</span><Icon icon={ chevronDown } size={ 20 } /></span>
                  </div>
                </div>
                <div className="od-col">
                  <h4 className="od-col__title od-col__title--edit">
                    <span>Billing</span>
                    <IconButton className="od-edit" icon={ pencil } label="Edit billing address" variant="minimal" tone="neutral" size="small" />
                  </h4>
                  <address className="od-address">
                    Avery Donovan<br />5127 Chestnut Hollow Dr<br />Asheville, NC 28806<br />United States (US)
                  </address>
                  <p className="od-field"><span className="od-field__label">Email address:</span><br /><a href="#" onClick={ ( e ) => e.preventDefault() }>avery.donovan@gmail.com</a></p>
                  <p className="od-field"><span className="od-field__label">Phone:</span><br /><a href="#" onClick={ ( e ) => e.preventDefault() }>828-555-0142</a></p>
                </div>
                <div className="od-col">
                  <h4 className="od-col__title od-col__title--edit">
                    <span>Shipping</span>
                    <IconButton className="od-edit" icon={ pencil } label="Edit shipping address" variant="minimal" tone="neutral" size="small" />
                  </h4>
                  <address className="od-address">
                    Avery Donovan<br />5127 Chestnut Hollow Dr<br />Asheville, NC 28806<br />United States (US)
                  </address>
                  <p className="od-field"><span className="od-field__label">Phone:</span><br /><a href="#" onClick={ ( e ) => e.preventDefault() }>828-555-0142</a></p>
                </div>
              </div>
            </section>

            <section className="od-card od-card--items">
              <table className="od-items">
                <thead>
                  <tr><th>Item</th><th className="od-items__num">Price</th><th className="od-items__num">Qty</th><th className="od-items__num">Total</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="od-item">
                      <img className="od-item__thumb" src="/shop/album.png" alt="" />
                      <div className="od-item__text">
                        <a className="od-item__name" href="#" onClick={ ( e ) => e.preventDefault() }>Album</a>
                        <span className="od-item__sku">SKU: woo-album</span>
                      </div>
                    </td>
                    <td className="od-items__num">$15.00</td>
                    <td className="od-items__num">× 1</td>
                    <td className="od-items__num">$15.00</td>
                  </tr>
                  <tr className="od-ship">
                    <td className="od-item"><span className="od-ship__icon" aria-hidden>🚚</span> Free shipping</td>
                    <td /><td /><td className="od-items__num">$0.00</td>
                  </tr>
                </tbody>
              </table>

              <div className="od-totals">
                <div className="od-total-row"><span>Items Subtotal:</span><span>$15.00</span></div>
                <div className="od-total-row"><span>Shipping:</span><span>$0.00</span></div>
                <div className="od-total-row"><span>Taxes:</span><span>$0.90</span></div>
                <div className="od-total-row od-total-row--grand"><span>Order Total:</span><span>$15.90</span></div>
              </div>

              <div className="od-order__foot">
                <Button variant="outline" tone="neutral" size="compact" disabled>Refund</Button>
              </div>
            </section>

          </div>

          {/* Right rail */}
          <aside className="od-rail">
            <section className="od-card">
              <RailHead title="Order actions" />
              <div className="od-action">
                <span className="od-statusselect od-statusselect--fill"><span>Choose an action…</span><Icon icon={ chevronDown } size={ 20 } /></span>
                <button type="button" className="od-action__go" aria-label="Apply action"><Icon icon={ chevronLeft } size={ 18 } /></button>
              </div>
              <div className="od-action__row">
                <a className="od-trash" href="#" onClick={ ( e ) => e.preventDefault() }>Move to trash</a>
                <Button variant="solid" tone="brand" size="compact">Update</Button>
              </div>
            </section>

            <section className="od-card">
              <RailHead title="Order attribution" />
              <p className="od-field"><span className="od-field__label">Origin</span><br />Direct</p>
            </section>

            <section className="od-card">
              <RailHead title="Customer history" />
              <p className="od-field"><span className="od-field__label">Total orders</span><br />1</p>
              <p className="od-field"><span className="od-field__label">Total revenue</span><br />$15.90</p>
              <p className="od-field"><span className="od-field__label">Average order value</span><br />$15.90</p>
            </section>

            <section className="od-card">
              <RailHead title="Order notes" />
              <p className="od-notes__empty">There are no notes yet.</p>
              <label className="od-field__label" htmlFor="od-note">Add note</label>
              <textarea id="od-note" className="od-note" rows={ 3 } />
              <label className="od-field__label">Visibility</label>
              <span className="od-statusselect od-statusselect--fill"><span>Private note</span><Icon icon={ chevronDown } size={ 20 } /></span>
              <Button variant="outline" tone="brand" className="od-note__add">Add private note</Button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

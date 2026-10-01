/**
 * WooCommerce → Orders. Two states driven by `state.orderReceived`:
 *  - empty (no orders yet): the centred "When you receive a new order…" prompt
 *    plus the "Tools for your store" recommendations card.
 *  - filled (a shopper has checked out): the status tabs, filter toolbar and the
 *    orders table with the single prototype order (#233), which opens the order
 *    details screen on click.
 * Copy and layout follow the WooCommerce Orders screen.
 */
import { Button, IconButton } from '@wordpress/ui';
import { Icon } from '@wordpress/components';
import { bell, cog, help, chevronDown, chevronLeft, chevronRight, closeSmall } from '@wordpress/icons';
import { useReady } from '../../useReady';
import { PaymentsSkeleton } from './AdminSkeleton';
import type { MerchantState } from '../flow';

/* The single order the prototype produces (mirrors the storefront order-received
   page: Album, Avery Donovan, $15.90 incl. tax, paid with PayPal). */
export const PROTO_ORDER = {
  number: '233',
  customer: 'Avery Donovan',
  date: '50 minutes ago',
  status: 'Processing',
  total: '$15.90 USD',
  origin: 'Direct',
};

/* Recommended extensions in the empty state's "Tools for your store" card. */
const TOOLS = [
  { name: 'Shipment Tracking', desc: 'Add shipment tracking information to your orders.', color: '#6f3ff5' },
  { name: 'Conditional Shipping and Payments', desc: 'Use conditional logic to restrict the shipping and payment options available on your store.', color: '#7f54b3' },
  { name: 'Envia Shipping and Fulfillment', desc: 'Streamline shipping worldwide with Envia for WooCommerce.', color: '#ffffff' },
  { name: 'Pick List', desc: 'Fast, accurate order fulfillment for WooCommerce — with batch picking, live picking, printable documents, and optional barcode scanning.', color: '#111111' },
  { name: 'Print Invoices and Packing Lists', desc: 'Generate invoices, packing slips, and pick lists for your WooCommerce orders.', color: '#a7e8c0' },
];

/* WooCommerce's own orders blank-state icon (.woocommerce-BlankState--orders),
   32px in $gray-400. */
function ReceiptIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="#a7aaad" aria-hidden>
      <path fillRule="evenodd" clipRule="evenodd" d="M16.83 6.342l.602.3.625-.25.443-.176v12.569l-.443-.178-.625-.25-.603.301-1.444.723-2.41-.804-.475-.158-.474.158-2.41.803-1.445-.722-.603-.3-.625.25-.443.177V6.215l.443.178.625.25.603-.301 1.444-.722 2.41.803.475.158.474-.158 2.41-.803 1.445.722zM20 4l-1.5.6-1 .4-2-1-3 1-3-1-2 1-1-.4L5 4v17l1.5-.6 1-.4 2 1 3-1 3 1 2-1 1 .4 1.5.6V4zm-3.5 6.25v-1.5h-8v1.5h8zm0 3v-1.5h-8v1.5h8zm-8 3v-1.5h8v1.5h-8z" />
    </svg>
  );
}

function OrdersTopbar() {
  return (
    <header className="os-topbar">
      <span className="os-topbar__spacer" />
      <button type="button" className="os-topbar__icon" aria-label="Notifications"><Icon icon={ bell } size={ 20 } /></button>
      <button type="button" className="os-topbar__icon" aria-label="Settings"><Icon icon={ cog } size={ 20 } /></button>
      <button type="button" className="os-topbar__icon" aria-label="Help"><Icon icon={ help } size={ 20 } /></button>
    </header>
  );
}

function EmptyState() {
  return (
    <>
      <div className="os-empty">
        <span className="os-empty__icon" aria-hidden><ReceiptIcon /></span>
        <p className="os-empty__text">When you receive a new order, it will appear here.</p>
        <Button variant="outline" tone="brand" className="os-empty__cta">Learn more about orders</Button>
      </div>

      <section className="os-tools">
        <h2 className="os-tools__title">Tools for your store</h2>
        { TOOLS.map( ( t ) => (
          <div key={ t.name } className="os-tool">
            <span className="os-tool__logo" aria-hidden />
            <div className="os-tool__text">
              <span className="os-tool__name">{ t.name }</span>
              <span className="os-tool__desc">{ t.desc }</span>
            </div>
            <Button variant="outline" tone="brand" size="compact" className="os-tool__cta">Learn More</Button>
            <IconButton className="os-tool__x" icon={ closeSmall } label="Dismiss" variant="minimal" tone="neutral" size="small" />
          </div>
        ) ) }
        <div className="os-tools__divider" aria-hidden />
        <a className="os-tools__more" href="#" onClick={ ( e ) => e.preventDefault() }>Discover more options</a>
      </section>
    </>
  );
}

const STATUS_TABS: Array< [ string, number ] > = [
  [ 'All', 1 ], [ 'Pending payment', 0 ], [ 'Processing', 1 ], [ 'Completed', 0 ], [ 'Refunded', 0 ], [ 'Failed', 0 ],
];

function FilledState( { onViewOrder }: { onViewOrder: () => void } ) {
  return (
    <div className="os-list">
      <div className="os-listtop">
        <nav className="os-statustabs">
          { STATUS_TABS.map( ( [ label, count ], i ) => (
            <span key={ label } className={ `os-statustab${ i === 0 ? ' is-active' : '' }` }>
              { i > 0 && <span className="os-statustab__sep">|</span> }
              <a href="#" onClick={ ( e ) => e.preventDefault() }>{ label }</a> <span className="os-statustab__count">({ count })</span>
            </span>
          ) ) }
        </nav>
        <div className="os-search">
          <input className="os-search__input" type="text" aria-label="Search orders" />
          <span className="os-select os-select--status"><span>All</span><Icon icon={ chevronDown } size={ 18 } /></span>
          <Button variant="outline" tone="brand">Search orders</Button>
        </div>
      </div>

      <div className="os-toolbar">
        <div className="os-toolbar__left">
          <span className="os-select"><span>Bulk actions</span><Icon icon={ chevronDown } size={ 18 } /></span>
          <Button variant="outline" tone="neutral" size="compact">Apply</Button>
          <span className="os-select"><span>All dates</span><Icon icon={ chevronDown } size={ 18 } /></span>
          <span className="os-select"><span>All sales channels</span><Icon icon={ chevronDown } size={ 18 } /></span>
          <span className="os-select"><span>Filter by registered customer</span><Icon icon={ chevronDown } size={ 18 } /></span>
          <Button variant="outline" tone="brand" size="compact">Filter</Button>
        </div>
        <div className="os-toolbar__right">
          <span className="os-pageinfo">1 item</span>
          <span className="os-pager"><Icon icon={ chevronLeft } size={ 18 } /></span>
          <span className="os-pager"><Icon icon={ chevronLeft } size={ 18 } /></span>
          <span className="os-pagenum">1</span>
          <span className="os-pageof">of 1</span>
          <span className="os-pager"><Icon icon={ chevronRight } size={ 18 } /></span>
          <span className="os-pager"><Icon icon={ chevronRight } size={ 18 } /></span>
        </div>
      </div>

      <table className="os-table">
        <thead>
          <tr>
            <th className="os-th-check"><input type="checkbox" aria-label="Select all" /></th>
            <th>Order</th>
            <th>Date</th>
            <th>Status</th>
            <th className="os-th-total">Total</th>
            <th>Origin</th>
          </tr>
        </thead>
        <tbody>
          <tr className="os-row" onClick={ onViewOrder }>
            <td className="os-td-check"><input type="checkbox" aria-label="Select order" onClick={ ( e ) => e.stopPropagation() } /></td>
            <td><a className="os-order-link" onClick={ ( e ) => e.preventDefault() }>#{ PROTO_ORDER.number } { PROTO_ORDER.customer }</a></td>
            <td className="os-td-muted">{ PROTO_ORDER.date }</td>
            <td><span className="os-status os-status--processing">{ PROTO_ORDER.status }</span></td>
            <td className="os-td-total">{ PROTO_ORDER.total }</td>
            <td className="os-td-muted">{ PROTO_ORDER.origin }</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function OrdersPage( {
  state,
  onViewOrder,
}: {
  state: MerchantState;
  onViewOrder: () => void;
} ) {
  const ready = useReady( 'admin-orders', 700 );
  if ( ! ready ) return <PaymentsSkeleton />;

  const hasOrders = state.orderReceived;

  return (
    <div className="os">
      <OrdersTopbar />
      <div className="os-canvas">
        <div className="os-head">
          <h1 className="os-title">Orders</h1>
          <Button variant="outline" tone="brand" className="os-addorder">Add order</Button>
        </div>
        { hasOrders ? <FilledState onViewOrder={ onViewOrder } /> : <EmptyState /> }
      </div>
    </div>
  );
}

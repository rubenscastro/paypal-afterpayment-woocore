/**
 * WooCommerce → Settings → Payments. The provider list with the PayPal Wallet
 * row front and centre: its chip, primary CTA and inline banner all track
 * `state.paypal` / `state.pendingPayment`, so the same screen serves the
 * "Needs action" and "Active" Figma frames.
 */
import { Icon } from '@wordpress/components';
import { Button, IconButton } from '@wordpress/ui';
import { chevronRight, chevronDown, moreVertical } from '@wordpress/icons';
import OfficialMark from '../../OfficialMark';
import WooPaymentsMethodsLogos from '../../WooPaymentsMethodsLogos';
import Notice from './Notice';
import { PaymentsSkeleton } from './AdminSkeleton';
import { useReady } from '../../useReady';
import type { MerchantState } from '../flow';

const SETTINGS_TABS = [
  'General', 'Products', 'Shipping', 'Payments', 'Accounts & Privacy',
  'Emails', 'Integration', 'Advanced', 'Multi-currency',
];

export default function PaymentsSettings( {
  state,
  onCompleteSetup,
  onManage,
}: {
  state: MerchantState;
  onCompleteSetup: () => void;
  onManage: () => void;
} ) {
  const ready = useReady( 'admin-payments', 700 );
  const isActive = state.paypal === 'active';
  const showBanner = ! isActive && state.pendingPayment;

  if ( ! ready ) return <PaymentsSkeleton />;

  return (
    <div className="ps">
      <div className="ps-header">
        <h1 className="ps-page-title">Settings</h1>
        <nav className="ps-tabs">
          { SETTINGS_TABS.map( ( t ) => (
            <span key={ t } className={ `ps-tab${ t === 'Payments' ? ' is-active' : '' }` }>{ t }</span>
          ) ) }
        </nav>
      </div>

      <div className="ps-body">
        <div className="ps-providers-head">
          <h2 className="ps-section-title">Payment providers</h2>
          <div className="ps-providers-head__right">
            <button type="button" className="ps-location">
              Business location: <strong>United States</strong>
              <Icon icon={ chevronDown } size={ 20 } />
            </button>
            <IconButton icon={ moreVertical } label="More" variant="minimal" tone="neutral" />
          </div>
        </div>

        {/* Woo — recommended, not installed */}
        <div className="ps-row">
          <img className="ps-row__logo" src="/logos/woo.svg" alt="" width={ 40 } height={ 40 } />
          <div className="ps-row__main">
            <div className="ps-row__title-line">
              <span className="ps-row__title">Accept payments with Woo</span>
              <span className="ps-chip ps-chip--neutral">Recommended</span>
              <OfficialMark />
            </div>
            <p className="ps-row__desc">Credit/debit cards, Apple Pay, Google Pay and more.</p>
            <WooPaymentsMethodsLogos />
          </div>
          <div className="ps-row__actions">
            <Button variant="solid" tone="brand">Enable</Button>
            <IconButton icon={ moreVertical } label="More" variant="minimal" tone="neutral" />
          </div>
        </div>

        {/* PayPal Wallet — the star of the flow */}
        <div className="ps-row ps-row--stack">
          <div className="ps-row__lead">
            <img className="ps-row__logo" src="/logos/paypal/paypal-wallet-badge.svg" alt="" width={ 40 } height={ 40 } />
            <div className="ps-row__main">
              <div className="ps-row__title-line">
                <span className="ps-row__title">PayPal Wallet</span>
                { isActive
                  ? <span className="ps-chip ps-chip--success">Active</span>
                  : <span className="ps-chip ps-chip--warning">Needs action</span> }
                <OfficialMark />
              </div>
              <p className="ps-row__desc">PayPal Wallet lets you offer PayPal, Venmo (US only), Pay Later options and more.</p>
            </div>
            <div className="ps-row__actions">
              { isActive
                ? <Button variant="outline" tone="brand" onClick={ onManage }>Manage</Button>
                : <Button variant="solid" tone="brand" onClick={ onCompleteSetup }>Complete setup</Button> }
              <IconButton icon={ moreVertical } label="More" variant="minimal" tone="neutral" />
            </div>
          </div>

          { showBanner && (
            <Notice
              title="Complete setup to receive your payment"
              actionLabel="Complete setup"
              onAction={ onCompleteSetup }
              onDismiss={ () => {} }
            >
              You received an order paid with PayPal Wallet. Connect PayPal Wallet
              to receive the payment.
            </Notice>
          ) }
        </div>

        {/* Offline payments */}
        <button type="button" className="ps-row ps-row--link">
          <img className="ps-row__logo ps-row__logo--plain" src="/logos/offlinepayments.svg" alt="" width={ 40 } height={ 40 } />
          <div className="ps-row__main">
            <span className="ps-row__title">Take offline payments</span>
            <p className="ps-row__desc">Accept payments offline using multiple different methods. These can also be used to test purchases.</p>
          </div>
          <Icon icon={ chevronRight } size={ 24 } />
        </button>

        {/* Other payment options */}
        <div className="ps-other">
          <button type="button" className="ps-other__head">
            <span className="ps-other__title">Other payment options</span>
            <span className="ps-other__logos">
              <img src="/logos/square.svg" alt="" width={ 24 } height={ 24 } />
              <img src="/logos/airwallex.svg" alt="" width={ 24 } height={ 24 } />
            </span>
            <span className="ps-other__spacer" />
            <Icon icon={ chevronDown } size={ 24 } />
          </button>
        </div>
      </div>
    </div>
  );
}

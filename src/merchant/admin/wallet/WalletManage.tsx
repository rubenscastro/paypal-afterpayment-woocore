/**
 * The connected PayPal Wallet management screen: a sub-header (back · title ·
 * Save) over four tabs — Overview, Payment methods, Settings, Styling — each
 * built from its Figma frame. State (method toggles, settings, styling controls)
 * lives on the shared merchant state so the switcher can preset any of it.
 */
import {
  CheckboxControl, Icon, SelectControl, TextControl, ToggleControl,
} from '@wordpress/components';
import { Button, IconButton } from '@wordpress/ui';
import { chevronLeft, chevronDown, cog, reusableBlock } from '@wordpress/icons';
import { WalletManageSkeleton } from '../AdminSkeleton';
import { useReady } from '../../../useReady';
import type { MerchantState, WalletTab } from '../../flow';

const TABS: { id: WalletTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'methods', label: 'Payment methods' },
  { id: 'settings', label: 'Settings' },
  { id: 'styling', label: 'Styling' },
];

export default function WalletManage( {
  state,
  onBack,
  onTab,
  update,
}: {
  state: MerchantState;
  onBack: () => void;
  onTab: ( tab: WalletTab ) => void;
  update: ( patch: Partial< MerchantState > ) => void;
} ) {
  /* Skeleton on entry (e.g. after "Return to WooCommerce"), then the real page. */
  const ready = useReady( 'wallet-manage', 700 );
  if ( ! ready ) return <WalletManageSkeleton />;

  return (
    <div className="wm">
      <header className="wm-subbar">
        <IconButton className="ww-back" icon={ chevronLeft } label="Back" variant="minimal" tone="neutral" onClick={ onBack } />
        <span className="ww-subbar__title">PayPal Wallet</span>
        <span className="wm-subbar__spacer" />
        <Button variant="solid" tone="brand">Save</Button>
      </header>

      <nav className="wm-tabs">
        { TABS.map( ( t ) => (
          <button
            key={ t.id }
            type="button"
            className={ `wm-tab${ state.walletTab === t.id ? ' is-active' : '' }` }
            onClick={ () => onTab( t.id ) }
          >
            { t.label }
          </button>
        ) ) }
      </nav>

      <div className="wm-body">
        { state.walletTab === 'overview' && <OverviewTab /> }
        { state.walletTab === 'methods' && <MethodsTab state={ state } update={ update } /> }
        { state.walletTab === 'settings' && <SettingsTab state={ state } update={ update } /> }
        { state.walletTab === 'styling' && <StylingTab state={ state } update={ update } /> }
      </div>
    </div>
  );
}

/* ---------- Overview ---------- */

function Section( { title, desc, extra, children }: {
  title: string; desc: string; extra?: React.ReactNode; children: React.ReactNode;
} ) {
  return (
    <div className="wm-section">
      <div className="wm-section__aside">
        <h2 className="wm-section__title">{ title }</h2>
        <p className="wm-section__desc">{ desc }</p>
        { extra }
      </div>
      <div className="wm-section__content">{ children }</div>
    </div>
  );
}

function OverviewTab() {
  return (
    <>
      <Section title="Things to do next" desc="Complete these tasks to keep your store updated with the latest products and services.">
        <div className="wm-card wm-card--list">
          <a className="wm-task"><span className="wm-task__dot" />Enable Pay Later messaging</a>
          <a className="wm-task"><span className="wm-task__dot" />Add PayPal shortcut to Cart page</a>
        </div>
      </Section>

      <Section
        title="Features"
        desc="Enable additional features and capabilities on your WooCommerce store."
        extra={
          <button type="button" className="wm-refresh">
            <Icon icon={ reusableBlock } size={ 20 } /> Refresh
          </button>
        }
      >
        <div className="wm-card">
          <strong className="wm-card__h">Save PayPal and Venmo</strong>
          <p className="wm-card__p">Securely save PayPal and Venmo payment methods for subscriptions or return buyers.</p>
          <div className="wm-card__actions">
            <Button variant="outline" tone="brand">Enable</Button>
            <a href="#" className="wm-learn" onClick={ ( e ) => e.preventDefault() }>Learn more</a>
          </div>
        </div>
      </Section>

      <Section title="Help Center" desc="Access detailed guides and responsive support to streamline setup and enhance your experience">
        <div className="wm-card">
          <strong className="wm-card__h">Documentation</strong>
          <p className="wm-card__p">Find detailed guides and resources to help you set up, manage, and optimize your PayPal integration.</p>
          <a href="#" className="wm-learn" onClick={ ( e ) => e.preventDefault() }>View full documentation</a>
        </div>
        <div className="wm-card">
          <strong className="wm-card__h">Support</strong>
          <p className="wm-card__p">Need help? Access troubleshooting tips or contact our support team for personalized assistance.</p>
          <a href="#" className="wm-learn" onClick={ ( e ) => e.preventDefault() }>View support options</a>
        </div>
      </Section>
    </>
  );
}

/* ---------- Payment methods ---------- */

function MethodsTab( { state, update }: { state: MerchantState; update: ( p: Partial< MerchantState > ) => void } ) {
  const setMethod = ( key: 'venmo' | 'payLater', v: boolean ) =>
    update( { methods: { ...state.methods, [ key ]: v } } );

  const cards = [
    { key: 'paypal' as const, logo: '/logos/paypal.svg', title: 'Pay with PayPal (Required)', desc: 'Our all-in-one checkout solution lets you offer PayPal, Venmo, Pay Later options, and more to help maximize conversion.', on: true, disabled: true },
    { key: 'venmo' as const, logo: '/logos/paypal/venmo.svg', title: 'Venmo', desc: 'Offer Venmo at checkout to millions of active users.', on: state.methods.venmo, disabled: false },
    { key: 'payLater' as const, logo: '/logos/paypal/paylater.svg', title: 'Pay Later', desc: 'Get paid in full at checkout while giving your customers the flexibility to pay in installments over time, with no late fees for them or additional cost to you.', on: state.methods.payLater, disabled: false },
  ];

  return (
    <Section title="PayPal Checkout" desc="Select your preferred checkout option with PayPal for easy payment processing.">
      <div className="wm-methods">
        { cards.map( ( c ) => (
          <div key={ c.key } className="wm-method">
            <div className="wm-method__head">
              <img className="wm-method__logo" src={ c.logo } alt="" />
              <span className="wm-method__title">{ c.title }</span>
            </div>
            <p className="wm-method__desc">{ c.desc }</p>
            <div className="wm-method__foot">
              <ToggleControl
                __nextHasNoMarginBottom
                checked={ c.on }
                disabled={ c.disabled }
                onChange={ ( v ) => c.key !== 'paypal' && setMethod( c.key, v ) }
                label=""
                aria-label={ c.title }
              />
              <IconButton icon={ cog } label="Settings" variant="minimal" tone="neutral" />
            </div>
          </div>
        ) ) }
      </div>
    </Section>
  );
}

/* ---------- Settings ---------- */

function SettingsTab( { state, update }: { state: MerchantState; update: ( p: Partial< MerchantState > ) => void } ) {
  const s = state.settings;
  const setS = ( patch: Partial< MerchantState['settings'] > ) => update( { settings: { ...s, ...patch } } );

  return (
    <>
      <Section title="Connection status" desc="Your PayPal account connection details">
        <div className="wm-card">
          <span className="ps-chip ps-chip--success">Active</span>
          <dl className="wm-conn">
            <dt>Merchant ID</dt><dd>AT45V2DGMKLRY</dd>
            <dt>Email address</dt><dd>bt_us@woocommerce.com</dd>
            <dt>Client ID</dt><dd>BAARTJLxtUNN4d2GMB6Eut3suMDYad72xQA-FntdlFuJ6FmFJITxAY8</dd>
          </dl>
        </div>
      </Section>

      <Section title="Common settings" desc="Customize key features to tailor your PayPal experience.">
        <div className="wm-card wm-card--pad">
          <TextControl
            __next40pxDefaultSize __nextHasNoMarginBottom
            label="Invoice prefix (Recommended)"
            placeholder="Input prefix"
            value={ s.invoicePrefix }
            onChange={ ( v ) => setS( { invoicePrefix: v } ) }
            help="Add a unique prefix to invoice numbers for site-specific tracking."
          />
          <hr className="wm-hr" />
          <p className="wm-field-label">Order intent</p>
          <p className="wm-field-help">Choose between immediate capture or authorization-only, with manual capture in the Order section.</p>
          <ToggleControl __nextHasNoMarginBottom label="Authorize only" checked={ s.authorizeOnly } onChange={ ( v ) => setS( { authorizeOnly: v } ) } />
          <ToggleControl __nextHasNoMarginBottom label="Capture virtual-only orders" checked={ s.captureVirtual } onChange={ ( v ) => setS( { captureVirtual: v } ) } />
          <hr className="wm-hr" />
          <p className="wm-field-label">Save payment methods</p>
          <p className="wm-field-help">Securely store customers' payment methods for future payments and subscriptions, simplifying checkout and enabling recurring transactions.</p>
          <ToggleControl __nextHasNoMarginBottom label="Save PayPal and Venmo" checked={ s.saveMethods } onChange={ ( v ) => setS( { saveMethods: v } ) } help="Securely store your customers' PayPal accounts for a seamless checkout experience. This will disable all Pay Later features and Alternative Payment Methods on your site." />
          <ToggleControl __nextHasNoMarginBottom label="Pay Now experience" checked={ s.payNow } onChange={ ( v ) => setS( { payNow: v } ) } help="Let PayPal customers skip the Order Review page by selecting shipping options directly within PayPal." />
        </div>
      </Section>

      <Section title="Expert settings" desc="Fine-tune your PayPal experience with advanced options.">
        { [
          { t: 'Sandbox mode', d: "Test your site in PayPal's Sandbox environment." },
          { t: 'Troubleshooting', d: 'Access tools to help debug and resolve issues.' },
          { t: 'PayPal settings', d: 'Modify the PayPal checkout experience.' },
        ].map( ( x ) => (
          <button key={ x.t } type="button" className="wm-card wm-collapse">
            <div>
              <strong className="wm-card__h">{ x.t }</strong>
              <p className="wm-card__p">{ x.d }</p>
            </div>
            <Icon icon={ chevronDown } size={ 24 } />
          </button>
        ) ) }
      </Section>
    </>
  );
}

/* ---------- Styling ---------- */

function StylingTab( { state, update }: { state: MerchantState; update: ( p: Partial< MerchantState > ) => void } ) {
  const st = state.styling;
  const setSt = ( patch: Partial< MerchantState['styling'] > ) => update( { styling: { ...st, ...patch } } );

  return (
    <div className={ `wm-style${ st.darkMode ? ' is-dark' : '' }` }>
      <div className="wm-style__panel">
        <h2 className="wm-card__h">Button Styling</h2>
        <p className="wm-card__p">
          Customize the appearance of the PayPal smart buttons on the{ ' ' }
          <a href="#" onClick={ ( e ) => e.preventDefault() }>Classic Checkout page</a>.
          Checkout Buttons must be enabled to display the PayPal gateway on the Checkout page.
        </p>

        <SelectControl
          __next40pxDefaultSize __nextHasNoMarginBottom
          label="Locations"
          value={ st.location }
          onChange={ ( v ) => setSt( { location: v } ) }
          options={ [ 'Product page', 'Cart', 'Checkout', 'Mini cart' ].map( ( o ) => ( { label: o, value: o } ) ) }
        />

        <p className="wm-field-label wm-mt">Payment Methods</p>
        <CheckboxControl __nextHasNoMarginBottom label="Venmo" checked={ st.venmo } onChange={ ( v ) => setSt( { venmo: v } ) } />
        <CheckboxControl __nextHasNoMarginBottom label="Pay Later" checked={ st.payLater } onChange={ ( v ) => setSt( { payLater: v } ) } />

        <p className="wm-field-label wm-mt">Button Layout</p>
        <div className="wm-radios">
          <label><input type="radio" checked={ st.layout === 'vertical' } onChange={ () => setSt( { layout: 'vertical' } ) } /> Vertical</label>
          <label><input type="radio" checked={ st.layout === 'horizontal' } onChange={ () => setSt( { layout: 'horizontal' } ) } /> Horizontal</label>
        </div>

        <p className="wm-field-label wm-mt">Shape</p>
        <div className="wm-radios">
          <label><input type="radio" checked={ st.shape === 'rectangle' } onChange={ () => setSt( { shape: 'rectangle' } ) } /> Rectangle</label>
          <label><input type="radio" checked={ st.shape === 'pill' } onChange={ () => setSt( { shape: 'pill' } ) } /> Pill</label>
        </div>

        <SelectControl
          __next40pxDefaultSize __nextHasNoMarginBottom className="wm-mt"
          label="Button Label"
          value={ st.label }
          onChange={ ( v ) => setSt( { label: v } ) }
          options={ [ 'Buy Now', 'Pay', 'Checkout', 'PayPal' ].map( ( o ) => ( { label: o, value: o } ) ) }
        />
        <SelectControl
          __next40pxDefaultSize __nextHasNoMarginBottom className="wm-mt"
          label="Button Color"
          value={ st.color }
          onChange={ ( v ) => setSt( { color: v } ) }
          options={ [ 'Gold (Recommended)', 'Blue', 'Silver', 'White', 'Black' ].map( ( o ) => ( { label: o, value: o } ) ) }
        />

        <p className="wm-field-label wm-mt">Tagline</p>
        <CheckboxControl __nextHasNoMarginBottom label="Enable Tagline" checked={ st.tagline } onChange={ ( v ) => setSt( { tagline: v } ) } />
      </div>

      <div className="wm-style__preview">
        <div className="wm-style__toolbar">
          <div className="wm-style__devices" aria-hidden>
            <span>☰</span><span className="is-active">🖥</span><span>📱</span>
          </div>
          <ToggleControl __nextHasNoMarginBottom label="Enable Dark mode" checked={ st.darkMode } onChange={ ( v ) => setSt( { darkMode: v } ) } />
        </div>
        <div className="wm-mock">
          <div className="wm-mock__topbar"><span /><span className="wm-mock__nav"><i /><i /><i /></span></div>
          <div className="wm-mock__content">
            <div className="wm-mock__image" />
            <div className="wm-mock__col">
              <span className="wm-mock__line" />
              <span className="wm-mock__line wm-mock__line--short" />
              <p className="wm-mock__paylater">
                Pay in 4 interest-free payments of $22.11 with{ ' ' }
                <img src="/logos/paypal/paypal-wordmark.svg" alt="PayPal" height={ 12 } />
                <a href="#" onClick={ ( e ) => e.preventDefault() }>Learn more</a>
              </p>
              <div className="wm-mock__addcart">ADD TO CART</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

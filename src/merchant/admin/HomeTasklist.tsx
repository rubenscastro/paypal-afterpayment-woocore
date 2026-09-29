/**
 * WooCommerce → Home. The post-onboarding landing: the "Let's get you set up"
 * tasklist, "Things to do next", and the Inbox. The PayPal story shows up as a
 * "Connect PayPal to complete setup" task and — when a payment is pending — the
 * amber action-required banner pinned to the top (the second Figma tasklist frame).
 */
import { useState } from 'react';
import { Button, IconButton } from '@wordpress/ui';
import { Icon } from '@wordpress/components';
import { moreVertical, store, listView, comment, help, check } from '@wordpress/icons';
import Notice from './Notice';
import { HomeSkeleton } from './AdminSkeleton';
import { useReady } from '../../useReady';
import type { MerchantState } from '../flow';

const SETUP_STEPS = [
  'Add your products',
  'Set up payments',
  'Customize your store',
  'Collect sales tax',
  'Launch your store',
];

/* Setup-card hero content. Copy + illustrations lifted verbatim from
   WooCommerce's setup-task-list task headers (products.js / payments.js). */
const SETUP_HERO = {
  products: {
    title: 'List your products',
    desc: 'Start selling by adding products or services to your store. Choose to list products manually, or import them from a different store. ',
    cta: 'Add products',
    art: '/logos/woo/sales-section-illustration.svg',
    alt: 'Products illustration',
  },
  payments: {
    title: 'It’s time to get paid',
    desc: 'Give your customers an easy and convenient way to pay! Set up one (or more!) of our fast and secure online or in person payment methods.',
    cta: 'Get paid',
    art: '/logos/woo/payment-illustration.svg',
    alt: 'Payment illustration',
  },
  customize: {
    title: 'Start customizing your store',
    desc: 'Quickly create a beautiful looking store using our built-in store designer, or select a pre-built theme and customize it to fit your brand.',
    cta: 'Start customizing',
    art: '/logos/woo/customize-store-illustration.svg',
    alt: 'Customize your store illustration',
  },
} as const;

/* Inbox notes (static prototype content). Each has its own action buttons plus a
   Dismiss; the whole row highlights on hover but isn't itself clickable. */
const INBOX = [
  {
    time: '11 minutes ago',
    title: 'PayPal Working Capital',
    body: 'Business loans from $1k to $230k for first-time borrowers. Looking to fuel your business growth? With a PayPal Working Capital loan, approved loans are funded in minutes and repaid as a share of your sales. Minimum payment required every 90 days. The lender for PayPal Working Capital is WebBank.',
    actions: [ 'Learn More' ],
  },
  {
    time: '11 minutes ago',
    title: 'Fraud protection is now required — enable today',
    body: 'Card networks like Visa, Mastercard and American Express now require fraud prevention controls, and non-compliance may result in fines and processing restrictions. Please enable reCAPTCHA in your PayPal Payments settings to help protect your store and maintain compliance.',
    actions: [ 'Enable reCAPTCHA →', 'Learn more' ],
  },
  {
    time: '5 hours ago',
    title: "Setup a Refund and Returns Policy page to boost your store's credibility.",
    body: 'We have created a sample draft Refund and Returns Policy page for you. Please have a look and update it to fit your store.',
    actions: [ 'Edit page' ],
  },
];

const STATS_TABS = [ 'Today', 'Week to date', 'Month to date' ];

export default function HomeTasklist( {
  state,
  onConnectPaypal,
  onGoPayments,
  onCompleteProducts,
}: {
  state: MerchantState;
  onConnectPaypal: () => void;
  /** Open the WooCommerce → Settings → Payments screen (the "Set up payments" step). */
  onGoPayments: () => void;
  /** Mark "Add your products" done — advances the hero + checklist to payments. */
  onCompleteProducts: () => void;
} ) {
  /* Skeleton every time the Home screen is entered (remounts on navigation). */
  const ready = useReady( 'admin-home', 700 );

  /* Stats overview: reflects the shopper sale once an order has been placed. */
  const [ statsTab, setStatsTab ] = useState( STATS_TABS[ 0 ] );
  const salesValue = state.orderReceived ? '$15.00' : '$0.00';
  const ordersValue = state.orderReceived ? '1' : '0';

  const showBanner = state.paypal !== 'active' && state.pendingPayment;

  /* Checklist progress. "Set up payments" checks off once PayPal is connected
     (paypal active); "Add your products" checks off when marked done (or once
     payments is set up, which implies products). The active step is the first
     incomplete one, and the hero follows it. */
  const paymentsComplete = state.paypal === 'active';
  const productsComplete = state.productsDone || paymentsComplete;
  const completedSteps = paymentsComplete ? 2 : productsComplete ? 1 : 0;
  const activeIndex = completedSteps;

  /* Once a shopper has paid but PayPal isn't connected yet, the tasklist pivots
     to getting paid: the "Set up payments" step reads "Set up PayPal Wallet" and
     opens the wallet setup wizard directly (rather than the Payments settings
     list), and the connect task jumps to the top of "Things to do next". */
  const orderPending = state.pendingPayment && state.paypal !== 'active';
  const stepLabel = ( i: number ): string =>
    i === 1 && orderPending ? 'Set up PayPal Wallet' : SETUP_STEPS[ i ];
  /* The payments step: wallet wizard when it's urging "Set up PayPal Wallet",
     otherwise the Payments settings screen. */
  const paymentsAction = orderPending ? onConnectPaypal : onGoPayments;

  /* Hero follows the active step: products → payments → customize (once PayPal
     is connected, the payments step is done so the hero advances to the next
     task, "Start customizing your store"). */
  const hero = paymentsComplete
    ? SETUP_HERO.customize
    : productsComplete ? SETUP_HERO.payments : SETUP_HERO.products;
  const onHeroCta = paymentsComplete
    ? () => {}
    : productsComplete ? paymentsAction : onCompleteProducts;
  /* Step rows are clickable: "Add your products" completes it, the payments step
     opens the wallet wizard or Payments settings as above. */
  const stepAction = ( i: number ): ( () => void ) | undefined =>
    i === 0 ? onCompleteProducts : i === 1 ? paymentsAction : undefined;
  /* Actual completion of the checklist items (starts at 0 of 5). */
  const completeCount = completedSteps;
  const stepCount = SETUP_STEPS.length;

  type Todo = { title: string; meta?: string; onClick?: () => void };
  const connectTodo: Todo = orderPending
    ? {
        title: 'Complete setting up PayPal Wallet to get paid',
        meta: 'A customer placed an order and paid using PayPal Wallet. To receive the payment, connect PayPal Wallet to your store and complete the setup.',
        onClick: onConnectPaypal,
      }
    : {
        title: 'Connect PayPal to complete setup',
        meta: 'PayPal Wallet is almost ready. To get started, connect your account with the Activate PayPal Wallet button.',
        onClick: onConnectPaypal,
      };
  const baseTodos: Todo[] = [
    { title: 'Grow your business', meta: '2 minutes' },
    { title: 'Enhance your store with extensions' },
    { title: 'Get the free WooCommerce mobile app' },
    { title: 'Enable required fraud protection for PayPal Payments', meta: 'Help protect your store and maintain compliance.' },
  ];
  /* Once PayPal is connected the "Connect PayPal to complete setup" task is done,
     so it drops off entirely; before that it sits at the top when an order is
     pending, otherwise in its normal position. */
  const todos: Todo[] = paymentsComplete
    ? baseTodos
    : orderPending
      ? [ connectTodo, ...baseTodos ]
      : [ baseTodos[ 0 ], baseTodos[ 1 ], baseTodos[ 2 ], connectTodo, baseTodos[ 3 ] ];

  if ( ! ready ) return <HomeSkeleton />;

  return (
    <div className="hm">
      <header className="hm-subbar">
        <span className="hm-subbar__title">Home</span>
        <div className="hm-subbar__right">
          <IconButton className="hm-subbar__icon" icon={ store } label="View store" variant="minimal" tone="neutral" />
          <IconButton className="hm-subbar__icon" icon={ listView } label="Display options" variant="minimal" tone="neutral" />
          <IconButton className="hm-subbar__icon" icon={ comment } label="Reviews" variant="minimal" tone="neutral" />
          <IconButton className="hm-subbar__icon" icon={ help } label="Help" variant="minimal" tone="neutral" />
        </div>
      </header>

      <div className="hm-canvas">
        { showBanner && (
          <div className="hm-banner">
            <Notice
              title="Action required: Connect PayPal Wallet to receive your payment"
              actionLabel="Connect to PayPal Wallet"
              onAction={ onConnectPaypal }
              onDismiss={ () => {} }
            >
              A customer placed an order and paid using PayPal Wallet. To receive
              the payment, connect PayPal Wallet to your store and complete the setup.
            </Notice>
          </div>
        ) }

        <div className="hm-col">
          <h1 className="hm-title">Let's get you set up <span aria-hidden>🚀</span></h1>
          <div className="hm-subrow">
            <p className="hm-sub">Follow these steps to start selling quickly. { completeCount } out of { stepCount } complete.</p>
            <IconButton icon={ moreVertical } label="More" variant="minimal" tone="neutral" />
          </div>
          <div className="hm-progress" aria-hidden><span style={ { width: `${ ( completeCount / stepCount ) * 100 }%` } } /></div>

          {/* Setup card */}
          <section className="hm-card">
            <div className="hm-setup-hero">
              <div className="hm-setup-hero__text">
                <div className="hm-hero-top">
                  <h2 className="hm-hero-title">{ hero.title }</h2>
                  <p className="hm-hero-desc">{ hero.desc }</p>
                </div>
                <Button className="hm-primary" variant="solid" tone="brand" onClick={ onHeroCta }>{ hero.cta }</Button>
              </div>
              <img className="hm-setup-hero__art" src={ hero.art } alt="" aria-hidden />
            </div>
            <ol className="hm-steps">
              { SETUP_STEPS.map( ( label, i ) => {
                const complete = i < activeIndex;
                const active = i === activeIndex;
                const action = stepAction( i );
                const cls = `hm-step${ active ? ' is-active' : '' }${ complete ? ' is-complete' : '' }${ action ? ' is-clickable' : '' }`;
                const inner = (
                  <>
                    <span className="hm-step__num">
                      { complete ? <Icon icon={ check } size={ 20 } /> : i + 1 }
                    </span>
                    <span className="hm-step__label">{ stepLabel( i ) }</span>
                  </>
                );
                return (
                  <li key={ label }>
                    { action
                      ? <button type="button" className={ cls } onClick={ action }>{ inner }</button>
                      : <div className={ cls }>{ inner }</div> }
                  </li>
                );
              } ) }
            </ol>
          </section>

          {/* Things to do next */}
          <section className="hm-card">
            <div className="hm-card__head">
              <h2 className="hm-card__title">Things to do next<span className="hm-count">{ todos.length }</span></h2>
              <IconButton icon={ moreVertical } label="More" variant="minimal" tone="neutral" />
            </div>
            <ul className="hm-todos">
              { todos.map( ( t ) => (
                <li key={ t.title } className={ `hm-todo${ t.onClick ? ' hm-todo--action' : '' }` }>
                  <span className="hm-todo__check" />
                  <div className="hm-todo__text">
                    <a className="hm-todo__title" onClick={ t.onClick }>{ t.title }</a>
                    { t.meta && <span className="hm-todo__meta">{ t.meta }</span> }
                  </div>
                  <IconButton className="hm-todo__kebab" icon={ moreVertical } label="More" variant="minimal" tone="neutral" />
                </li>
              ) ) }
            </ul>
          </section>

          {/* Inbox */}
          <section className="hm-card">
            <div className="hm-card__head">
              <h2 className="hm-card__title">Inbox<span className="hm-count">{ INBOX.length }</span></h2>
              <IconButton icon={ moreVertical } label="More" variant="minimal" tone="neutral" />
            </div>
            { INBOX.map( ( note ) => (
              <div key={ note.title } className="hm-inbox">
                <span className="hm-inbox__time">{ note.time }</span>
                <strong className="hm-inbox__title">{ note.title }</strong>
                <p className="hm-inbox__body">{ note.body }</p>
                <div className="hm-inbox__actions">
                  { note.actions.map( ( a ) => (
                    <Button key={ a } variant="outline" tone="brand" size="compact">{ a }</Button>
                  ) ) }
                  <Button variant="minimal" tone="neutral" size="compact">Dismiss</Button>
                </div>
              </div>
            ) ) }
          </section>

          {/* Stats overview */}
          <section className="hm-card">
            <div className="hm-card__head">
              <h2 className="hm-card__title">Stats overview</h2>
              <IconButton icon={ moreVertical } label="More" variant="minimal" tone="neutral" />
            </div>
            <nav className="hm-stats__tabs">
              { STATS_TABS.map( ( t ) => (
                <button
                  key={ t }
                  type="button"
                  className={ `hm-stats__tab${ statsTab === t ? ' is-active' : '' }` }
                  onClick={ () => setStatsTab( t ) }
                >
                  { t }
                </button>
              ) ) }
            </nav>
            <div className="hm-stats__grid">
              <div className="hm-stat">
                <span className="hm-stat__label">Total sales</span>
                <div className="hm-stat__row">
                  <span className="hm-stat__value">{ salesValue }</span>
                  <span className="hm-stat__delta">0%</span>
                </div>
              </div>
              <div className="hm-stat">
                <span className="hm-stat__label">Orders</span>
                <div className="hm-stat__row">
                  <span className="hm-stat__value">{ ordersValue }</span>
                  <span className="hm-stat__delta">0%</span>
                </div>
              </div>
            </div>
            <a className="hm-stats__link" href="#" onClick={ ( e ) => e.preventDefault() }>View detailed stats</a>
          </section>
        </div>
      </div>
    </div>
  );
}

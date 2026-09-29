/**
 * WooCommerce → Home. The post-onboarding landing: the "Let's get you set up"
 * tasklist, "Things to do next", and the Inbox. The PayPal story shows up as a
 * "Connect PayPal to complete setup" task and — when a payment is pending — the
 * amber action-required banner pinned to the top (the second Figma tasklist frame).
 */
import { Button, IconButton } from '@wordpress/ui';
import { Icon } from '@wordpress/components';
import { moreVertical, blockTable, help, check } from '@wordpress/icons';
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
} as const;

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

  const hero = productsComplete ? SETUP_HERO.payments : SETUP_HERO.products;
  const onHeroCta = productsComplete ? paymentsAction : onCompleteProducts;
  /* Step rows are clickable: "Add your products" completes it, the payments step
     opens the wallet wizard or Payments settings as above. */
  const stepAction = ( i: number ): ( () => void ) | undefined =>
    i === 0 ? onCompleteProducts : i === 1 ? paymentsAction : undefined;
  /* Figma frame shows 3/6 complete; each finished setup step advances it. */
  const completeCount = 3 + completedSteps;

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
  const todos: Todo[] = orderPending
    ? [ connectTodo, ...baseTodos ]
    : [ baseTodos[ 0 ], baseTodos[ 1 ], baseTodos[ 2 ], connectTodo, baseTodos[ 3 ] ];

  if ( ! ready ) return <HomeSkeleton />;

  return (
    <div className="hm">
      <header className="hm-subbar">
        <span className="hm-subbar__title">Home</span>
        <div className="hm-subbar__right">
          <a className="hm-subbar__link">Preview store</a>
          <IconButton className="hm-subbar__icon" icon={ blockTable } label="Layout" variant="minimal" tone="neutral" />
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
          <div className="hm-heading">
            <h1 className="hm-title">Let's get you set up <span aria-hidden>🚀</span></h1>
            <IconButton icon={ moreVertical } label="More" variant="minimal" tone="neutral" />
          </div>
          <p className="hm-sub">Follow these steps to start selling quickly. { completeCount } out of 6 complete.</p>
          <div className="hm-progress" aria-hidden><span style={ { width: `${ ( completeCount / 6 ) * 100 }%` } } /></div>

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
              <h2 className="hm-card__title">Inbox<span className="hm-count">2</span></h2>
              <IconButton icon={ moreVertical } label="More" variant="minimal" tone="neutral" />
            </div>
            { [ 0, 1, 2 ].map( ( i ) => (
              <div key={ i } className="hm-inbox">
                <div className="hm-inbox__content">
                  <div className="hm-inbox__header">
                    <span className="hm-inbox__time">1 minute ago</span>
                    <strong className="hm-inbox__title">Learn more about something</strong>
                  </div>
                  <p className="hm-inbox__body">A beautiful little sunset. Only think about one thing at a time. Don't get greedy. With something so strong, a little bit can go a long way.</p>
                </div>
                <div className="hm-inbox__actions">
                  <Button variant="outline" tone="brand" size="compact">Learn more</Button>
                  <Button variant="minimal" tone="neutral" size="compact">Dismiss</Button>
                </div>
              </div>
            ) ) }
          </section>
        </div>
      </div>
    </div>
  );
}

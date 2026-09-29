/**
 * WooCommerce → Home. The post-onboarding landing: the "Let's get you set up"
 * tasklist, "Things to do next", and the Inbox. The PayPal story shows up as a
 * "Connect PayPal to complete setup" task and — when a payment is pending — the
 * amber action-required banner pinned to the top (the second Figma tasklist frame).
 */
import { useEffect, useRef, useState } from 'react';
import { Badge, Button, IconButton } from '@wordpress/ui';
import { Icon } from '@wordpress/components';
import { moreVertical, store, commentAuthorAvatar, help, check } from '@wordpress/icons';
import { HomeSkeleton, SetupCardSkeleton } from './AdminSkeleton';

/* The homescreen "Display options" icon (block-template-part-sidebar), copied
   verbatim from WooCommerce's activity-panel/display-options/icons/display.js. */
const DisplayIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path fillRule="evenodd" clipRule="evenodd" d="M6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4ZM18 5.5H6C5.72386 5.5 5.5 5.72386 5.5 6V9H18.5V6C18.5 5.72386 18.2761 5.5 18 5.5ZM18.5 10.5H10L10 18.5H18C18.2761 18.5 18.5 18.2761 18.5 18V10.5Z" fill="currentColor" />
  </svg>
);
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
  /* Shown once a shopper has paid but PayPal isn't connected yet — the setup card
     pivots to completing the PayPal Wallet setup, using the wallet badge icon. */
  paypalWallet: {
    title: 'Set up PayPal Wallet',
    desc: 'You received an order paid with PayPal Wallet. Connect PayPal Wallet to receive the payment.',
    cta: 'Set up PayPal Wallet',
    art: '/logos/paypal/paypal-wallet-badge.svg',
    alt: 'PayPal Wallet',
  },
} as const;

/* Inbox notes (static prototype content). Each has its own action buttons plus a
   Dismiss; the whole row highlights on hover but isn't itself clickable. */
const INBOX = [
  {
    time: '6 minutes ago',
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
  /* Full-page skeleton every time the Home screen is entered (remounts on nav). */
  const ready = useReady( 'admin-home', 700 );

  /* When "Add your products" is completed in place, load just the setup card
     (not the whole page) before it flips to the "Set up payments" active step. */
  const [ cardLoading, setCardLoading ] = useState( false );
  const prevProductsDone = useRef( state.productsDone );
  useEffect( () => {
    if ( state.productsDone && ! prevProductsDone.current ) {
      setCardLoading( true );
      const t = setTimeout( () => setCardLoading( false ), 700 );
      prevProductsDone.current = state.productsDone;
      return () => clearTimeout( t );
    }
    prevProductsDone.current = state.productsDone;
  }, [ state.productsDone ] );

  /* Stats overview: reflects the shopper sale once an order has been placed. */
  const [ statsTab, setStatsTab ] = useState( STATS_TABS[ 0 ] );
  const salesValue = state.orderReceived ? '$15.00' : '$0.00';
  const ordersValue = state.orderReceived ? '1' : '0';

  /* Checklist progress. "Set up payments" checks off once PayPal is connected
     (paypal active); "Add your products" checks off when marked done (or once
     payments is set up, which implies products). The active step is the first
     incomplete one, and the hero follows it. */
  const paymentsComplete = state.paypal === 'active';
  const productsComplete = state.productsDone || paymentsComplete;
  const completedSteps = paymentsComplete ? 2 : productsComplete ? 1 : 0;
  const activeIndex = completedSteps;

  /* Which individual steps read as done. Products (0) and payments (1) track
     their real state; "Launch your store" (4) is marked done once products are
     added (there's nothing more to do in the prototype), so completion isn't a
     contiguous prefix; the remaining steps follow contiguous progress. */
  const stepComplete = ( i: number ): boolean => {
    if ( i === 0 ) return productsComplete;
    if ( i === 1 ) return paymentsComplete;
    if ( i === 4 ) return productsComplete;
    return i < activeIndex;
  };

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
    : orderPending
      ? SETUP_HERO.paypalWallet
      : productsComplete ? SETUP_HERO.payments : SETUP_HERO.products;
  /* The PayPal Wallet hero shows a small square icon (not a full illustration);
     it renders beside the title+description and is centered against them only. */
  const isIconHero = hero === SETUP_HERO.paypalWallet;
  const onHeroCta = paymentsComplete
    ? () => {}
    : productsComplete ? paymentsAction : onCompleteProducts;
  /* Step rows are clickable: "Add your products" completes it, the payments step
     opens the wallet wizard or Payments settings as above. */
  const stepAction = ( i: number ): ( () => void ) | undefined =>
    i === 0 ? onCompleteProducts : i === 1 ? paymentsAction : undefined;
  /* Actual completion of the checklist items (starts at 0 of 5). */
  const stepCount = SETUP_STEPS.length;
  const completeCount = SETUP_STEPS.filter( ( _, i ) => stepComplete( i ) ).length;

  type Todo = { title: string; meta?: string; onClick?: () => void };
  /* "Things to do next" — the standard WooCommerce suggestions. */
  const todos: Todo[] = [
    { title: 'Grow your business', meta: '2 minutes' },
    { title: 'Enhance your store with extensions' },
    { title: 'Get the free WooCommerce mobile app' },
  ];

  if ( ! ready ) return <HomeSkeleton />;

  return (
    <div className="hm">
      <header className="hm-subbar">
        <span className="hm-subbar__title">Home</span>
        <div className="hm-subbar__right">
          <button type="button" className="hm-subbar__icon" aria-label="View store"><Icon icon={ store } size={ 18 } /></button>
          <button type="button" className="hm-subbar__icon" aria-label="Display options"><DisplayIcon /></button>
          <button type="button" className="hm-subbar__icon" aria-label="Account"><Icon icon={ commentAuthorAvatar } size={ 18 } /></button>
          <button type="button" className="hm-subbar__icon" aria-label="Help"><Icon icon={ help } size={ 18 } /></button>
        </div>
      </header>

      <div className="hm-canvas">
        <div className="hm-col">
          <h1 className="hm-title">Let's get you set up <span aria-hidden>🚀</span></h1>
          <div className="hm-subrow">
            <p className="hm-sub">Follow these steps to start selling quickly. { completeCount } out of { stepCount } complete.</p>
            <IconButton icon={ moreVertical } label="More" variant="minimal" tone="neutral" />
          </div>
          <div className="hm-progress" aria-hidden><span style={ { width: `${ ( completeCount / stepCount ) * 100 }%` } } /></div>

          {/* Setup card — shows just this card's skeleton while a step completes */}
          { cardLoading ? <SetupCardSkeleton /> : (
          <section className="hm-card">
            <div className="hm-setup-hero">
              <div className="hm-setup-hero__text">
                <div className="hm-hero-lead">
                  <div className="hm-hero-top">
                    <div className="hm-hero-titlerow">
                      <h2 className="hm-hero-title">{ hero.title }</h2>
                      { isIconHero && <Badge intent="none">1 pending order</Badge> }
                    </div>
                    <p className="hm-hero-desc">{ hero.desc }</p>
                  </div>
                  { isIconHero && (
                    <img className="hm-setup-hero__art hm-setup-hero__art--icon" src={ hero.art } alt="" aria-hidden />
                  ) }
                </div>
                <Button className="hm-primary" variant="solid" tone="brand" onClick={ onHeroCta }>{ hero.cta }</Button>
              </div>
              { ! isIconHero && (
                <img className="hm-setup-hero__art" src={ hero.art } alt="" aria-hidden />
              ) }
            </div>
            <ol className="hm-steps">
              { SETUP_STEPS.map( ( label, i ) => {
                const complete = stepComplete( i );
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
          ) }

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

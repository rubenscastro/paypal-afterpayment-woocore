/**
 * The merchant track's model: every screen it can show, and the store state the
 * screens read and write.
 *
 * The merchant journey is one connected, click-through prototype — the Woo
 * core-profiler funnel (full-screen, no admin chrome) flows into wp-admin, then
 * into the PayPal Wallet onboarding wizard and its four management tabs. Rather
 * than a URL router, it's a single `screen` field on one state object, so the
 * switcher can jump anywhere and toggle the states (PayPal connected? payment
 * pending?) that make each screen differ.
 */

/** Full-screen Woo onboarding (core profiler) steps. */
export const ONBOARDING_SCREENS = [
  'welcome',
  'profile',
  'business',
  'extensions',
  'features-loader',
  'jetpack-connect',
  'account-loader',
  'skip-location',
  'skip-loader',
] as const;

/** wp-admin screens (rendered inside the admin shell). */
export const ADMIN_SCREENS = [
  'home',
  'orders',
  'order-details',
  'payments',
  'wallet-welcome',
  'wallet-connecting',
  'wallet-manage',
] as const;

export const MERCHANT_SCREENS = [
  ...ONBOARDING_SCREENS,
  ...ADMIN_SCREENS,
] as const;

export type MerchantScreen = ( typeof MERCHANT_SCREENS )[ number ];

export const WALLET_TABS = [ 'overview', 'methods', 'settings', 'styling' ] as const;
export type WalletTab = ( typeof WALLET_TABS )[ number ];

/** Where a provider row sits in its lifecycle — drives its chip + primary CTA. */
export type PayPalStatus = 'not_installed' | 'needs_action' | 'active';

export interface MerchantState {
  screen: MerchantScreen;

  /** PayPal Wallet provider lifecycle:
   *  - not_installed: only the Woo offer is on the page (PayPal came via the
   *    onboarding "Extensions" step, so the default is `needs_action`).
   *  - needs_action: installed, not connected → "Complete setup".
   *  - active: connected → "Manage". */
  paypal: PayPalStatus;

  /** A customer already paid with PayPal but the account isn't connected — the
   *  amber "Complete setup to receive your payment" banner + home-screen task. */
  pendingPayment: boolean;

  /** Home tasklist: whether "Add your products" has been marked complete. Flips
   *  the setup hero from the Products header to the Payments header ("It's time
   *  to get paid") and advances the checklist to the "Set up payments" step. */
  productsDone: boolean;

  /** A shopper order has been placed (persists past PayPal connection) — drives
   *  the Home "Stats overview" (Orders → 1, Total sales up). */
  orderReceived: boolean;

  /** Which management tab the PayPal Wallet screen shows. */
  walletTab: WalletTab;

  /** Checkout methods offered (Pay with PayPal is required, always on). */
  methods: {
    venmo: boolean;
    payLater: boolean;
  };

  /** Settings tab. */
  settings: {
    invoicePrefix: string;
    authorizeOnly: boolean;
    captureVirtual: boolean;
    saveMethods: boolean;
    payNow: boolean;
  };

  /** Styling tab. */
  styling: {
    location: string;
    venmo: boolean;
    payLater: boolean;
    layout: 'vertical' | 'horizontal';
    shape: 'rectangle' | 'pill';
    label: string;
    color: string;
    tagline: boolean;
    darkMode: boolean;
  };
}

export const INITIAL_STATE: MerchantState = {
  screen: 'welcome',
  paypal: 'needs_action',
  /* No pending payment on first landing — the amber "receive your payment"
     notice only arms once a shopper completes a purchase (see ShopperApp
     → onPurchase in App). */
  pendingPayment: false,
  productsDone: false,
  orderReceived: false,
  walletTab: 'overview',
  methods: { venmo: true, payLater: true },
  settings: {
    invoicePrefix: '',
    authorizeOnly: true,
    captureVirtual: false,
    saveMethods: false,
    payNow: false,
  },
  styling: {
    location: 'Product page',
    venmo: true,
    payLater: false,
    layout: 'vertical',
    shape: 'rectangle',
    label: 'Buy Now',
    color: 'Gold (Recommended)',
    tagline: false,
    darkMode: false,
  },
};

/** Human labels for the screen picker in the switcher. */
export const SCREEN_LABEL: Record< MerchantScreen, string > = {
  welcome: 'Onboarding · Welcome',
  profile: 'Onboarding · Profile',
  business: 'Onboarding · Business info',
  extensions: 'Onboarding · Extensions',
  'features-loader': 'Onboarding · Loader',
  'jetpack-connect': 'Onboarding · Connect account',
  'account-loader': 'Onboarding · Connecting',
  'skip-location': 'Onboarding · Business location (skip)',
  'skip-loader': 'Onboarding · Turning on the lights',
  home: 'Admin · Home / tasklist',
  orders: 'Admin · Orders',
  'order-details': 'Admin · Order details',
  payments: 'Admin · Payments settings',
  'wallet-welcome': 'PayPal · Setup wizard',
  'wallet-connecting': 'PayPal · Connecting',
  'wallet-manage': 'PayPal · Manage',
};

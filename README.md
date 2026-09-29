# PayPal Payments Integration

A prototype of the **PayPal Wallet** integration for WooCommerce, built on the
`payments-settings` base — the real WordPress admin chrome (top bar, sidebar,
`@wordpress/*` design tokens) wrapped around the flow.

The prototype holds **two tracks**, and which one you're looking at is the
switcher's first and primary choice (bottom-left, floating over the chrome):

- **Merchant view** — the store owner's wp-admin experience of discovering,
  onboarding and managing PayPal Wallet. Built from the "Merchant Flow" Figma
  section, wired into one click-through flow.
- **Shopper view** — the storefront / checkout experience. **Scaffolded only**;
  waiting on the shopper-track designs (drops into `src/shopper/`).

## Merchant flow

One state object, one `screen` field, and the navigation that links the Figma
frames together:

1. **Onboarding** (full-screen Woo core profiler, no admin chrome) — Welcome →
   Profile → Business info → Extensions (where PayPal Wallet is installed) →
   loader → wp-admin.
2. **Home / tasklist** — "Let's get you set up", a "Connect PayPal to complete
   setup" task, and (when a payment is pending) the amber action-required banner.
3. **Payments settings** — the Payments tab provider list. The PayPal Wallet row
   shows *Needs action* + "Complete setup" (with an inline warning banner) or
   *Active* + "Manage", driven by state.
4. **PayPal Wallet setup wizard** — "Welcome to PayPal Wallet" → connect.
5. **PayPal Wallet management** — four tabs: **Overview**, **Payment methods**
   (Pay with PayPal / Venmo / Pay Later toggles), **Settings** (connection,
   common, expert), **Styling** (button controls + live preview with dark mode).

The floating switcher jumps to any screen and flips the states that make screens
differ — PayPal *Needs action* vs *Active*, and the payment-pending banner — so
the whole flow is demoable without clicking through it. The track lives in the
query string (`?track=merchant`), so any configuration is a shareable link.

## Run

```bash
npm install
npm run dev      # http://localhost:5179
```

```bash
npm run build    # tsc + vite build → dist/
```

## Layout

```
src/
  main.tsx                    entry — mounts App, loads stylesheets in order
  App.tsx                     track router + switcher host
  tracks.ts                   the primary choice: merchant | shopper
  TrackSwitcher.tsx           floating control: track, screen jump, state toggles
  switcherUi.tsx              shared switcher menu primitives
  urlState.ts                 query-string read/write helpers
  SidebarIcons.tsx            sidebar nav icons
  OfficialMark.tsx            the Woo "Official" mark
  WooPaymentsMethodsLogos.tsx supported-methods logo strip
  styles.css                  shared chrome: topbar, sidebar, switcher
  brand.css                   the shared brand components' styles

  chrome/
    WpAdminShell.tsx          topbar + sidebar wrapper for the admin screens

  merchant/
    MerchantApp.tsx           state + screen router / navigation
    flow.ts                   screen ids + merchant state model
    merchant.css              all merchant-track styles
    onboarding/               full-screen Woo core-profiler funnel
      OnboardingShell.tsx     progress bar + Woo wordmark + skip
      WelcomeStep.tsx  ProfileStep.tsx  BusinessInfoStep.tsx
      ExtensionsStep.tsx  FunLoader.tsx
    admin/
      HomeTasklist.tsx        WooCommerce → Home
      PaymentsSettings.tsx    WooCommerce → Settings → Payments
      wallet/
        WalletWizard.tsx      "Welcome to PayPal Wallet" onboarding
        WalletManage.tsx      the four management tabs

  shopper/
    ShopperApp.tsx            placeholder (awaiting shopper Figma)
    shopper.css

public/logos/paypal/          PayPal-family brand marks (gold, wordmark, Venmo…)
```

## Design source

Merchant screens: Figma "PayPal Payments Integration" → **Merchant Flow**
(`2MzM1xaZ8e2VlgDUU08otU`, node `11458-96940`).

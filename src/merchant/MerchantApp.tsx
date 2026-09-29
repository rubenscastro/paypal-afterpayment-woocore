/**
 * The merchant track: one state object, one `screen` field, and the navigation
 * that links the Figma frames into a click-through prototype. Onboarding screens
 * render full-screen; wp-admin screens render inside the admin shell.
 *
 * `state` and `setState` are lifted to `App` so the track switcher can jump to
 * any screen and preset the states (PayPal connected? payment pending?) that make
 * the screens differ.
 */
import { useState } from 'react';
import WpAdminShell from '../chrome/WpAdminShell';
import { type MerchantState, type WalletTab } from './flow';
import WelcomeStep from './onboarding/WelcomeStep';
import ProfileStep from './onboarding/ProfileStep';
import BusinessInfoStep from './onboarding/BusinessInfoStep';
import ExtensionsStep from './onboarding/ExtensionsStep';
import FunLoader from './onboarding/FunLoader';
import JetpackConnectStep from './onboarding/JetpackConnectStep';
import BusinessLocationStep from './onboarding/BusinessLocationStep';
import HomeTasklist from './admin/HomeTasklist';
import PaymentsSettings from './admin/PaymentsSettings';
import WalletWizard from './admin/wallet/WalletWizard';
import WalletManage from './admin/wallet/WalletManage';
import PayPalConnectFlow from './admin/wallet/PayPalConnectFlow';
import { track } from '../analytics';

export default function MerchantApp( {
  state,
  setState,
  onViewStore,
}: {
  state: MerchantState;
  setState: ( updater: ( s: MerchantState ) => MerchantState ) => void;
  /** Open the storefront (shopper track) — wired to the top bar's site name. */
  onViewStore?: () => void;
} ) {
  const go = ( screen: MerchantState['screen'] ) => setState( ( s ) => ( { ...s, screen } ) );
  const update = ( patch: Partial< MerchantState > ) => setState( ( s ) => ( { ...s, ...patch } ) );

  /* Pending setup tasks (of 5) — shown as the blue badge on the Home submenu.
     Kept in sync with the Home tasklist: adding products completes both "Add
     your products" and "Launch your store"; connecting PayPal adds "Set up
     payments". */
  const productsDone = state.productsDone || state.paypal === 'active';
  const completedSetup =
    ( productsDone ? 1 : 0 ) + ( state.paypal === 'active' ? 1 : 0 ) + ( productsDone ? 1 : 0 );
  const pendingTasks = 5 - completedSetup;

  /* The PayPal integration popup (mac-browser overlay). Opened from the wallet
     wizard's "Set up PayPal Wallet"; completing it ("Return to WooCommerce")
     marks PayPal connected, then the wizard's CTA spins for 2s before redirecting
     to the Wallet management screen — no "Connecting your account" loader. */
  const [ connectOpen, setConnectOpen ] = useState( false );
  const [ ctaLoading, setCtaLoading ] = useState( false );
  const connectFlow = (
    <PayPalConnectFlow
      open={ connectOpen }
      onClose={ () => setConnectOpen( false ) }
      onComplete={ () => {
        setConnectOpen( false );
        setCtaLoading( true );
        track( 'PayPal Wallet Connected', { integration: 'PayPal Wallet' } );
        update( { paypal: 'active', pendingPayment: false } );
        setTimeout( () => {
          setCtaLoading( false );
          update( { walletTab: 'overview', screen: 'wallet-manage' } );
        }, 2000 );
      } }
    />
  );

  switch ( state.screen ) {
    case 'welcome':
      return <WelcomeStep onNext={ () => go( 'profile' ) } onSkip={ () => go( 'skip-location' ) } />;
    case 'profile':
      return <ProfileStep onNext={ () => go( 'business' ) } onSkip={ () => go( 'business' ) } />;
    case 'business':
      return <BusinessInfoStep onNext={ () => go( 'extensions' ) } onSkip={ () => go( 'extensions' ) } />;
    case 'extensions':
      return <ExtensionsStep onNext={ () => go( 'features-loader' ) } onSkip={ () => go( 'features-loader' ) } />;
    case 'features-loader':
      return (
        <FunLoader
          title="Woo! Let's get your features ready"
          image="/logos/woo/loader-developing.svg"
          delay={ 4000 }
          onDone={ () => go( 'jetpack-connect' ) }
        />
      );
    case 'jetpack-connect':
      return <JetpackConnectStep onConnect={ () => go( 'account-loader' ) } onSwitchUser={ () => go( 'account-loader' ) } />;
    case 'account-loader':
      return (
        <FunLoader
          title="Connecting your account"
          image="/logos/woo/loader-developing.svg"
          delay={ 4000 }
          onDone={ () => go( 'home' ) }
        />
      );

    case 'skip-location':
      return <BusinessLocationStep onNext={ () => go( 'skip-loader' ) } />;
    case 'skip-loader':
      return (
        <FunLoader
          title="Turning on the lights"
          image="/logos/woo/loader-lightbulb.svg"
          fact="Explore powerful extensions and themes at WooCommerce.com to enhance your store."
          delay={ 4000 }
          onDone={ () => go( 'home' ) }
        />
      );

    case 'home':
      return (
        <WpAdminShell activeSub="Home" onSelectSub={ go } onViewStore={ onViewStore } homeBadge={ pendingTasks }>
          <HomeTasklist
            state={ state }
            onConnectPaypal={ () => go( 'wallet-welcome' ) }
            onGoPayments={ () => go( 'payments' ) }
            onCompleteProducts={ () => update( { productsDone: true } ) }
          />
        </WpAdminShell>
      );

    case 'payments':
      return (
        <WpAdminShell activeSub="Settings" onSelectSub={ go } onViewStore={ onViewStore } homeBadge={ pendingTasks }>
          <PaymentsSettings
            state={ state }
            onCompleteSetup={ () => go( 'wallet-welcome' ) }
            onManage={ () => update( { screen: 'wallet-manage', walletTab: 'overview' } ) }
          />
        </WpAdminShell>
      );

    case 'wallet-welcome':
      return (
        <WpAdminShell activeSub="Settings" onSelectSub={ go } onViewStore={ onViewStore } homeBadge={ pendingTasks }>
          <WalletWizard
            onBack={ () => go( 'payments' ) }
            onConnect={ () => setConnectOpen( true ) }
            loading={ ctaLoading }
            pendingOrder={ state.pendingPayment && state.paypal !== 'active' }
          />
          { connectFlow }
        </WpAdminShell>
      );

    case 'wallet-connecting':
      return (
        <WpAdminShell activeSub="Settings" onSelectSub={ go } onViewStore={ onViewStore } homeBadge={ pendingTasks }>
          <FunLoader
            title="Connecting your account"
            image="/logos/woo/loader-openingthedoors.svg"
            delay={ 4000 }
            onDone={ () => update( { paypal: 'active', pendingPayment: false, screen: 'wallet-manage', walletTab: 'overview' } ) }
          />
        </WpAdminShell>
      );

    case 'wallet-manage':
      return (
        <WpAdminShell activeSub="Settings" onSelectSub={ go } onViewStore={ onViewStore } homeBadge={ pendingTasks }>
          <WalletManage
            state={ state }
            onBack={ () => go( 'payments' ) }
            onTab={ ( tab: WalletTab ) => update( { walletTab: tab } ) }
            update={ update }
          />
        </WpAdminShell>
      );
  }
}

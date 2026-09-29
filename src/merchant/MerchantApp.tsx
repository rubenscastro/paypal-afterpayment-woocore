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
import HomeTasklist from './admin/HomeTasklist';
import PaymentsSettings from './admin/PaymentsSettings';
import WalletWizard from './admin/wallet/WalletWizard';
import WalletManage from './admin/wallet/WalletManage';
import PayPalConnectFlow from './admin/wallet/PayPalConnectFlow';

export default function MerchantApp( {
  state,
  setState,
}: {
  state: MerchantState;
  setState: ( updater: ( s: MerchantState ) => MerchantState ) => void;
} ) {
  const go = ( screen: MerchantState['screen'] ) => setState( ( s ) => ( { ...s, screen } ) );
  const update = ( patch: Partial< MerchantState > ) => setState( ( s ) => ( { ...s, ...patch } ) );

  /* The PayPal integration popup (mac-browser overlay). Opened from the wallet
     wizard's "Set up PayPal Wallet"; completing it ("Return to WooCommerce")
     marks PayPal connected and lands directly on the Wallet management screen,
     which shows its own loading skeleton — no "Connecting your account" loader. */
  const [ connectOpen, setConnectOpen ] = useState( false );
  const connectFlow = (
    <PayPalConnectFlow
      open={ connectOpen }
      onClose={ () => setConnectOpen( false ) }
      onComplete={ () => {
        setConnectOpen( false );
        update( { paypal: 'active', pendingPayment: false, walletTab: 'overview', screen: 'wallet-manage' } );
      } }
    />
  );

  switch ( state.screen ) {
    case 'welcome':
      return <WelcomeStep onNext={ () => go( 'profile' ) } onSkip={ () => go( 'home' ) } />;
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

    case 'home':
      return (
        <WpAdminShell activeSub="Home" onSelectSub={ go }>
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
        <WpAdminShell activeSub="Settings" onSelectSub={ go }>
          <PaymentsSettings
            state={ state }
            onCompleteSetup={ () => go( 'wallet-welcome' ) }
            onManage={ () => update( { screen: 'wallet-manage', walletTab: 'overview' } ) }
          />
        </WpAdminShell>
      );

    case 'wallet-welcome':
      return (
        <WpAdminShell activeSub="Settings" onSelectSub={ go }>
          <WalletWizard onBack={ () => go( 'payments' ) } onConnect={ () => setConnectOpen( true ) } />
          { connectFlow }
        </WpAdminShell>
      );

    case 'wallet-connecting':
      return (
        <WpAdminShell activeSub="Settings" onSelectSub={ go }>
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
        <WpAdminShell activeSub="Settings" onSelectSub={ go }>
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

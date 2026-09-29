/**
 * Core profiler step — "Get a boost with our free features". A grid of feature
 * cards: some already installed (WooPayments, PayPal Wallet, Jetpack) shown with
 * an "Installed" chip, the rest opt-in checkboxes (checked by default). PayPal
 * Wallet lands here — it's how the merchant ends up with it in the payments tab.
 */
import { useState } from 'react';
import { Button, CheckboxControl } from '@wordpress/components';
import OnboardingShell from './OnboardingShell';

interface Ext {
  id: string;
  title: string;
  desc: string;
  logo: string;
  /** Installed extensions show a chip and no checkbox. */
  installed?: boolean;
}

const EXTENSIONS: Ext[] = [
  { id: 'woopayments', title: 'Get paid with WooPayments', desc: 'Offer safe and convenient way to pay with WooPayments', logo: '/logos/woo/woo-square.svg', installed: true },
  { id: 'google', title: 'Drive sales with Google Listings & Ads', desc: 'Create ads for your products straight from your dashboard', logo: '/logos/woo/logo-google.svg' },
  { id: 'paypal', title: 'Give shoppers a variety of ways to pay', desc: 'Offer additional payment options with PayPal Wallet', logo: '/logos/paypal.svg', installed: true },
  { id: 'pinterest', title: 'Showcase your products with Pinterest', desc: 'Get your products in front of a highly engaged audience', logo: '/logos/woo/logo-pinterest.svg' },
  { id: 'jetpack', title: 'Enhance security with Jetpack', desc: 'Keep your store online with full security and backups', logo: '/logos/woo/logo-jetpack.svg', installed: true },
  { id: 'shipping', title: 'Print shipping labels with WooCommerce Shipping', desc: 'Print discounted USPS and DHL labels', logo: '/logos/woo/woo-square.svg' },
  { id: 'tiktok', title: 'Create ad campaigns with TikTok', desc: 'Sync your store with TikTok to create engaging campaigns', logo: '/logos/woo/logo-tiktok.png' },
  { id: 'google2', title: 'Drive sales with Google Listings & Ads', desc: 'Create ads for your products straight from your dashboard', logo: '/logos/woo/logo-google.svg' },
];

export default function ExtensionsStep( {
  onNext,
  onSkip,
}: {
  onNext: () => void;
  onSkip: () => void;
} ) {
  const [ checked, setChecked ] = useState< Record< string, boolean > >( () =>
    Object.fromEntries( EXTENSIONS.filter( ( e ) => ! e.installed ).map( ( e ) => [ e.id, true ] ) )
  );

  return (
    <OnboardingShell progress={ 0.68 } skipLabel="Skip this step" onSkip={ onSkip }>
      <div className="ob-ext">
        <h1 className="ob-title">Get a boost with our free features</h1>
        <p className="ob-lede">
          No commitment required – you can remove them at any time.
        </p>
        <div className="ob-ext__grid">
          { EXTENSIONS.map( ( ext ) => (
            <div key={ ext.id } className="ob-ext__card">
              { ext.installed ? (
                <img className="ob-ext__logo" src={ ext.logo } alt="" aria-hidden />
              ) : (
                <CheckboxControl
                  __nextHasNoMarginBottom
                  checked={ !! checked[ ext.id ] }
                  onChange={ ( v ) => setChecked( ( c ) => ( { ...c, [ ext.id ]: v } ) ) }
                  label=""
                  aria-label={ ext.title }
                />
              ) }
              { ! ext.installed && <img className="ob-ext__logo ob-ext__logo--sm" src={ ext.logo } alt="" aria-hidden /> }
              <div className="ob-ext__text">
                <div className="ob-ext__title-row">
                  <span className="ob-ext__title">{ ext.title }</span>
                  { ext.installed && <span className="ob-ext__chip">Installed</span> }
                </div>
                <span className="ob-ext__desc">{ ext.desc }</span>
              </div>
            </div>
          ) ) }
        </div>
        <div className="ob-ext__footer">
          <Button variant="primary" className="ob-cta" onClick={ onNext }>Continue</Button>
          <p className="ob-ext__terms">
            By installing Jetpack and WooCommerce Tax plugins for free you agree to
            our <a href="#" onClick={ ( e ) => e.preventDefault() }>Terms of Service</a>.
          </p>
        </div>
      </div>
    </OnboardingShell>
  );
}

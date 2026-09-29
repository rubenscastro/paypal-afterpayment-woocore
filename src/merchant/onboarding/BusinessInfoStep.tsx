/** Core profiler step 02 — "Tell us a bit about your store". */
import { useState } from 'react';
import { Button, CheckboxControl, SelectControl, TextControl } from '@wordpress/components';
import OnboardingShell from './OnboardingShell';

export default function BusinessInfoStep( {
  onNext,
  onSkip,
}: {
  onNext: () => void;
  onSkip: () => void;
} ) {
  const [ name, setName ] = useState( 'My awesome store' );
  const [ type, setType ] = useState( 'clothing' );
  const [ country, setCountry ] = useState( 'US' );
  const [ email, setEmail ] = useState( 'test@store.com' );
  const [ optIn, setOptIn ] = useState( false );

  // SelectControl types `label` as string, but it renders any ReactNode — used
  // here so the required asterisk can be coloured.
  const locationLabel = (
    <>Where is your store located? <span className="ob-req">*</span></>
  ) as unknown as string;

  return (
    <OnboardingShell progress={ 0.48 } onSkip={ onSkip }>
      <div className="ob-form ob-form--business">
        <h1 className="ob-title">Tell us a bit about your store</h1>
        <p className="ob-lede ob-lede--wide">
          We'll use this information to help you set up payments, shipping,<br />
          and taxes, as well as recommending the best theme for your store.
        </p>
        <div className="ob-choices">
          <div className="ob-fields">
            <TextControl
              __next40pxDefaultSize __nextHasNoMarginBottom
              label="Give your store a name"
              value={ name }
              onChange={ setName }
              help="Don't worry — you can always change it later!"
            />
            <SelectControl
              __next40pxDefaultSize __nextHasNoMarginBottom
              label="What type of products or services do you plan to sell?"
              value={ type }
              onChange={ setType }
              options={ [
                { label: 'Clothing and accessories', value: 'clothing' },
                { label: 'Health and beauty', value: 'health' },
                { label: 'Electronics and computers', value: 'electronics' },
                { label: 'Food and drink', value: 'food' },
                { label: 'Home, furniture and garden', value: 'home' },
                { label: 'Other', value: 'other' },
              ] as { label: string; value: string }[] }
            />
            <SelectControl
              __next40pxDefaultSize __nextHasNoMarginBottom
              label={ locationLabel }
              value={ country }
              onChange={ setCountry }
              options={ [
                { label: 'United States', value: 'US' },
                { label: 'United Kingdom', value: 'UK' },
                { label: 'Canada', value: 'CA' },
                { label: 'Australia', value: 'AU' },
                { label: 'Germany', value: 'DE' },
              ] as { label: string; value: string }[] }
            />
            <TextControl
              __next40pxDefaultSize __nextHasNoMarginBottom
              label="Your email address"
              type="email"
              value={ email }
              onChange={ setEmail }
            />
            <CheckboxControl
              __nextHasNoMarginBottom
              className="ob-optin"
              checked={ optIn }
              onChange={ setOptIn }
              label="Opt-In to receive tips, discounts, and recommendations from the Woo team directly in your inbox."
            />
          </div>
          <Button variant="primary" className="ob-cta ob-cta--block" onClick={ onNext }>Continue</Button>
        </div>
      </div>
    </OnboardingShell>
  );
}

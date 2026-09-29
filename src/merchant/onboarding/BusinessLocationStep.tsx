/**
 * The "Skip guided setup" destination: a minimal core-profiler screen asking only
 * where the business is located, then "Go to my store". Copy from WooCommerce's
 * core-profiler BusinessLocation page.
 */
import { Button, SelectControl } from '@wordpress/components';
import { useState } from 'react';
import OnboardingShell from './OnboardingShell';

const LOCATIONS = [
  'United States (US) — California',
  'United States (US) — New York',
  'United Kingdom (UK)',
  'Canada — Ontario',
  'Australia — New South Wales',
  'Brazil — São Paulo',
];

export default function BusinessLocationStep( { onNext }: { onNext: () => void } ) {
  const [ location, setLocation ] = useState( LOCATIONS[ 0 ] );
  return (
    <OnboardingShell progress={ 0.5 }>
      <div className="ob-center ob-location">
        <h1 className="ob-title">Where is your business located?</h1>
        <p className="ob-lede">We’ll use this information to help you set up payments, shipping, and taxes.</p>
        <div className="ob-location__field">
          <SelectControl
            __next40pxDefaultSize
            __nextHasNoMarginBottom
            label=""
            aria-label="Select country/region"
            value={ location }
            onChange={ setLocation }
            options={ LOCATIONS.map( ( o ) => ( { label: o, value: o } ) ) }
          />
          <Button variant="primary" className="ob-cta" onClick={ onNext }>Go to my store</Button>
        </div>
      </div>
    </OnboardingShell>
  );
}

/** Core profiler step 00 — "Welcome to Woo!" (IntroOptIn). */
import { Button, CheckboxControl } from '@wordpress/components';
import { useState } from 'react';
import OnboardingShell from './OnboardingShell';

export default function WelcomeStep( {
  onNext,
  onSkip,
}: {
  onNext: () => void;
  onSkip: () => void;
} ) {
  const [ share, setShare ] = useState( true );
  return (
    /* Welcome has no top-right skip — the skip is a tertiary button under the
       CTA, and the consent footer is pinned to the bottom of the page. */
    <OnboardingShell progress={ 0.08 }>
      <div className="ob-welcome">
        <div className="ob-center">
          <div className="ob-illus" role="img" aria-label="Welcome" />
          <h1 className="ob-title ob-title--welcome">Welcome to Woo!</h1>
          <p className="ob-lede">
            It’s great to have you here with us! We’ll be guiding you through the
            setup process – first, answer a few questions to tailor your experience.
          </p>
          <Button variant="primary" className="ob-cta" onClick={ onNext }>Set up my store</Button>
          <Button variant="tertiary" className="ob-skip-btn" onClick={ onSkip }>Skip guided setup</Button>
        </div>

        <div className="ob-consent">
          <CheckboxControl
            __nextHasNoMarginBottom
            checked={ share }
            onChange={ setShare }
            label=""
            aria-label="Share my data to tailor my store setup experience"
          />
          <span>
            I agree to share my data to tailor my store setup experience and get
            more relevant content. WooCommerce will never rent or sell your data,
            and you can opt out at any time in WooCommerce settings.{ ' ' }
            <a href="#" onClick={ ( e ) => e.preventDefault() }>Learn more about usage tracking</a>.
          </span>
        </div>
      </div>
    </OnboardingShell>
  );
}

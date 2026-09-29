/** Core profiler step 01 — "Which one of these best describes you?" */
import { useState } from 'react';
import { Button } from '@wordpress/components';
import OnboardingShell from './OnboardingShell';

const CHOICES = [
  "I'm just starting my business",
  "I'm already selling",
  "I'm setting up a store for a client",
];

export default function ProfileStep( {
  onNext,
  onSkip,
}: {
  onNext: () => void;
  onSkip: () => void;
} ) {
  const [ choice, setChoice ] = useState( 0 );
  return (
    <OnboardingShell progress={ 0.28 } skipLabel="Skip this step" onSkip={ onSkip }>
      <div className="ob-form ob-form--profile">
        <h1 className="ob-title ob-title--nowrap">Which one of these best describes you?</h1>
        <p className="ob-lede">
          Let us know where you are in your commerce journey<br />
          so that we can tailor your Woo experience for you.
        </p>
        <div className="ob-choices">
          <div className="ob-radios">
            { CHOICES.map( ( label, i ) => (
              <button
                key={ label }
                type="button"
                className={ `ob-radio${ i === choice ? ' is-selected' : '' }` }
                onClick={ () => setChoice( i ) }
              >
                <span className="ob-radio__dot" aria-hidden><span /></span>
                { label }
              </button>
            ) ) }
          </div>
          <Button variant="primary" className="ob-cta ob-cta--block" onClick={ onNext }>Continue</Button>
        </div>
      </div>
    </OnboardingShell>
  );
}

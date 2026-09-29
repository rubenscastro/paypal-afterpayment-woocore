/**
 * Full-screen chrome for the Woo core-profiler onboarding steps: a top progress
 * bar, the Woo wordmark, and an optional "Skip" link on the right. No wp-admin
 * sidebar — this is the pre-install setup wizard.
 *
 * Each step renders its own shell, so the progress fill would remount at its new
 * width with no transition. We keep the previous fraction at module scope and
 * start each mount there, then animate to the new value on the next frame — so
 * the bar visibly *grows* as the wizard advances a step.
 */
import { useEffect, useState, type ReactNode } from 'react';

let lastProgress = 0;

export default function OnboardingShell( {
  progress,
  skipLabel,
  onSkip,
  children,
}: {
  /** 0–1 fraction filled in the top progress bar. */
  progress: number;
  skipLabel?: string;
  onSkip?: () => void;
  children: ReactNode;
} ) {
  const [ width, setWidth ] = useState( lastProgress );

  useEffect( () => {
    const id = requestAnimationFrame( () => setWidth( progress ) );
    lastProgress = progress;
    return () => cancelAnimationFrame( id );
  }, [ progress ] );

  return (
    <div className="ob">
      <div className="ob-progress" aria-hidden>
        <div className="ob-progress__fill" style={ { width: `${ Math.round( width * 100 ) }%` } } />
      </div>
      <header className="ob-header">
        <img className="ob-logo" src="/logos/woo/woo-wordmark.svg" width={ 57 } height={ 15 } alt="Woo" />
        { skipLabel && (
          <button type="button" className="ob-skip" onClick={ onSkip }>
            { skipLabel }
          </button>
        ) }
      </header>
      <div className="ob-body">{ children }</div>
    </div>
  );
}

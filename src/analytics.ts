/**
 * Amplitude analytics — a thin, fail-safe wrapper around `@amplitude/unified`.
 *
 * Everything is wrapped in try/catch and gated behind `initAnalytics()` so a
 * missing key, a blocked network, or an ad-blocker can never break the
 * prototype: a failed call is swallowed (and logged in dev), the UI carries on.
 *
 * The API key comes from `VITE_AMPLITUDE_API_KEY` (set it in a `.env` file, see
 * `.env.example`); with no key set, analytics stays disabled and events are
 * logged to the console in dev so you can still see them fire.
 */
import { initAll, identify, track as amplitudeTrack, Identify } from '@amplitude/unified';

const API_KEY = import.meta.env.VITE_AMPLITUDE_API_KEY ?? '';

let ready = false;

/** Initialize Amplitude once, at app start. Safe to call more than once. */
export function initAnalytics(): void {
  if ( ready ) return;
  if ( ! API_KEY ) {
    if ( import.meta.env.DEV ) {
      console.info(
        '[analytics] disabled — set VITE_AMPLITUDE_API_KEY in a .env file to enable Amplitude.'
      );
    }
    return;
  }
  try {
    initAll( API_KEY );
    ready = true;
  } catch ( err ) {
    console.warn( '[analytics] init failed', err );
  }
}

/** Track an event with optional properties. */
export function track( event: string, props?: Record< string, unknown > ): void {
  if ( ! ready ) {
    if ( import.meta.env.DEV ) console.debug( '[analytics] (disabled) track', event, props ?? {} );
    return;
  }
  try {
    amplitudeTrack( event, props );
  } catch ( err ) {
    console.warn( '[analytics] track failed', event, err );
  }
}

/** Set user traits (identify). Values are applied via an Amplitude `Identify`. */
export function identifyUser( traits: Record< string, string | number | boolean > ): void {
  if ( ! ready ) {
    if ( import.meta.env.DEV ) console.debug( '[analytics] (disabled) identify', traits );
    return;
  }
  try {
    const id = new Identify();
    for ( const [ key, value ] of Object.entries( traits ) ) {
      id.set( key, value );
    }
    identify( id );
  } catch ( err ) {
    console.warn( '[analytics] identify failed', err );
  }
}

/**
 * URL-backed prototype state.
 *
 * Every switcher setting reads its initial value from the query string and
 * writes changes back (replaceState — no reloads), so any configuration is
 * shareable as a link, e.g.
 * `?i=i2&view=cards&cardsTitle=global&incentives=1&woo=0`.
 *
 * Each iteration owns its own query keys and hands App a flat `params` map;
 * App writes the active iteration's keys and strips the inactive one's, so the
 * URL only ever describes the iteration you're looking at.
 */

export const readParam = < T extends string >(
  key: string,
  valid: readonly T[],
  fallback: T
): T => {
  const v = new URLSearchParams( window.location.search ).get( key );
  return valid.includes( v as T ) ? ( v as T ) : fallback;
};

export const readBool = ( key: string, fallback: boolean ): boolean => {
  const v = new URLSearchParams( window.location.search ).get( key );
  if ( v === null ) return fallback;
  return v === '1' || v === 'true' || v === 'on';
};

export const boolParam = ( on: boolean ): string => ( on ? '1' : '0' );

/** Read a raw string param (no allow-list), falling back when absent. */
export const readRaw = ( key: string, fallback: string ): string =>
  new URLSearchParams( window.location.search ).get( key ) ?? fallback;

/** Write `params` into the query string and drop `stale` keys. */
export const syncParams = (
  params: Record< string, string >,
  stale: readonly string[] = []
) => {
  const next = new URLSearchParams( window.location.search );
  for ( const key of stale ) next.delete( key );
  for ( const [ key, value ] of Object.entries( params ) ) {
    next.set( key, value );
  }
  window.history.replaceState(
    null,
    '',
    `${ window.location.pathname }?${ next.toString() }`
  );
};

/** Build a `pathname?query` string from a param map, dropping empty values. */
export const buildUrl = ( params: Record< string, string | undefined > ): string => {
  const next = new URLSearchParams();
  for ( const [ key, value ] of Object.entries( params ) ) {
    if ( value !== undefined && value !== '' ) next.set( key, value );
  }
  const query = next.toString();
  return `${ window.location.pathname }${ query ? `?${ query }` : '' }`;
};

/** Push a new history entry describing `params` (back/forward navigable). */
export const pushUrl = ( params: Record< string, string | undefined > ) =>
  window.history.pushState( null, '', buildUrl( params ) );

/** Replace the current history entry with one describing `params`. */
export const replaceUrl = ( params: Record< string, string | undefined > ) =>
  window.history.replaceState( null, '', buildUrl( params ) );

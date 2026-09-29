import { useEffect, useState } from 'react';

/**
 * Returns false for `delay` ms after mount, then true — used to show a skeleton
 * loader briefly before a screen's real content (the "loading" feel shared by
 * the storefront and the wp-admin screens). Keyed by `key` so navigating back to
 * the same screen replays the skeleton.
 */
export function useReady( key: string, delay = 650 ): boolean {
  const [ ready, setReady ] = useState( false );
  useEffect( () => {
    setReady( false );
    const t = setTimeout( () => setReady( true ), delay );
    return () => clearTimeout( t );
  }, [ key, delay ] );
  return ready;
}

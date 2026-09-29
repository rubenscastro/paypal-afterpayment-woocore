/**
 * PayPal express payment method (EPM) buttons — the smart buttons shown on the
 * product, cart and checkout pages: PayPal (gold), Pay Later (gold), Venmo (blue).
 * `layout="row"` sits them side by side (product/checkout), `layout="stack"`
 * stacks them full-width (cart totals). Clicking any of them shows a brief
 * loading spinner (mirroring the real PayPal SDK handing off) before opening the
 * payment-flow modal via `onPay`.
 */
import { useEffect, useRef, useState } from 'react';

const BUTTONS = [
  { method: 'PayPal', variant: 'gold', src: '/logos/paypal/epm-paypal.svg', alt: 'PayPal', height: 22 },
  { method: 'Pay Later', variant: 'gold', src: '/logos/paypal/epm-paylater.svg', alt: 'PayPal Pay Later', height: 22 },
  { method: 'Venmo', variant: 'venmo', src: '/logos/paypal/epm-venmo.svg', alt: 'Venmo', height: 16 },
] as const;

export default function EpmButtons( {
  layout = 'row',
  onPay,
}: {
  layout?: 'row' | 'stack';
  onPay?: ( method: string ) => void;
} ) {
  const [ loadingMethod, setLoadingMethod ] = useState< string | null >( null );
  const timer = useRef< ReturnType< typeof setTimeout > >();

  useEffect( () => () => clearTimeout( timer.current ), [] );

  const click = ( method: string ) => {
    if ( loadingMethod ) return;
    setLoadingMethod( method );
    clearTimeout( timer.current );
    timer.current = setTimeout( () => {
      setLoadingMethod( null );
      onPay?.( method );
    }, 1000 );
  };

  return (
    <div className={ `epm epm--${ layout }` }>
      { BUTTONS.map( ( b ) => {
        const loading = loadingMethod === b.method;
        return (
          <button
            key={ b.method }
            type="button"
            className={ `epm-btn epm-btn--${ b.variant }` }
            aria-label={ b.alt }
            onClick={ () => click( b.method ) }
            disabled={ !! loadingMethod }
            aria-busy={ loading }
          >
            { loading
              ? <span className={ `epm-btn__spinner epm-btn__spinner--${ b.variant }` } aria-hidden />
              : <img src={ b.src } alt={ b.alt } height={ b.height } /> }
          </button>
        );
      } ) }
    </div>
  );
}

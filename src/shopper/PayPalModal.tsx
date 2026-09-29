/**
 * A neutral placeholder standing in for the PayPal hosted payment flow. Opened
 * when the shopper clicks any express button (or "Proceed to PayPal"); "Complete
 * purchase" swaps the placeholder for a spinner for 3s (simulating the payment
 * processing) before returning to the order-received page.
 * Deliberately unbranded — it just represents "the payment step happens here".
 */
import { useEffect, useRef, useState } from 'react';

export default function PayPalModal( {
  open,
  onClose,
  onComplete,
}: {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
} ) {
  const [ loading, setLoading ] = useState( false );
  const timer = useRef< ReturnType< typeof setTimeout > >();

  useEffect( () => {
    if ( ! open ) return;
    const onKey = ( e: KeyboardEvent ) => e.key === 'Escape' && onClose();
    document.addEventListener( 'keydown', onKey );
    return () => document.removeEventListener( 'keydown', onKey );
  }, [ open, onClose ] );

  /* Reset the spinner whenever the modal opens/closes, and never let a pending
     timer fire after it's gone. */
  useEffect( () => {
    if ( ! open ) {
      clearTimeout( timer.current );
      setLoading( false );
    }
  }, [ open ] );
  useEffect( () => () => clearTimeout( timer.current ), [] );

  if ( ! open ) return null;

  const complete = () => {
    setLoading( true );
    clearTimeout( timer.current );
    timer.current = setTimeout( () => onComplete(), 3000 );
  };

  return (
    <div className="ppm-backdrop" onClick={ loading ? undefined : onClose }>
      <div className="ppm" role="dialog" aria-modal="true" aria-label="PayPal payment flow" onClick={ ( e ) => e.stopPropagation() }>
        <div className="ppm-bar">
          { ! loading && <button type="button" className="ppm-close" aria-label="Close" onClick={ onClose }>×</button> }
        </div>
        <div className="ppm-body">
          { loading ? (
            <div className="ppm-loading">
              <span className="ppm-spinner" aria-label="Processing payment" />
            </div>
          ) : (
            <div className="ppm-placeholder">
              <span className="ppm-placeholder__tag" aria-hidden>Payment flow placeholder</span>
              <p className="ppm-text">
                The PayPal hosted checkout would appear here. Continue to simulate a
                completed payment.
              </p>
              <button type="button" className="ppm-complete" onClick={ complete }>Complete purchase</button>
            </div>
          ) }
        </div>
      </div>
    </div>
  );
}

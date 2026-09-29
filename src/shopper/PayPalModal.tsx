/**
 * A neutral placeholder standing in for the PayPal hosted payment flow. Opened
 * when the shopper clicks any express button (or "Proceed to PayPal"); "Complete
 * purchase" stands in for finishing payment and returns to the order-received page.
 * Deliberately unbranded — it just represents "the payment step happens here".
 */
import { useEffect } from 'react';

export default function PayPalModal( {
  open,
  onClose,
  onComplete,
}: {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
} ) {
  useEffect( () => {
    if ( ! open ) return;
    const onKey = ( e: KeyboardEvent ) => e.key === 'Escape' && onClose();
    document.addEventListener( 'keydown', onKey );
    return () => document.removeEventListener( 'keydown', onKey );
  }, [ open, onClose ] );

  if ( ! open ) return null;

  return (
    <div className="ppm-backdrop" onClick={ onClose }>
      <div className="ppm" role="dialog" aria-modal="true" aria-label="PayPal payment flow" onClick={ ( e ) => e.stopPropagation() }>
        <div className="ppm-bar">
          <button type="button" className="ppm-close" aria-label="Close" onClick={ onClose }>×</button>
        </div>
        <div className="ppm-body">
          <div className="ppm-placeholder">
            <span className="ppm-placeholder__tag" aria-hidden>Payment flow placeholder</span>
            <p className="ppm-text">
              The PayPal hosted checkout would appear here. Continue to simulate a
              completed payment.
            </p>
            <button type="button" className="ppm-complete" onClick={ onComplete }>Complete purchase</button>
          </div>
        </div>
      </div>
    </div>
  );
}

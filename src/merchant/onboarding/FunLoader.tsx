/**
 * The Woo full-screen loader shown between onboarding steps ("Woo! Let's get your
 * features ready") and while connecting: illustration, title, a determinate
 * progress bar that fills 0→100 over the loader's duration, and a #FunWooFact.
 * Calls `onDone` after `delay` ms so the flow advances on its own.
 */
import { useEffect, useRef } from 'react';

export default function FunLoader( {
  title,
  image = '/logos/woo/loader-developing.svg',
  delay = 2400,
  onDone,
}: {
  title: string;
  image?: string;
  delay?: number;
  onDone: () => void;
} ) {
  /* Hold onDone in a ref so the countdown depends only on `delay` — an unrelated
     re-render of the parent (which passes a fresh onDone arrow) must not restart
     the timer, or the loader could never advance. */
  const onDoneRef = useRef( onDone );
  onDoneRef.current = onDone;
  useEffect( () => {
    const t = setTimeout( () => onDoneRef.current(), delay );
    return () => clearTimeout( t );
  }, [ delay ] );

  return (
    <div className="ob ob--loader">
      <div className="ob-loader">
        <img className="ob-loader__illus" src={ image } alt="" aria-hidden />
        <h2 className="ob-loader__title">{ title }</h2>
        <div className="ob-loader__bar" aria-hidden>
          <span className="ob-loader__fill" style={ { animationDuration: `${ delay }ms` } } />
        </div>
        <p className="ob-loader__fact">
          <strong>#FunWooFact: </strong>Did you know that Woo was founded by two
          South Africans and a Norwegian? Here are three alternative ways to say
          "store" in those countries – Winkel, ivenkile, and butikk.
        </p>
      </div>
    </div>
  );
}

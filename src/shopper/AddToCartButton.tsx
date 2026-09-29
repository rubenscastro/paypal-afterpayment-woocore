/**
 * "Add to cart" button with a brief loading spinner before the item lands in the
 * cart — mirrors WooCommerce's ajax add-to-cart feedback. Keeps its width while
 * loading (the label stays in the layout, hidden, with the spinner over it).
 */
import { useEffect, useRef, useState } from 'react';

export default function AddToCartButton( {
  onAdd,
  className = 'sp-addcart',
}: {
  onAdd: () => void;
  className?: string;
} ) {
  const [ loading, setLoading ] = useState( false );
  const timer = useRef< ReturnType< typeof setTimeout > >();

  useEffect( () => () => clearTimeout( timer.current ), [] );

  const click = () => {
    if ( loading ) return;
    setLoading( true );
    clearTimeout( timer.current );
    timer.current = setTimeout( () => {
      setLoading( false );
      onAdd();
    }, 800 );
  };

  return (
    <button type="button" className={ className } onClick={ click } disabled={ loading } aria-busy={ loading }>
      <span className={ `sp-addcart__label${ loading ? ' is-hidden' : '' }` }>Add to cart</span>
      { loading && <span className="sp-addcart__spinner" aria-label="Adding to cart" /> }
    </button>
  );
}

/** Storefront header — "Raven Of Sacreds" wordmark + nav + cart. */
import { useEffect, useRef } from 'react';
import { productById, type ShopperScreen } from './flow';

const NAV: { label: string; screen?: ShopperScreen }[] = [
  { label: 'Shop', screen: 'shop' },
  { label: 'Checkout', screen: 'checkout' },
];

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="9" cy="20" r="1.4" fill="currentColor" />
      <circle cx="18" cy="20" r="1.4" fill="currentColor" />
      <path d="M2 3h2.5l2.2 12.2a1.5 1.5 0 0 0 1.5 1.2h9.3a1.5 1.5 0 0 0 1.5-1.2L21 7H6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ShopHeader( {
  active,
  cartCount,
  onNavigate,
  toast,
  onToastView,
  onToastDismiss,
}: {
  active: ShopperScreen;
  cartCount: number;
  onNavigate: ( s: ShopperScreen ) => void;
  /** Id of the just-added product — shows a popover under the cart icon. */
  toast?: string | null;
  onToastView?: () => void;
  onToastDismiss?: () => void;
} ) {
  const toastProduct = toast ? productById( toast ) : null;
  /* The popover stays open until a click lands outside the cart cluster. */
  const cartRef = useRef< HTMLSpanElement >( null );
  useEffect( () => {
    if ( ! toast ) return;
    const onDown = ( e: MouseEvent ) => {
      if ( ! cartRef.current?.contains( e.target as Node ) ) onToastDismiss?.();
    };
    document.addEventListener( 'mousedown', onDown );
    return () => document.removeEventListener( 'mousedown', onDown );
  }, [ toast, onToastDismiss ] );

  return (
    <header className="sh-header">
      <div className="sh-header__inner">
      <a className="sh-brand" onClick={ () => onNavigate( 'shop' ) }>Raven Of Sacreds</a>
      <nav className="sh-nav">
        { NAV.map( ( item ) => (
          <a
            key={ item.label }
            className={ `sh-nav__link${ item.screen === active ? ' is-active' : '' }` }
            onClick={ item.screen ? () => onNavigate( item.screen! ) : undefined }
          >
            { item.label }
          </a>
        ) ) }
        <span className="sh-cart-wrap" ref={ cartRef }>
          <button type="button" className="sh-cart" aria-label="Cart" onClick={ () => { onToastDismiss?.(); onNavigate( 'cart' ); } }>
            <CartIcon />
            { cartCount > 0 && <span className="sh-cart__badge">{ cartCount }</span> }
          </button>
          { toastProduct && (
            <div className="sh-cartpop" role="status">
              <span className="sh-cartpop__arrow" aria-hidden />
              <div className="sh-cartpop__row">
                <img className="sh-cartpop__thumb" src={ toastProduct.image } alt="" />
                <p className="sh-cartpop__text">“{ toastProduct.name }” has been added to your cart.</p>
              </div>
              <button type="button" className="sh-cartpop__link" onClick={ onToastView }>View cart</button>
            </div>
          ) }
        </span>
      </nav>
      </div>
    </header>
  );
}

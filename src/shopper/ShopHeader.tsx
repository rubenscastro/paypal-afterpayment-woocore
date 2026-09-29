/** Storefront header — "Raven Of Sacreds" wordmark + nav + avatar + cart. */
import type { ShopperScreen } from './flow';

const NAV: { label: string; screen?: ShopperScreen }[] = [
  { label: 'Cart', screen: 'cart' },
  { label: 'Checkout', screen: 'checkout' },
  { label: 'My account' },
  { label: 'Sample Page' },
  { label: 'Shop', screen: 'shop' },
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
}: {
  active: ShopperScreen;
  cartCount: number;
  onNavigate: ( s: ShopperScreen ) => void;
} ) {
  return (
    <header className="sh-header">
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
        <span className="sh-avatar" aria-hidden />
        <button type="button" className="sh-cart" aria-label="Cart" onClick={ () => onNavigate( 'cart' ) }>
          <CartIcon />
          { cartCount > 0 && <span className="sh-cart__badge">{ cartCount }</span> }
        </button>
      </nav>
    </header>
  );
}

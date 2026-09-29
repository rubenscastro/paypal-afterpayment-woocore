/** Shop — product grid. */
import { PRODUCTS, type Product, type ShopperScreen } from './flow';
import { useReady } from './useReady';
import { ShopSkeleton } from './Skeletons';
import AddToCartButton from './AddToCartButton';

function ProductCard( {
  product,
  onOpen,
  onAddToCart,
}: {
  product: Product;
  onOpen: () => void;
  onAddToCart: ( name: string ) => void;
} ) {
  const onSale = product.salePrice !== undefined;
  return (
    <div className="sp-card">
      <button type="button" className="sp-card__image" onClick={ onOpen }>
        <img src={ product.image } alt={ product.name } />
        { onSale && <span className="sp-sale">SALE</span> }
      </button>
      <button type="button" className="sp-card__name" onClick={ onOpen }>{ product.name }</button>
      <div className="sp-card__price">
        { onSale ? (
          <>
            <span className="sp-price-was">${ product.price.toFixed( 2 ) }</span>
            <span className="sp-price-now">${ product.salePrice!.toFixed( 2 ) }</span>
          </>
        ) : (
          <span>${ product.price.toFixed( 2 ) }</span>
        ) }
      </div>
      <AddToCartButton onAdd={ () => onAddToCart( product.id ) } />
    </div>
  );
}

export default function ShopPage( {
  onNavigate,
  onOpenProduct,
  onAddToCart,
}: {
  onNavigate: ( s: ShopperScreen ) => void;
  onOpenProduct: ( id: string ) => void;
  onAddToCart: ( name: string ) => void;
} ) {
  const ready = useReady( 'shop', 1400 );
  if ( ! ready ) return <ShopSkeleton />;

  return (
    <div className="sp">
      <nav className="sh-crumbs">
        <a onClick={ () => onNavigate( 'shop' ) }>Home</a> / <span>Shop</span>
      </nav>
      <h1 className="sh-page-title">Shop</h1>
      <div className="sp-toolbar">
        <span className="sp-count">Showing 1–16 of 17 results</span>
        <button type="button" className="sp-sort">Default sorting
          <svg className="sp-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <div className="sp-grid">
        { PRODUCTS.map( ( p ) => (
          <ProductCard key={ p.id } product={ p } onOpen={ () => onOpenProduct( p.id ) } onAddToCart={ onAddToCart } />
        ) ) }
      </div>
    </div>
  );
}

/** Product detail page. */
import { useState } from 'react';
import EpmButtons from './EpmButtons';
import AddToCartButton from './AddToCartButton';
import { productById, RELATED_PRODUCT, type CartLine, type ShopperScreen } from './flow';

export default function ProductPage( {
  productId,
  onNavigate,
  onOpenProduct,
  onPay,
  onAddToCart,
}: {
  productId: string;
  onNavigate: ( s: ShopperScreen ) => void;
  onOpenProduct: ( id: string ) => void;
  onPay: ( method: string, items?: CartLine[] ) => void;
  onAddToCart: ( name: string ) => void;
} ) {
  const product = productById( productId );
  const [ tab, setTab ] = useState< 'description' | 'reviews' >( 'description' );
  const [ qty, setQty ] = useState( 1 );
  const rel = RELATED_PRODUCT;

  return (
    <div className="pd">
      <nav className="sh-crumbs">
        <a onClick={ () => onNavigate( 'shop' ) }>Home</a> /{ ' ' }
        <a onClick={ () => onNavigate( 'shop' ) }>{ product.category }</a> / <span>{ product.name }</span>
      </nav>

      <div className="pd-main">
        <div className="pd-gallery">
          <img src={ product.image } alt={ product.name } />
          <span className="pd-zoom" aria-hidden>⚲</span>
        </div>
        <div className="pd-info">
          <h1 className="pd-title">{ product.name }</h1>
          <div className="pd-price">${ ( product.salePrice ?? product.price ).toFixed( 2 ) }</div>
          <p className="pd-summary">{ product.summary }</p>
          <div className="pd-buy">
            <div className="pd-qty">
              <button type="button" onClick={ () => setQty( ( q ) => Math.max( 1, q - 1 ) ) } aria-label="Decrease">−</button>
              <span>{ qty }</span>
              <button type="button" onClick={ () => setQty( ( q ) => q + 1 ) } aria-label="Increase">+</button>
            </div>
            <AddToCartButton onAdd={ () => onAddToCart( product.id ) } />
          </div>
          <EpmButtons onPay={ ( m ) => onPay( m, [ { id: product.id, qty } ] ) } />
          <dl className="pd-meta">
            <div><dt>SKU:</dt> <dd>{ product.sku }</dd></div>
            <div><dt>Category:</dt> <dd><a onClick={ () => onNavigate( 'shop' ) }>{ product.category }</a></dd></div>
          </dl>
        </div>
      </div>

      <div className="pd-tabs">
        <button type="button" className={ `pd-tab${ tab === 'description' ? ' is-active' : '' }` } onClick={ () => setTab( 'description' ) }>Description</button>
        <button type="button" className={ `pd-tab${ tab === 'reviews' ? ' is-active' : '' }` } onClick={ () => setTab( 'reviews' ) }>Reviews (0)</button>
      </div>
      <div className="pd-tabpanel">
        { tab === 'description' ? (
          <>
            <h2 className="pd-h2">Description</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sagittis orci ac odio dictum tincidunt. Donec ut metus leo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed luctus, dui eu sagittis sodales, nulla nibh sagittis augue, vel porttitor diam enim non metus. Vestibulum aliquam augue neque. Phasellus tincidunt odio eget ullamcorper efficitur. Cras placerat ut turpis pellentesque vulputate. Nam sed consequat tortor. Curabitur finibus sapien dolor. Ut eleifend tellus nec erat pulvinar dignissim. Nam non arcu purus. Vivamus et massa massa.</p>
          </>
        ) : (
          <p>There are no reviews yet.</p>
        ) }
      </div>

      <section className="pd-related">
        <h2 className="pd-h2">Related products</h2>
        <div className="pd-related__grid">
          <div className="sp-card">
            <button type="button" className="sp-card__image" onClick={ () => onOpenProduct( rel.id ) }>
              <img src={ rel.image } alt={ rel.name } />
              <span className="sp-sale">SALE</span>
            </button>
            <button type="button" className="sp-card__name" onClick={ () => onOpenProduct( rel.id ) }>{ rel.name }</button>
            <div className="sp-card__price">
              <span className="sp-price-was">${ rel.price.toFixed( 2 ) }</span>
              <span className="sp-price-now">${ rel.salePrice!.toFixed( 2 ) }</span>
            </div>
            <AddToCartButton onAdd={ () => onAddToCart( rel.id ) } />
          </div>
        </div>
      </section>
    </div>
  );
}

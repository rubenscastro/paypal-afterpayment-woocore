/** Cart page. */
import { useState } from 'react';
import EpmButtons from './EpmButtons';
import { productById, type ShopperScreen } from './flow';
import { useReady } from './useReady';
import { CartSkeleton } from './Skeletons';

export default function CartPage( {
  onNavigate,
  onPay,
}: {
  onNavigate: ( s: ShopperScreen ) => void;
  onPay: () => void;
} ) {
  const product = productById( 'album' );
  const [ qty, setQty ] = useState( 1 );
  const total = ( product.salePrice ?? product.price ) * qty;
  const ready = useReady( 'cart' );
  if ( ! ready ) return <CartSkeleton />;

  return (
    <div className="ct">
      <h1 className="sh-page-title">Cart</h1>
      <div className="ct-layout">
        <div className="ct-items">
          <div className="ct-head">
            <span>PRODUCT</span>
            <span>TOTAL</span>
          </div>
          <div className="ct-row">
            <img className="ct-thumb" src={ product.image } alt={ product.name } />
            <div className="ct-item">
              <a className="ct-item__name" onClick={ () => onNavigate( 'product' ) }>{ product.name }</a>
              <span className="ct-item__price">${ ( product.salePrice ?? product.price ).toFixed( 2 ) }</span>
              <span className="ct-item__summary">{ product.summary }</span>
              <div className="ct-item__controls">
                <div className="pd-qty">
                  <button type="button" onClick={ () => setQty( ( q ) => Math.max( 1, q - 1 ) ) } aria-label="Decrease">−</button>
                  <span>{ qty }</span>
                  <button type="button" onClick={ () => setQty( ( q ) => q + 1 ) } aria-label="Increase">+</button>
                </div>
                <button type="button" className="ct-trash" aria-label="Remove">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>
            <span className="ct-row__total">${ total.toFixed( 2 ) }</span>
          </div>
        </div>

        <aside className="ct-totals">
          <h2 className="ct-totals__title">CART TOTALS</h2>
          <button type="button" className="ct-coupons">Add coupons
            <svg className="sp-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="ct-estimate">
            <span>Estimated total</span>
            <strong>${ total.toFixed( 2 ) }</strong>
          </div>
          <EpmButtons layout="stack" onPay={ onPay } />
          <div className="ct-or"><span>OR</span></div>
          <button type="button" className="ct-proceed" onClick={ () => onNavigate( 'checkout' ) }>Proceed to Checkout</button>
        </aside>
      </div>
    </div>
  );
}

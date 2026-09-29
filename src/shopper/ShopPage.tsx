/** Shop — product grid. */
import { useEffect, useLayoutEffect, useRef, useState, type Ref } from 'react';
import { createPortal } from 'react-dom';
import { PRODUCTS, type Product, type ShopperScreen } from './flow';
import { useReady } from './useReady';
import { ShopSkeleton } from './Skeletons';
import AddToCartButton from './AddToCartButton';

function ProductCard( {
  product,
  onOpen,
  onAddToCart,
  cardRef,
}: {
  product: Product;
  onOpen: () => void;
  onAddToCart: ( name: string ) => void;
  cardRef?: Ref< HTMLDivElement >;
} ) {
  const onSale = product.salePrice !== undefined;
  return (
    <div className="sp-card" ref={ cardRef }>
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
  tipDismissed = false,
  onDismissTip,
}: {
  onNavigate: ( s: ShopperScreen ) => void;
  onOpenProduct: ( id: string ) => void;
  onAddToCart: ( name: string ) => void;
  /** First-visit "make a purchase to continue" coaching popover. */
  tipDismissed?: boolean;
  onDismissTip?: () => void;
} ) {
  const ready = useReady( 'shop', 1400 );

  /* Coaching popover, shown under one random product's Add-to-cart button (chosen
     once per visit) until it's dismissed or a purchase is made. Rendered in a
     portal with fixed positioning, matching the merchant Home tip. */
  const TIP_WIDTH = 240;
  const [ tipIndex ] = useState( () => Math.floor( Math.random() * PRODUCTS.length ) );
  const anchorRef = useRef< HTMLDivElement >( null );
  const [ tipPos, setTipPos ] = useState< { top: number; left: number; arrowLeft: number } | null >( null );
  const showTip = ! tipDismissed;
  useLayoutEffect( () => {
    if ( ! showTip || ! ready ) { setTipPos( null ); return; }
    const measure = () => {
      const btn = anchorRef.current?.querySelector( '.sp-addcart' );
      if ( ! btn ) return;
      const r = btn.getBoundingClientRect();
      const centerX = r.left + r.width / 2;
      const left = Math.max( 8, Math.min( centerX - TIP_WIDTH / 2, window.innerWidth - TIP_WIDTH - 8 ) );
      setTipPos( { top: r.bottom + 12, left, arrowLeft: centerX - left } );
    };
    measure();
    window.addEventListener( 'resize', measure );
    window.addEventListener( 'scroll', measure, true );
    return () => {
      window.removeEventListener( 'resize', measure );
      window.removeEventListener( 'scroll', measure, true );
    };
  }, [ showTip, ready ] );

  /* Any click anywhere dismisses the popover. */
  useEffect( () => {
    if ( ! showTip || ! ready ) return;
    const dismiss = () => onDismissTip?.();
    document.addEventListener( 'mousedown', dismiss );
    return () => document.removeEventListener( 'mousedown', dismiss );
  }, [ showTip, ready, onDismissTip ] );

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
        { PRODUCTS.map( ( p, i ) => (
          <ProductCard
            key={ p.id }
            product={ p }
            onOpen={ () => onOpenProduct( p.id ) }
            onAddToCart={ onAddToCart }
            cardRef={ i === tipIndex ? anchorRef : undefined }
          />
        ) ) }
      </div>

      { showTip && tipPos && createPortal(
        <div
          className="hm-tip hm-tip--below"
          role="status"
          style={ { top: tipPos.top, left: tipPos.left, width: TIP_WIDTH } }
        >
          <span className="hm-tip__arrow" aria-hidden style={ { left: tipPos.arrowLeft } } />
          <div className="hm-tip__body">
            <span className="hm-tip__title"><span aria-hidden>👉</span> Prototype control</span>
            <span className="hm-tip__text">Make a purchase to continue</span>
          </div>
          <button type="button" className="hm-tip__close" aria-label="Dismiss" onClick={ onDismissTip }>×</button>
        </div>,
        document.body
      ) }
    </div>
  );
}

/** Shimmer skeleton loaders shown briefly before each storefront screen. */

function Sk( { w, h, r, className }: { w?: string | number; h?: string | number; r?: number; className?: string } ) {
  return (
    <span
      className={ `sk${ className ? ' ' + className : '' }` }
      style={ { width: w, height: h, borderRadius: r } }
    />
  );
}

function CardSk() {
  return (
    <div className="sk-card">
      <Sk h={ 0 } className="sk-card__img" />
      <Sk w="60%" h={ 16 } r={ 3 } />
      <Sk w="35%" h={ 14 } r={ 3 } />
      <Sk w={ 120 } h={ 40 } r={ 2 } />
    </div>
  );
}

export function ShopSkeleton() {
  return (
    <div className="sp">
      <Sk w={ 90 } h={ 14 } r={ 3 } className="sk-mt-lg" />
      <Sk w={ 220 } h={ 48 } r={ 4 } className="sk-mt" />
      <div className="sp-toolbar">
        <Sk w={ 180 } h={ 16 } r={ 3 } />
        <Sk w={ 130 } h={ 32 } r={ 2 } />
      </div>
      <div className="sp-grid">
        { [ 0, 1, 2, 3 ].map( ( i ) => <CardSk key={ i } /> ) }
      </div>
    </div>
  );
}

export function CartSkeleton() {
  return (
    <div className="ct">
      <Sk w={ 160 } h={ 56 } r={ 4 } className="sk-mt-lg" />
      <div className="ct-layout sk-mt">
        <div className="ct-items">
          <Sk w="100%" h={ 40 } r={ 3 } />
          <div className="ct-row" style={ { borderBottom: 'none' } }>
            <Sk w={ 64 } h={ 64 } r={ 3 } />
            <div className="ct-item">
              <Sk w={ 120 } h={ 16 } r={ 3 } />
              <Sk w={ 60 } h={ 14 } r={ 3 } />
              <Sk w={ 200 } h={ 12 } r={ 3 } />
            </div>
            <Sk w={ 50 } h={ 16 } r={ 3 } />
          </div>
        </div>
        <div className="ct-totals">
          <Sk w={ 120 } h={ 18 } r={ 3 } />
          <Sk w="100%" h={ 48 } r={ 3 } className="sk-mt" />
          <Sk w="100%" h={ 45 } r={ 4 } className="sk-mt" />
          <Sk w="100%" h={ 45 } r={ 4 } className="sk-mt-sm" />
          <Sk w="100%" h={ 45 } r={ 4 } className="sk-mt-sm" />
          <Sk w="100%" h={ 48 } r={ 2 } className="sk-mt" />
        </div>
      </div>
    </div>
  );
}

export function CheckoutSkeleton() {
  return (
    <div className="co-body">
      <div className="co-main">
        <Sk w="100%" h={ 45 } r={ 4 } />
        <Sk w={ 200 } h={ 24 } r={ 3 } className="sk-mt-lg" />
        <Sk w="100%" h={ 54 } r={ 2 } className="sk-mt" />
        <Sk w={ 160 } h={ 24 } r={ 3 } className="sk-mt-lg" />
        <Sk w="100%" h={ 64 } r={ 2 } className="sk-mt" />
        <Sk w={ 180 } h={ 24 } r={ 3 } className="sk-mt-lg" />
        <Sk w="100%" h={ 54 } r={ 2 } className="sk-mt" />
        <div className="co-row-2 sk-mt-sm">
          <Sk w="100%" h={ 54 } r={ 2 } />
          <Sk w="100%" h={ 54 } r={ 2 } />
        </div>
        <Sk w="100%" h={ 54 } r={ 2 } className="sk-mt-sm" />
      </div>
      <div className="co-summary">
        <Sk w={ 140 } h={ 20 } r={ 3 } />
        <Sk w="100%" h={ 56 } r={ 3 } className="sk-mt" />
        <Sk w="100%" h={ 56 } r={ 3 } className="sk-mt-sm" />
        <Sk w="100%" h={ 80 } r={ 3 } className="sk-mt" />
      </div>
    </div>
  );
}

export function OrderReceivedSkeleton() {
  return (
    <div className="or">
      <Sk w={ 200 } h={ 14 } r={ 3 } className="sk-mt-lg" />
      <Sk w={ 320 } h={ 48 } r={ 4 } className="sk-mt" />
      <Sk w={ 280 } h={ 16 } r={ 3 } className="sk-mt-sm" />
      <Sk w="100%" h={ 320 } r={ 6 } className="sk-mt-lg sk-ticket" />
      <Sk w={ 200 } h={ 30 } r={ 3 } className="sk-mt-lg" />
      <Sk w="100%" h={ 260 } r={ 4 } className="sk-mt" />
    </div>
  );
}

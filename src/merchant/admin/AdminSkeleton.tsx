/**
 * wp-admin loading skeletons, shown briefly whenever you land on the Home
 * tasklist or the Payments settings screen. Matches WooCommerce's own
 * placeholder treatment: gray blocks (#f0f0f0) pulsing opacity via the
 * `hm-fade` keyframes (a port of WooCommerce's `loading-fade`), laid out to
 * mirror each page so the swap to real content doesn't jump.
 */

/** Home tasklist skeleton: title + progress + setup card (hero + 5 rows) + a card. */
export function HomeSkeleton() {
  return (
    <div className="hm">
      <header className="hm-subbar"><span className="hm-sk hm-sk--subtitle" /></header>
      <div className="hm-canvas">
        <div className="hm-col">
          <span className="hm-sk hm-sk--title" />
          <span className="hm-sk hm-sk--sub" />
          <span className="hm-sk hm-sk--progress" />

          <section className="hm-card">
            <div className="hm-sk-hero">
              <div className="hm-sk-hero__text">
                <span className="hm-sk hm-sk--h2" />
                <span className="hm-sk hm-sk--line" />
                <span className="hm-sk hm-sk--line" style={ { width: '78%' } } />
                <span className="hm-sk hm-sk--btn" />
              </div>
              <span className="hm-sk hm-sk--art" />
            </div>
            <ul className="hm-sk-rows">
              { [ 0, 1, 2, 3, 4 ].map( ( i ) => (
                <li key={ i } className="hm-sk-row">
                  <span className="hm-sk hm-sk--circle" />
                  <span className="hm-sk hm-sk--rowtext" style={ { width: `${ 60 - i * 6 }%` } } />
                </li>
              ) ) }
            </ul>
          </section>

          <section className="hm-card">
            <div className="hm-sk-cardhead"><span className="hm-sk hm-sk--h3" /></div>
            { [ 0, 1, 2 ].map( ( i ) => (
              <div key={ i } className="hm-sk-row">
                <span className="hm-sk hm-sk--circle" />
                <span className="hm-sk hm-sk--rowtext" style={ { width: `${ 55 - i * 8 }%` } } />
              </div>
            ) ) }
          </section>
        </div>
      </div>
    </div>
  );
}

/** PayPal Wallet management skeleton: sub-header + tabs + a couple of sections.
 *  Shown briefly when landing on the manage screen (e.g. after "Return to
 *  WooCommerce"), in place of a connecting animation. Reuses the .wm-* wrappers
 *  so paddings and the two-column section layout line up with the real page. */
export function WalletManageSkeleton() {
  return (
    <div className="wm">
      <header className="wm-subbar">
        <span className="hm-sk" style={ { width: 24, height: 24, borderRadius: 6 } } />
        <span className="hm-sk" style={ { width: 120, height: 20 } } />
        <span className="wm-subbar__spacer" />
        <span className="hm-sk hm-sk--action" />
      </header>
      <nav className="wm-tabs">
        { Array.from( { length: 4 } ).map( ( _v, i ) => (
          <span key={ i } className="hm-sk" style={ { width: 84 + ( i % 2 ) * 30, height: 16 } } />
        ) ) }
      </nav>
      <div className="wm-body">
        { [ 0, 1 ].map( ( i ) => (
          <div key={ i } className="wm-section">
            <div className="wm-section__aside">
              <span className="hm-sk" style={ { width: 150, height: 18, display: 'block', marginBottom: 12 } } />
              <span className="hm-sk hm-sk--line" style={ { display: 'block', marginBottom: 8 } } />
              <span className="hm-sk hm-sk--line" style={ { display: 'block', width: '70%' } } />
            </div>
            <div className="wm-section__content">
              <span className="hm-sk" style={ { display: 'block', width: '100%', height: 128, borderRadius: 6 } } />
            </div>
          </div>
        ) ) }
      </div>
    </div>
  );
}

/** Payments settings skeleton: page title + tabs + section title + provider rows. */
export function PaymentsSkeleton() {
  return (
    <div className="ps">
      <div className="ps-header">
        <span className="hm-sk hm-sk--title" style={ { margin: '0 0 18px' } } />
        <div className="ps-sk-tabs">
          { Array.from( { length: 6 } ).map( ( _v, i ) => (
            <span key={ i } className="hm-sk hm-sk--tab" style={ { width: `${ 56 + ( i % 3 ) * 22 }px` } } />
          ) ) }
        </div>
      </div>
      <div className="ps-body">
        <span className="hm-sk hm-sk--h3" style={ { margin: '0 0 20px' } } />
        { [ 0, 1, 2 ].map( ( i ) => (
          <div key={ i } className="ps-sk-row">
            <span className="hm-sk hm-sk--logo" />
            <div className="ps-sk-row__main">
              <span className="hm-sk hm-sk--rowtitle" />
              <span className="hm-sk hm-sk--line" style={ { width: '68%' } } />
            </div>
            <span className="hm-sk hm-sk--action" />
          </div>
        ) ) }
      </div>
    </div>
  );
}

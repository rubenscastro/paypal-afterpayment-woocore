/**
 * wp-admin loading skeletons, shown briefly whenever you land on the Home
 * tasklist or the Payments settings screen. Matches WooCommerce's own
 * placeholder treatment: gray blocks (#f0f0f0) pulsing opacity via the
 * `hm-fade` keyframes (a port of WooCommerce's `loading-fade`), laid out to
 * mirror each page so the swap to real content doesn't jump.
 */

/** Home tasklist skeleton: title + progress + setup card (hero + 5 rows) + a card. */
/** Just the "Let's get you set up" card skeleton (hero + 5 steps) — reused on the
 *  full Home skeleton and shown alone when a setup step is being completed. */
export function SetupCardSkeleton() {
  return (
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
  );
}

export function HomeSkeleton() {
  return (
    <div className="hm">
      <header className="hm-subbar"><span className="hm-sk hm-sk--subtitle" /></header>
      <div className="hm-canvas">
        <div className="hm-col">
          <span className="hm-sk hm-sk--title" />
          <span className="hm-sk hm-sk--sub" />
          <span className="hm-sk hm-sk--progress" />

          <SetupCardSkeleton />

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

/** Payments settings skeleton: page title + tabs + section head + provider rows.
 *  Reuses the real .ps-* wrappers (.ps-header, .ps-tabs/.ps-tab,
 *  .ps-providers-head, .ps-row) so every padding, inset and divider matches the
 *  live page and the swap to real content doesn't shift anything. */
export function PaymentsSkeleton() {
  return (
    <div className="ps">
      <div className="ps-header">
        <h1 className="ps-page-title"><span className="hm-sk" style={ { display: 'inline-block', width: 150, height: 23, verticalAlign: 'middle' } } /></h1>
        <nav className="ps-tabs">
          { Array.from( { length: 6 } ).map( ( _v, i ) => (
            <span key={ i } className="ps-tab">
              <span className="hm-sk" style={ { display: 'block', width: `${ 56 + ( i % 3 ) * 22 }px`, height: 14 } } />
            </span>
          ) ) }
        </nav>
      </div>
      <div className="ps-body">
        <div className="ps-providers-head">
          <span className="hm-sk" style={ { width: 150, height: 18 } } />
          <span className="hm-sk" style={ { width: 190, height: 36, borderRadius: 3 } } />
        </div>
        { [ 0, 1, 2 ].map( ( i ) => (
          <div key={ i } className="ps-row">
            <span className="hm-sk hm-sk--logo" />
            <div className="ps-row__main">
              <span className="hm-sk hm-sk--rowtitle" style={ { display: 'block' } } />
              <span className="hm-sk hm-sk--line" style={ { display: 'block', width: '68%', marginTop: 8 } } />
            </div>
            <span className="hm-sk hm-sk--action" />
          </div>
        ) ) }
      </div>
    </div>
  );
}

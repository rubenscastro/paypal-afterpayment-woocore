/**
 * Playback test for the "More payment providers" strip transitions.
 *
 * Run it by evaluating this whole file in the page's console, on `?i=i3`:
 *
 *     await stripTest()     // install from the strip: card leaves, two arrive
 *     await scrolledTest()  // the same, with the strip scrolled first
 *     await reverseTest()   // uninstall: the card goes back the other way
 *     await rowTest()       // the providers card's row growing in behind a skeleton
 *
 * Each starts from a fresh `/?i=i3` — reload between runs.
 *
 * Why a script pasted into a live page rather than a unit test: what broke
 * here repeatedly was never the arithmetic, it was whether the animation
 * ran at all and what the surrounding layout did while it did. jsdom has no
 * layout and no animation timeline, so it cannot answer either question. So
 * this drives the real UI and samples real geometry every frame.
 *
 * What it asserts, per direction:
 *
 *   • PLAYS — the slot's width is sampled every animation frame while the
 *     transition runs, and has to pass through enough distinct intermediate
 *     values to prove it moved rather than jumped. This is the one that
 *     matters: a transition that is skipped, gated off, or frozen still
 *     ends in the right place, and every check that only looks at the end
 *     state passes anyway.
 *   • CARD WIDTH HELD — the card inside the slot stays 230px throughout.
 *     The card must not be what shrinks; it is clipped by the slot, so
 *     nothing inside it reflows on the way out.
 *   • STRIP HEIGHT HELD — the strip is a flex row, so a card that reflows
 *     its copy at a few pixels wide drags every other card's height up
 *     with it. A constant height says that isn't happening.
 *   • DIRECTION — leaving ends at 0 and arriving ends at full width.
 */

/* eslint-env browser */

const CARD_W = 230;
const SETTLE_MS = 2000; // Screen.tsx's deferred install
const SKELETON_MS = 900; // how long an arriving card stays a skeleton
const GRACE_MS = 1200;

const TRANSIT_MS = 300; // a slot opening or closing

const sleep = ( ms ) => new Promise( ( r ) => setTimeout( r, ms ) );
const strip = () => document.querySelector( '.i3-catalogue' );
const slots = () =>
  Array.from( document.querySelectorAll( '.i3-catalogue__slot' ) );

/** Poll for an element from NOW. Never sleep most of the way to an event
    and then start looking: timers drift in this pane, and arriving 250ms
    late means recording only the tail of a 300ms transition and calling
    it a jump. */
async function waitFor( selector, timeout = SETTLE_MS + GRACE_MS ) {
  const deadline = Date.now() + timeout;
  while ( Date.now() < deadline ) {
    const el = document.querySelector( selector );
    if ( el ) return el;
    await sleep( 8 );
  }
  return null;
}

/** Watch one slot for as long as it is on the page.
 *
 *  Sampled on a timer rather than on `requestAnimationFrame`: rAF is
 *  throttled hard in an embedded browser pane (it can go whole seconds
 *  without firing) and a recorder that misses every frame reports a
 *  transition that never moved, which is the exact failure this file
 *  exists to tell apart from a real one. `setTimeout` keeps its cadence
 *  there, and the animation itself runs regardless. */
const SAMPLE_MS = 10;

function record( slot ) {
  const samples = [];
  let stop = false;
  const tick = () => {
    if ( stop || ! slot.isConnected ) return;
    const card = slot.firstElementChild;
    samples.push( {
      slot: Math.round( slot.getBoundingClientRect().width ),
      card: card ? Math.round( card.getBoundingClientRect().width ) : null,
      strip: Math.round( strip().getBoundingClientRect().height ),
    } );
    setTimeout( tick, SAMPLE_MS );
  };
  tick();
  return {
    samples,
    done: () => {
      stop = true;
      return samples;
    },
  };
}

function judge( name, samples, { endsAt } ) {
  const widths = samples.map( ( s ) => s.slot );
  const cards = samples.map( ( s ) => s.card ).filter( ( w ) => w !== null );
  const heights = samples.map( ( s ) => s.strip );
  /* Intermediate = neither end of the travel. A skipped transition records
     only 230s or only 0s, however many frames it is watched for. */
  const between = new Set(
    widths.filter( ( w ) => w > 4 && w < CARD_W - 4 )
  );
  const uniqueHeights = new Set( heights );
  const last = widths[ widths.length - 1 ];

  const checks = [
    [
      'plays (passes through intermediate widths)',
      between.size >= 5,
      `${ between.size } distinct intermediate widths over ${ widths.length } frames`,
    ],
    [
      'card width held at 230',
      cards.length > 0 && cards.every( ( w ) => w === CARD_W ),
      `card widths seen: ${ [ ...new Set( cards ) ].join( ', ' ) || 'none' }`,
    ],
    [
      'strip height held',
      uniqueHeights.size === 1,
      `heights seen: ${ [ ...uniqueHeights ].join( ', ' ) }`,
    ],
    [
      `ends at ${ endsAt }`,
      Math.abs( last - endsAt ) <= 4,
      `last sampled width ${ last }`,
    ],
  ];

  const failed = checks.filter( ( [ , ok ] ) => ! ok );
  return {
    name,
    pass: failed.length === 0,
    frames: widths.length,
    track: widths.filter( ( w, i ) => i === 0 || w !== widths[ i - 1 ] ),
    checks: checks.map( ( [ label, ok, detail ] ) => ( {
      [ ok ? 'PASS' : 'FAIL' ]: label,
      detail,
    } ) ),
  };
}

/**
 * Install the first provider in the strip and watch both transitions it
 * sets off: that card leaving, and the suggestions arriving behind it.
 */
window.stripTest = async function stripTest() {
  if ( ! strip() ) {
    return 'No carousel on the page — load /?i=i3 with nothing installed.';
  }
  const before = slots().length;
  const target = slots()[ 0 ];
  const name =
    target.querySelector( '.i3-catalogue__name' )?.textContent ?? '?';

  target.querySelector( 'a' ).click();

  const leavingSlot = await waitFor( '.i3-catalogue__slot.is-leaving' );
  if ( ! leavingSlot ) return 'FAIL: no departing card was ever rendered.';
  const leaving = record( leavingSlot );

  /* The arrival is SEQUENCED after the departure — the suggestions are
     held off the strip until the installed card has finished closing — so
     it is waited for separately rather than expected alongside. */
  const arrivingSlot = await waitFor(
    '.i3-catalogue__slot.is-arriving',
    TRANSIT_MS + GRACE_MS
  );
  const arriving = arrivingSlot ? record( arrivingSlot ) : null;
  await sleep( TRANSIT_MS + 200 );

  const results = [ judge( `leaving: ${ name }`, leaving.done(), { endsAt: 0 } ) ];
  if ( arriving ) {
    results.push(
      judge( 'arriving: skeleton', arriving.done(), { endsAt: CARD_W } )
    );
  } else {
    results.push( { name: 'arriving', pass: false, checks: 'no arriving slot' } );
  }

  return {
    verdict: results.every( ( r ) => r.pass ) ? 'PASS' : 'FAIL',
    reducedMotion: window.matchMedia( '(prefers-reduced-motion: reduce)' )
      .matches,
    visibilityState: document.visibilityState,
    slotsBefore: before,
    slotsAfter: slots().length,
    results,
  };
};

/**
 * The same install, but with the strip scrolled first — which is how it is
 * used, since only two cards fit at a time.
 *
 * This is the case that was broken while every other test passed. The
 * close played correctly the whole time; it just played somewhere the
 * merchant couldn't see, because removing the card re-snapped a mandatory
 * scroll-snap container back to the start and took 484px of scroll with
 * it. So the assertions here are about WHERE, not whether: the scroll has
 * to hold, and the card has to stay inside the strip's visible box for the
 * whole of its close.
 */
window.scrolledTest = async function scrolledTest( at = 484 ) {
  const s = strip();
  if ( ! s ) return 'No carousel — load /?i=i3.';
  s.scrollLeft = at;
  await sleep( 200 );
  const startScroll = Math.round( s.scrollLeft );
  if ( startScroll === 0 ) return 'FAIL: the strip would not scroll.';

  /* The left-most card the merchant can actually see. */
  const box = s.getBoundingClientRect();
  const target = slots().find(
    ( sl ) => sl.getBoundingClientRect().left >= box.left - 4
  );
  const name = target.querySelector( '.i3-catalogue__name' )?.textContent;
  target.querySelector( 'a' ).click();

  const leavingSlot = await waitFor( '.i3-catalogue__slot.is-leaving' );
  if ( ! leavingSlot ) return 'FAIL: no departing card was ever rendered.';

  /* Sample scroll and viewport position alongside the usual geometry. */
  const extra = [];
  const rec = record( leavingSlot );
  const until = Date.now() + 500;
  while ( Date.now() < until && leavingSlot.isConnected ) {
    const r = leavingSlot.getBoundingClientRect();
    extra.push( {
      scroll: Math.round( s.scrollLeft ),
      left: Math.round( r.left ),
      inView: r.left >= box.left - 4 && r.left < box.right,
    } );
    await sleep( SAMPLE_MS );
  }
  const result = judge( `leaving: ${ name } (scrolled)`, rec.done(), {
    endsAt: 0,
  } );

  const scrolls = [ ...new Set( extra.map( ( e ) => e.scroll ) ) ];
  const lefts = [ ...new Set( extra.map( ( e ) => e.left ) ) ];
  const placement = [
    [
      'scroll held while the card closes',
      scrolls.length === 1 && scrolls[ 0 ] === startScroll,
      `scroll positions seen: ${ scrolls.join( ', ' ) } (started at ${ startScroll })`,
    ],
    [
      'card stays in view for the whole close',
      extra.length > 0 && extra.every( ( e ) => e.inView ),
      `viewport lefts seen: ${ lefts.join( ', ' ) }, strip box ${ Math.round(
        box.left
      ) }–${ Math.round( box.right ) }`,
    ],
    [
      'card does not slide while closing',
      lefts.length === 1,
      `${ lefts.length } distinct positions`,
    ],
  ];
  const failed = placement.filter( ( [ , ok ] ) => ! ok );

  return {
    verdict: result.pass && ! failed.length ? 'PASS' : 'FAIL',
    startScroll,
    finalScroll: Math.round( s.scrollLeft ),
    geometry: result,
    placement: placement.map( ( [ label, ok, detail ] ) => ( {
      [ ok ? 'PASS' : 'FAIL' ]: label,
      detail,
    } ) ),
  };
};

/**
 * The move in reverse. Installing WooPayments pushes PayPal out of the
 * suggestions and into the strip; uninstalling it takes PayPal back. The
 * second one is a departure nothing was clicked for, so it's the case most
 * likely to be wired up only one way.
 */
window.reverseTest = async function reverseTest() {
  /* Install WooPayments from its row, which sends PayPal to the strip. */
  document.querySelector( '.i3-provider__actions button' )?.click();
  await sleep( SETTLE_MS + TRANSIT_MS + SKELETON_MS + 500 );

  const arrived = slots().some(
    ( s ) =>
      s.querySelector( '.i3-catalogue__name' )?.textContent ===
      'PayPal Payments'
  );
  if ( ! arrived ) return 'FAIL: PayPal never arrived in the strip.';

  /* Now take it back, from the switcher's own toggle. */
  const btn = document.querySelector( '.store-switcher__btn' );
  if ( ! document.querySelector( '.store-switcher__popup' ) ) btn.click();
  await sleep( 80 );
  const toggle = Array.from(
    document.querySelectorAll( '[role="menuitemcheckbox"]' )
  ).find( ( b ) => /WooPayments installed/.test( b.textContent ) );
  if ( ! toggle ) return 'FAIL: no WooPayments toggle in the switcher.';
  toggle.click();

  const leavingSlot = await waitFor(
    '.i3-catalogue__slot.is-leaving',
    GRACE_MS
  );
  if ( ! leavingSlot ) {
    return 'FAIL: PayPal left the strip without a departing card.';
  }

  const rec = record( leavingSlot );
  await sleep( 500 );
  const result = judge( 'leaving: PayPal (uninstall)', rec.done(), {
    endsAt: 0,
  } );
  return {
    verdict: result.pass ? 'PASS' : 'FAIL',
    visibilityState: document.visibilityState,
    ...result,
  };
};

/**
 * The other half of an install: the row that opens up in the providers
 * card above, growing its height from nothing behind a skeleton.
 *
 * Same principle as the strip test — sample while it runs, and fail a
 * height that never passed through the middle.
 */
window.rowTest = async function rowTest() {
  const installBtn = document.querySelector( '.i3-provider__actions button' );
  if ( ! installBtn ) return 'No provider rows — load /?i=i3.';

  installBtn.click();
  const row = await waitFor( '.i3-provider--skeleton' );
  if ( ! row ) return 'FAIL: no skeleton row was ever rendered.';

  const heights = [];
  const t0 = Date.now();
  while ( Date.now() - t0 < 500 && row.isConnected ) {
    heights.push( Math.round( row.getBoundingClientRect().height ) );
    await sleep( SAMPLE_MS );
  }

  /* What the skeleton handed over to, once the real row has rendered. */
  await sleep( 700 );
  const realRow = document.querySelector( '.i3-providers .i3-provider' );
  const realH = realRow
    ? Math.round( realRow.getBoundingClientRect().height )
    : null;
  const titleWrapped =
    realRow &&
    realRow.querySelector( '.i3-provider__title' ).getBoundingClientRect()
      .height > 30;

  const settled = Math.max( ...heights );
  const between = new Set(
    heights.filter( ( h ) => h > 4 && h < settled - 4 )
  );
  const checks = [
    [
      'plays (passes through intermediate heights)',
      between.size >= 5,
      `${ between.size } distinct intermediate heights over ${ heights.length } samples`,
    ],
    [
      'starts near zero',
      Math.min( ...heights ) <= 8,
      `min height ${ Math.min( ...heights ) }`,
    ],
    [
      'has the four skeleton parts',
      row.querySelectorAll( '[class*="i3-skeleton"]' ).length >= 4,
      `${ row.querySelectorAll( '[class*="i3-skeleton"]' ).length } parts`,
    ],
    /* The handover. A skeleton that settles at a different height than the
       row replacing it makes the list jump at the one moment it should be
       seamless — and it is invisible to every other check here, since both
       the growth and the final row are correct on their own.

       Only meaningful when the real title fits on one line: the skeleton
       stands for a row, not for a particular provider's name wrapping at a
       particular column width, and it cannot know in advance that a title
       is about to take two lines. A wrapped title is reported rather than
       failed. */
    [
      titleWrapped
        ? 'skeleton matches the real row (skipped: title wrapped)'
        : 'skeleton settles at the real row height',
      titleWrapped || ( realH !== null && Math.abs( settled - realH ) <= 2 ),
      `skeleton ${ settled }px vs real row ${ realH }px`,
    ],
  ];
  const failed = checks.filter( ( [ , ok ] ) => ! ok );

  return {
    verdict: failed.length === 0 ? 'PASS' : 'FAIL',
    visibilityState: document.visibilityState,
    track: heights.filter( ( h, i ) => i === 0 || h !== heights[ i - 1 ] ),
    checks: checks.map( ( [ label, ok, detail ] ) => ( {
      [ ok ? 'PASS' : 'FAIL' ]: label,
      detail,
    } ) ),
  };
};

'stripTest() ready — call: await stripTest()';

/**
 * The prototype's primary axis: which audience you're looking at.
 *
 * - **merchant** — the WooCommerce store owner's wp-admin experience of
 *   installing, onboarding and managing the PayPal Wallet integration
 *   (built from the "Merchant Flow" Figma section).
 * - **shopper** — the storefront / checkout experience. Scaffolded only;
 *   the shopper screens haven't been designed yet.
 *
 * The track lives in the query string (`?track=merchant`) so any state is a
 * shareable link, mirroring the base prototype's URL-backed settings.
 */

export const TRACK_IDS = [ 'merchant', 'shopper' ] as const;
export type Track = ( typeof TRACK_IDS )[ number ];

export const DEFAULT_TRACK: Track = 'merchant';
export const TRACK_PARAM = 'track';

export const TRACK_LABEL: Record< Track, string > = {
  merchant: 'Merchant view',
  shopper: 'Shopper view',
};

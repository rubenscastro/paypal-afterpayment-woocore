/**
 * A prominent bottom snackbar used to nudge the user across tracks:
 * - in the merchant view once products are set up → "Go to Shopper view"
 * - on the shopper Order received screen → "Back to WooCommerce"
 * The CTA switches tracks; the × dismisses it for the session.
 */
export default function Snackbar( {
  icon,
  title,
  desc,
  cta,
  onGo,
  onDismiss,
}: {
  icon?: string;
  title: string;
  desc?: string;
  cta: string;
  onGo: () => void;
  onDismiss: () => void;
} ) {
  return (
    <div className="snackbar" role="status">
      <div className="snackbar__inner">
        { icon && <span className="snackbar__icon" aria-hidden>{ icon }</span> }
        <div className="snackbar__text">
          <strong className="snackbar__title">{ title }</strong>
          { desc && <span className="snackbar__desc">{ desc }</span> }
        </div>
        <button type="button" className="snackbar__cta" onClick={ onGo }>{ cta }</button>
      </div>
      <button type="button" className="snackbar__close" onClick={ onDismiss } aria-label="Dismiss">×</button>
    </div>
  );
}

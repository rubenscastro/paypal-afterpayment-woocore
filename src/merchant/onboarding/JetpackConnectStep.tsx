/**
 * Core profiler — "Connect your account". Shown right after the features loader:
 * the store owner links their site to a WordPress.com account so Jetpack and the
 * chosen extensions can work. Woo icon top-left, no centred wordmark.
 */
export default function JetpackConnectStep( {
  onConnect,
  onSwitchUser,
}: {
  onConnect: () => void;
  onSwitchUser: () => void;
} ) {
  return (
    <div className="ob jc">
      <div className="jc-brand" aria-hidden>
        <img src="/logos/woo/woo-icon.svg" width={ 32 } height={ 32 } alt="" />
      </div>

      <div className="jc-body">
        <h1 className="jc-title">Connect your account</h1>
        <p className="jc-lede">
          To access all of the features and functionality of the extensions you've
          chosen, you'll first need to connect <strong>coolclothes.com</strong> to a
          WordPress.com account.
        </p>

        <div className="jc-card">
          <img className="jc-avatar" src="/logos/woo/avatar-jenna.svg" width={ 88 } height={ 88 } alt="" aria-hidden />
          <span className="jc-name">Jenna Wallace</span>
          <span className="jc-email">jenna.wallace84@gmail.com</span>
        </div>

        <p className="jc-terms">
          By clicking Connect to WordPress.com, you agree to our{ ' ' }
          <a href="#" onClick={ ( e ) => e.preventDefault() }>Terms of Service</a> and to{ ' ' }
          <a href="#" onClick={ ( e ) => e.preventDefault() }>sync your site's data</a> with us.
        </p>

        <button type="button" className="jc-connect" onClick={ onConnect }>Connect</button>
        <button type="button" className="jc-switch" onClick={ onSwitchUser }>Sign in as a different user</button>
      </div>
    </div>
  );
}

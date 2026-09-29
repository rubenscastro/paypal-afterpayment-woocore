import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../node_modules/@wordpress/theme/prebuilt/css/design-tokens.css';
import '@wordpress/components/build-style/style.css';
/* Shared chrome (topbar, sidebar, switcher) first, then each track's own
   styles — order matters, later files win on equal specificity. */
import './styles.css';
import './brand.css';
import './merchant/merchant.css';
import './shopper/shopper.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

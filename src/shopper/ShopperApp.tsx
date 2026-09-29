/**
 * The shopper track — the "Raven Of Sacreds" storefront. Shop, Product, Cart and
 * Order received share the storefront header/footer; Checkout uses its own minimal
 * header. Clicking any PayPal express button (or "Proceed to PayPal") opens the
 * PayPal payment-flow modal; completing it lands on Order received and arms the
 * merchant's pending-payment notice (onPurchase). Adding to cart bumps the header
 * badge and shows a toast. State is lifted to App so the switcher can jump around.
 */
import { useEffect, useRef, useState } from 'react';
import ShopHeader from './ShopHeader';
import ShopFooter from './ShopFooter';
import ShopPage from './ShopPage';
import ProductPage from './ProductPage';
import CartPage from './CartPage';
import CheckoutPage from './CheckoutPage';
import OrderReceivedPage from './OrderReceivedPage';
import PayPalModal from './PayPalModal';
import type { ShopperScreen, ShopperState } from './flow';

export default function ShopperApp( {
  state,
  setState,
  onPurchase,
}: {
  state: ShopperState;
  setState: ( updater: ( s: ShopperState ) => ShopperState ) => void;
  /** Called when the shopper completes checkout — arms the merchant's pending
   *  payment notice. */
  onPurchase: () => void;
} ) {
  const [ payOpen, setPayOpen ] = useState( false );
  const [ toast, setToast ] = useState< string | null >( null );
  const toastTimer = useRef< ReturnType< typeof setTimeout > >();

  useEffect( () => () => clearTimeout( toastTimer.current ), [] );
  /* Jump back to the top on every screen (or product) change, like a real
     page navigation. */
  useEffect( () => { window.scrollTo( 0, 0 ); }, [ state.screen, state.product ] );

  const go = ( screen: ShopperScreen ) => setState( ( s ) => ( { ...s, screen } ) );
  const openProduct = ( product: string ) => setState( ( s ) => ( { ...s, product, screen: 'product' } ) );
  const onPay = () => setPayOpen( true );
  const completePurchase = () => {
    setPayOpen( false );
    onPurchase();
    go( 'order-received' );
  };
  const addToCart = ( name: string ) => {
    setState( ( s ) => ( { ...s, cartCount: s.cartCount + 1 } ) );
    setToast( name );
    clearTimeout( toastTimer.current );
    toastTimer.current = setTimeout( () => setToast( null ), 3200 );
  };

  const toastEl = toast && (
    <div className="sh-toast" role="status">
      <span className="sh-toast__check" aria-hidden>✓</span>
      <span className="sh-toast__text">“{ toast }” has been added to your cart.</span>
      <button type="button" className="sh-toast__link" onClick={ () => { setToast( null ); go( 'cart' ); } }>View cart</button>
    </div>
  );

  const modal = (
    <PayPalModal open={ payOpen } onClose={ () => setPayOpen( false ) } onComplete={ completePurchase } />
  );

  if ( state.screen === 'checkout' ) {
    return (
      <div className="sh">
        <CheckoutPage onPay={ onPay } cartCount={ state.cartCount } />
        { modal }
        { toastEl }
      </div>
    );
  }

  return (
    <div className="sh">
      <ShopHeader active={ state.screen } cartCount={ state.cartCount } onNavigate={ go } />
      <main className="sh-main">
        { state.screen === 'shop' && <ShopPage onNavigate={ go } onOpenProduct={ openProduct } onAddToCart={ addToCart } /> }
        { state.screen === 'product' && (
          <ProductPage productId={ state.product } onNavigate={ go } onOpenProduct={ openProduct } onPay={ onPay } onAddToCart={ addToCart } />
        ) }
        { state.screen === 'cart' && <CartPage onNavigate={ go } onPay={ onPay } /> }
        { state.screen === 'order-received' && <OrderReceivedPage onNavigate={ go } /> }
      </main>
      <ShopFooter />
      { modal }
      { toastEl }
    </div>
  );
}

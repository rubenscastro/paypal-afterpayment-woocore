/**
 * The shopper track — the "Raven Of Sacreds" storefront. Shop, Product, Cart and
 * Order received share the storefront header/footer; Checkout uses its own minimal
 * header. Clicking any PayPal express button (or "Proceed to PayPal") opens the
 * PayPal payment-flow modal; completing it lands on Order received and arms the
 * merchant's pending-payment notice (onPurchase). Adding to cart bumps the header
 * badge and shows a toast. State is lifted to App so the switcher can jump around.
 */
import { useEffect, useState } from 'react';
import ShopHeader from './ShopHeader';
import ShopFooter from './ShopFooter';
import ShopPage from './ShopPage';
import ProductPage from './ProductPage';
import CartPage from './CartPage';
import CheckoutPage from './CheckoutPage';
import OrderReceivedPage from './OrderReceivedPage';
import PayPalModal from './PayPalModal';
import { cartItemCount, orderTotal, productById, type CartLine, type ShopperScreen, type ShopperState } from './flow';
import { track } from '../analytics';

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
  const [ payMethod, setPayMethod ] = useState( 'PayPal' );
  /* Items being purchased — the cart for cart/checkout, or the single product for
     a product-page express button (which pays without adding to the cart). */
  const [ orderItems, setOrderItems ] = useState< CartLine[] >( [] );
  const [ toast, setToast ] = useState< string | null >( null );

  /* Jump back to the top on every screen (or product) change, like a real
     page navigation. */
  useEffect( () => { window.scrollTo( 0, 0 ); }, [ state.screen, state.product ] );

  const cartCount = cartItemCount( state.cart );
  const go = ( screen: ShopperScreen ) => setState( ( s ) => ( { ...s, screen } ) );
  const openProduct = ( product: string ) => setState( ( s ) => ( { ...s, product, screen: 'product' } ) );
  const onPay = ( method: string, items?: CartLine[] ) => {
    setPayMethod( method );
    setOrderItems( items && items.length ? items : state.cart );
    setPayOpen( true );
  };
  const completePurchase = () => {
    setPayOpen( false );
    /* The event the whole prototype exists to demonstrate: a shopper paying with
       a PayPal method. Amount matches the Order received total (subtotal + tax). */
    track( 'Payment Completed', {
      payment_provider: payMethod,
      amount: Number( orderTotal( orderItems ).toFixed( 2 ) ),
      currency: 'USD',
      order_id: 'order_233',
    } );
    onPurchase();
    go( 'order-received' );
  };
  /* Add a product (by id) to the cart, or bump its quantity, and pop the
     added-to-cart popover under the cart icon. */
  const addToCart = ( id: string ) => {
    setState( ( s ) => {
      const line = s.cart.find( ( l ) => l.id === id );
      const cart = line
        ? s.cart.map( ( l ) => ( l.id === id ? { ...l, qty: l.qty + 1 } : l ) )
        : [ ...s.cart, { id, qty: 1 } ];
      return { ...s, cart };
    } );
    const p = productById( id );
    track( 'Product Added to Cart', {
      product_id: p.id,
      product_name: p.name,
      price: p.salePrice ?? p.price,
    } );
    setToast( id );
  };
  const setLineQty = ( id: string, qty: number ) =>
    setState( ( s ) => ( {
      ...s,
      cart: qty <= 0 ? s.cart.filter( ( l ) => l.id !== id ) : s.cart.map( ( l ) => ( l.id === id ? { ...l, qty } : l ) ),
    } ) );
  const removeLine = ( id: string ) =>
    setState( ( s ) => ( { ...s, cart: s.cart.filter( ( l ) => l.id !== id ) } ) );

  const modal = (
    <PayPalModal open={ payOpen } onClose={ () => setPayOpen( false ) } onComplete={ completePurchase } />
  );

  return (
    <div className="sh">
      <ShopHeader
        active={ state.screen }
        cartCount={ cartCount }
        onNavigate={ go }
        toast={ toast }
        onToastView={ () => { setToast( null ); go( 'cart' ); } }
        onToastDismiss={ () => setToast( null ) }
      />
      { state.screen === 'checkout' ? (
        /* Checkout keeps the storefront chrome (header + footer) but brings its
           own two-column body rather than the padded .sh-main container. */
        <CheckoutPage onPay={ onPay } cart={ state.cart } />
      ) : (
        <main className="sh-main">
          { state.screen === 'shop' && <ShopPage onNavigate={ go } onOpenProduct={ openProduct } onAddToCart={ addToCart } /> }
          { state.screen === 'product' && (
            <ProductPage productId={ state.product } onNavigate={ go } onOpenProduct={ openProduct } onPay={ onPay } onAddToCart={ addToCart } />
          ) }
          { state.screen === 'cart' && (
            <CartPage cart={ state.cart } onNavigate={ go } onPay={ onPay } onQty={ setLineQty } onRemove={ removeLine } />
          ) }
          { state.screen === 'order-received' && <OrderReceivedPage cart={ orderItems } payMethod={ payMethod } onNavigate={ go } /> }
        </main>
      ) }
      <ShopFooter />
      { modal }
    </div>
  );
}

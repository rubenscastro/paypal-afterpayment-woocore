/**
 * The shopper track's model: a dummy WooCommerce storefront ("Raven Of Sacreds")
 * built from the Figma "ecomm" section. Four screens linked into a click-through
 * shopping flow, with the PayPal express buttons throughout.
 */

export const SHOPPER_SCREENS = [ 'shop', 'product', 'cart', 'checkout', 'order-received' ] as const;
export type ShopperScreen = ( typeof SHOPPER_SCREENS )[ number ];

export const SHOPPER_SCREEN_LABEL: Record< ShopperScreen, string > = {
  shop: 'Shop · Product grid',
  product: 'Product detail',
  cart: 'Cart',
  checkout: 'Checkout',
  'order-received': 'Order received',
};

/** A cart line: which product, and how many. */
export interface CartLine {
  id: string;
  qty: number;
}

export interface ShopperState {
  screen: ShopperScreen;
  /** Which product the detail page shows. */
  product: string;
  /** The actual items in the cart (drives the badge, cart page and summary). */
  cart: CartLine[];
}

export const INITIAL_SHOPPER_STATE: ShopperState = {
  screen: 'shop',
  product: 'album',
  cart: [],
};

/** Total item count across the cart (sum of quantities). */
export const cartItemCount = ( cart: CartLine[] ): number =>
  cart.reduce( ( n, line ) => n + line.qty, 0 );

/** The tax rate applied at checkout (matches Checkout / Order received). */
export const TAX_RATE = 0.06;

export interface Product {
  id: string;
  name: string;
  price: number;
  /** Sale price, when on sale. */
  salePrice?: number;
  image: string;
  sku: string;
  category: string;
  summary: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 'album',
    name: 'Album',
    price: 15,
    image: '/shop/album.png',
    sku: 'woo-album',
    category: 'Music',
    summary: 'This is a simple, virtual product.',
  },
  {
    id: 'beanie',
    name: 'Beanie',
    price: 20,
    salePrice: 18,
    image: '/shop/beanie.png',
    sku: 'woo-beanie',
    category: 'Accessories',
    summary: 'This is a simple product.',
  },
  {
    id: 'beanie-logo',
    name: 'Beanie with Logo',
    price: 20,
    salePrice: 18,
    image: '/shop/beanie-logo.png',
    sku: 'Woo-beanie-logo',
    category: 'Accessories',
    summary: 'This is a simple product.',
  },
  {
    id: 'single',
    name: 'Single',
    price: 3,
    salePrice: 2,
    image: '/shop/single.png',
    sku: 'woo-single',
    category: 'Music',
    summary: 'This is a simple, virtual product.',
  },
];

export const RELATED_PRODUCT: Product = {
  id: 'single',
  name: 'Single',
  price: 3,
  salePrice: 2,
  image: '/shop/single.png',
  sku: 'woo-single',
  category: 'Music',
  summary: 'This is a simple, virtual product.',
};

export const productById = ( id: string ): Product =>
  [ ...PRODUCTS, RELATED_PRODUCT ].find( ( p ) => p.id === id ) ?? PRODUCTS[ 0 ];

/** Order total (subtotal at effective price + tax), matching Checkout / Order received. */
export const orderTotal = ( items: CartLine[] ): number => {
  const subtotal = items.reduce( ( sum, line ) => {
    const p = productById( line.id );
    return sum + ( p.salePrice ?? p.price ) * line.qty;
  }, 0 );
  return subtotal + subtotal * TAX_RATE;
};

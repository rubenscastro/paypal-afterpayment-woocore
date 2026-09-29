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

export interface ShopperState {
  screen: ShopperScreen;
  /** Which product the detail page shows. */
  product: string;
  /** Items in the cart — drives the header cart badge. */
  cartCount: number;
}

export const INITIAL_SHOPPER_STATE: ShopperState = {
  screen: 'shop',
  product: 'album',
  cartCount: 0,
};

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

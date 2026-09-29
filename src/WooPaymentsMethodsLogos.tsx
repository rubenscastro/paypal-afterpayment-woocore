/**
 * The row of supported payment-method brand marks shown under the WooPayments
 * provider, ending in a "+N" chip that opens a popover with the overflow.
 *
 * Ported from WooCommerce's `@woocommerce/onboarding`
 * `WooPaymentsMethodsLogos` component (same markup, logic and assets), adapted
 * to this prototype: the SVGs live under `/logos/methods/`, and it uses the
 * `Popover` from `@wordpress/components` on click (Esc / focus-out to close).
 */
import { useEffect, useRef, useState } from 'react';
import { Popover } from '@wordpress/components';

interface PaymentMethod {
  name: string;
  /** URL of the logo asset. */
  src: string;
  /** A backdrop painted on the element for marks that aren't transparent (the
   *  logo is letterboxed inside a fixed <img>, so the backdrop lives on the
   *  element rather than inside the asset). */
  background?: string;
}

const L = ( f: string ) => `/logos/methods/${ f }`;

const PAYMENT_METHODS: PaymentMethod[] = [
  { name: 'visa', src: L( 'visa.svg' ) },
  { name: 'mastercard', src: L( 'mastercard.svg' ) },
  { name: 'amex', src: L( 'amex.svg' ), background: '#006FCF' },
  { name: 'discover', src: L( 'discover.svg' ) },
  { name: 'woopay', src: L( 'woopay.svg' ), background: '#873EFF' },
  { name: 'applepay', src: L( 'applepay.svg' ) },
  { name: 'googlepay', src: L( 'googlepay.svg' ) },
  { name: 'afterpay', src: L( 'afterpay.svg' ), background: '#B2FCE4' },
  { name: 'affirm', src: L( 'affirm.svg' ) },
  { name: 'klarna', src: L( 'klarna.svg' ), background: '#FFB3C7' },
  {
    name: 'cartebancaire',
    src: L( 'cb.svg' ),
    background:
      'linear-gradient(30deg, #2E2E79 0%, #2581C4 25%, #E6D6DB 50%, #E3756A 75%, #C90C0F 100%)',
  },
  { name: 'unionpay', src: L( 'unionpay.svg' ) },
  { name: 'diners', src: L( 'diners.svg' ) },
  { name: 'eftpos', src: L( 'eftpos.svg' ), background: 'rgba(31, 0, 56, 1)' },
  { name: 'jcb', src: L( 'jcb.svg' ), background: 'rgba(14, 76, 150, 1)' },
  { name: 'bancontact', src: L( 'bancontact.svg' ) },
  { name: 'becs', src: L( 'becs.svg' ) },
  { name: 'eps', src: L( 'eps.svg' ) },
  { name: 'ideal', src: L( 'ideal.svg' ) },
  { name: 'przelewy24', src: L( 'przelewy24.svg' ) },
  { name: 'grabpay', src: L( 'grabpay.svg' ) },
];

const renderLogo = ( pm: PaymentMethod ) => (
  <img
    key={ pm.name }
    src={ pm.src }
    alt=""
    width={ pm.background ? 40 : 38 }
    height={ pm.background ? 26 : 24 }
    className={ pm.background ? 'has-background' : undefined }
    style={ pm.background ? { background: pm.background } : undefined }
    loading="lazy"
  />
);

export default function WooPaymentsMethodsLogos( {
  isWooPayEligible = true,
  maxElements = 10,
  tabletWidthBreakpoint = 1080,
  maxElementsTablet = 7,
  mobileWidthBreakpoint = 768,
  maxElementsMobile = 5,
  totalPaymentMethods = 21,
}: {
  isWooPayEligible?: boolean;
  maxElements?: number;
  tabletWidthBreakpoint?: number;
  maxElementsTablet?: number;
  mobileWidthBreakpoint?: number;
  maxElementsMobile?: number;
  totalPaymentMethods?: number;
} ) {
  const [ maxShownElements, setMaxShownElements ] = useState( maxElements );
  const [ isPopoverVisible, setPopoverVisible ] = useState( false );
  const buttonRef = useRef< HTMLDivElement >( null );

  useEffect( () => {
    const updateMaxElements = () => {
      if ( window.innerWidth <= mobileWidthBreakpoint ) {
        setMaxShownElements( maxElementsMobile );
      } else if ( window.innerWidth <= tabletWidthBreakpoint ) {
        setMaxShownElements( maxElementsTablet );
      } else {
        setMaxShownElements( maxElements );
      }
    };
    updateMaxElements();
    window.addEventListener( 'resize', updateMaxElements );
    return () => window.removeEventListener( 'resize', updateMaxElements );
  }, [
    maxElements,
    maxElementsMobile,
    maxElementsTablet,
    tabletWidthBreakpoint,
    mobileWidthBreakpoint,
  ] );

  const handleClick = ( event: React.MouseEvent | React.KeyboardEvent ) => {
    const parentDiv = ( event.target as HTMLElement ).closest(
      '.woocommerce-woopayments-payment-methods-logos-count'
    );
    if ( buttonRef.current && parentDiv !== buttonRef.current ) return;
    setPopoverVisible( ( prev ) => ! prev );
  };

  const handleKeyDown = ( event: React.KeyboardEvent ) => {
    if ( event.key === 'Escape' && isPopoverVisible ) {
      event.stopPropagation();
      setPopoverVisible( false );
      buttonRef.current?.focus();
    } else if ( event.key === 'Enter' || event.key === ' ' ) {
      event.preventDefault();
      handleClick( event );
    }
  };

  // Reduce the total by one when the store isn't WooPay-eligible.
  const maxSupportedPaymentMethods = isWooPayEligible
    ? totalPaymentMethods
    : totalPaymentMethods - 1;
  const getMaxShownElements = ( n: number ) =>
    isWooPayEligible ? n : n + 1;

  const isEligible = ( pm: PaymentMethod ) =>
    isWooPayEligible || pm.name !== 'woopay';
  const visible = PAYMENT_METHODS.slice(
    0,
    getMaxShownElements( maxShownElements )
  ).filter( isEligible );
  const hidden = PAYMENT_METHODS.slice(
    getMaxShownElements( maxShownElements )
  ).filter( isEligible );

  return (
    <div className="woocommerce-woopayments-payment-methods-logos">
      { visible.map( renderLogo ) }
      { maxShownElements < maxSupportedPaymentMethods && (
        <div
          className="woocommerce-woopayments-payment-methods-logos-count"
          role="button"
          tabIndex={ 0 }
          ref={ buttonRef }
          onClick={ handleClick }
          onKeyDown={ handleKeyDown }
        >
          +{ maxSupportedPaymentMethods - maxShownElements }
          { isPopoverVisible && (
            <Popover
              className="woocommerce-woopayments-payment-methods-logos-popover"
              placement="top-start"
              offset={ 4 }
              variant="unstyled"
              focusOnMount
              noArrow
              shift
              onFocusOutside={ () => setPopoverVisible( false ) }
              onKeyDown={ handleKeyDown }
            >
              <div className="woocommerce-woopayments-payment-methods-logos">
                { hidden.map( renderLogo ) }
              </div>
            </Popover>
          ) }
        </div>
      ) }
    </div>
  );
}

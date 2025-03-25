import {useEffect, useState, useMemo, useRef} from 'react';
import {useReturnsShopNow} from '@aftership/shop-now/react';

export function AfterShipReturnBannerWithCart({deferredCart}) {
  const [cart, setCart] = useState(deferredCart);
  const isFirstRender = useRef(true);
  const {isFromEFA, shopContext, initCart, updateCart, initTranslation} =
    useReturnsShopNow({platform: 'shopify'});
  const {isMounted} = shopContext;

  useEffect(() => {
    if (deferredCart) {
      setCart(deferredCart);
    }
  }, [deferredCart]);

  useEffect(() => {
    initTranslation?.();
  }, [initTranslation]);

  const lineItems = useMemo(() => {
    return (
      cart?.lines?.nodes.map((item) => {
        const external_product_id = item.id.split('/').pop() || '';
        const external_variant_id = item.merchandise.id.split('/').pop() || '';
        return {
          // mock data
          external_product_id: '9950738514253',
          // mock data
          external_variant_id: '50998431547725',
          quantity: item.quantity,
        };
      }) || []
    );
  }, [cart]);

  // !!!!! HERE is where we either INIT CART or UPDATE CART !!!!!
  useEffect(() => {
    if (isMounted && isFromEFA) {
      if (isFirstRender.current) {
        // on first render we have to init the cart
        initCart?.(lineItems);
        isFirstRender.current = false;
      } else {
        // after first render we update cart if lineItems change
        updateCart?.(lineItems);
      }
    }
  }, [isMounted, isFromEFA, lineItems, initCart, updateCart]);
  
  console.log('shopContext.cart', shopContext.cart);

  return null;
}
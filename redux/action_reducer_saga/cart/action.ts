import { action } from 'typesafe-actions';
import { ADD_TO_CART, ADD_TO_CART_FAIL, ADD_TO_CART_SUCCESS, DIMINISH_ITEM_FROM_CART, DIMINISH_ITEM_FROM_CART_FAIL, DIMINISH_ITEM_FROM_CART_SUCCESS, GET_CART_INFO, GET_CART_INFO_FAIL, GET_CART_INFO_SUCCESS, REMOVE_ITEM_FROM_CART, REMOVE_ITEM_FROM_CART_FAIL, REMOVE_ITEM_FROM_CART_SUCCESS } from '../../../contants/actions.constants';
import { CartInfoType, ProductType } from '../../types';

export const actions = {
    getCartInfo: () => action(GET_CART_INFO),
    getCartInfoSuccess: (cartInfo: CartInfoType) => action(GET_CART_INFO_SUCCESS, { cartInfo }),
    getCartInfoFail: (error: string | boolean) => action(GET_CART_INFO_FAIL, { error }),
    addToCart: (SID_PRODUCT: string, QTY: number) => action(ADD_TO_CART, { SID_PRODUCT, QTY }),
    addToCartSuccess: (cart: CartInfoType) => action(ADD_TO_CART_SUCCESS, { cart }),
    addToCartFail: (error: string | boolean) => action(ADD_TO_CART_FAIL, { error }),
    removeProductFromCart: (SID_PRODUCT: string) => action(REMOVE_ITEM_FROM_CART, { SID_PRODUCT }),
    removeProductFromCartSuccess: (cart: CartInfoType) => action(REMOVE_ITEM_FROM_CART_SUCCESS, { cart }),
    removeProductFromCartFail: (error: string | boolean) => action(REMOVE_ITEM_FROM_CART_FAIL, { error }),
    diminishItemFromCart: (SID_PRODUCT: string, QTY: number) => action(DIMINISH_ITEM_FROM_CART, { SID_PRODUCT,QTY }),
    diminishItemFromCartSuccess: (cart: CartInfoType) => action(DIMINISH_ITEM_FROM_CART_SUCCESS, { cart }),
    diminishItemFromCartFail: (error: string | boolean) => action(DIMINISH_ITEM_FROM_CART_FAIL, { error }),
}
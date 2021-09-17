import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';
import { ADD_TO_CART, DIMINISH_ITEM_FROM_CART, GET_CART_INFO, REMOVE_ITEM_FROM_CART } from '../../../contants/actions.constants';
import { CartInfoType, ProductType } from '../../types';
import { actions } from './action';

function* getCartInfo(): any {
    try {
        const response = yield axios({
            url: 'http://localhost:5035/customers/cart',
            method: 'GET',
            withCredentials: true,
        });
        if (!response.data.error) {
            yield put(actions.getCartInfoSuccess(response.data.cart));
        } else {
            yield put(actions.getCartInfoFail(response.data.error));
        }
    } catch (error) {
        yield put(actions.getCartInfoFail(error + ''));
    }
}

function* addToCart({ payload }: any): any {
    try {
        const SID_PRODUCT = payload.SID_PRODUCT;
        const QTY = payload.QTY;
        const data = { SID_PRODUCT: SID_PRODUCT, QTY }
        const response = yield axios({
            url: 'http://localhost:5035/customers/add-to-cart',
            method: 'POST',
            withCredentials: true,
            data,
        });
        if (response.data) {
            let cart: CartInfoType;
            cart = response.data.CART;
            yield put(actions.addToCartSuccess(cart));
        } else {
            yield put(actions.addToCartFail('Cannot add product to cart'))
        }
    } catch (error) {
        yield put(actions.addToCartFail(error + ''));
    }
}

function* removeItemFromCart({ payload }: any): any {
    try {
        const SID_PRODUCT = payload.SID_PRODUCT;
        const data = { SID_PRODUCT };
        const response = yield axios({
            url: 'http://localhost:5035/customers/remove-from-cart',
            method: 'POST',
            data,
            withCredentials: true,
        });
        if (response.data && response.data.CART) {
            yield put(actions.removeProductFromCartSuccess(response.data.CART));
        } else {
            yield put(actions.removeProductFromCartFail(response.data.error));
        }
    } catch (error) {
        yield put(actions.removeProductFromCartFail(error + ''));
    }
}

function* diminishItemFromCart({ payload }: any): any {
    try {
        const SID_PRODUCT = payload.SID_PRODUCT;
        const QTY = payload.QTY;
        const data = { SID_PRODUCT: SID_PRODUCT , QTY: QTY}
        const response = yield axios({
            url: 'http://localhost:5035/customers/diminish-from-cart',
            method: 'POST',
            withCredentials: true,
            data,
        });
        if (response.data) {
            let cart: CartInfoType;
            cart = response.data.CART;
            yield put(actions.addToCartSuccess(cart));
        } else {
            yield put(actions.addToCartFail('Cannot add product to cart'))
        }
    } catch (error) {
        yield put(actions.addToCartFail(error + ''));
    }
}

export default function* cartSaga() {
    yield takeLatest(GET_CART_INFO, getCartInfo);
    yield takeLatest(ADD_TO_CART, addToCart);
    yield takeLatest(REMOVE_ITEM_FROM_CART, removeItemFromCart);
    yield takeLatest(DIMINISH_ITEM_FROM_CART, diminishItemFromCart);
}
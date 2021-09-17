import { spawn } from 'redux-saga/effects';
import cartSaga from './action_reducer_saga/cart/saga';
import checkoutSaga from './action_reducer_saga/checkout/saga';
import loginRegisterSaga from './action_reducer_saga/login/saga';
import {takeGetProductDetail} from './action_reducer_saga/products/detail/saga';
import {watchAddToWishList, 
    watchGetWishListOneProduct,
     watchDeleteWishListOneProduct, 
     watchGetWishListAll, 
     watchDeleteWishListInList, 
     watchGetWishListNumber,
} from './action_reducer_saga/customer/wishlist/saga'
import { watchGetListOrder, watchGetOrderDetail } from './action_reducer_saga/customer/orders/saga';

export default function* rootSaga() {
    yield spawn(loginRegisterSaga);
    yield spawn(takeGetProductDetail);
    yield spawn(cartSaga);
    yield spawn(checkoutSaga);
    yield spawn(watchAddToWishList);
    yield spawn(watchGetWishListOneProduct);
    yield spawn(watchDeleteWishListOneProduct);
    yield spawn(watchGetWishListAll);
    yield spawn(watchDeleteWishListInList);
    yield spawn(watchGetWishListNumber);
    yield spawn(watchGetListOrder);
    yield spawn(watchGetOrderDetail);
}
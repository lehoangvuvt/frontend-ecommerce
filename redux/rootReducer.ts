import { combineReducers } from 'redux';
import { productDetailReducer } from './action_reducer_saga/products/detail/reducer'
import { checkoutReducer } from './action_reducer_saga/checkout/reducer';
import { globalReducer } from './reducer';
import { wishListReducer } from './action_reducer_saga/customer/wishlist/reducer';
import { filterReducer } from '../component/Filter/reducer';
import {orderReducer} from '../redux/action_reducer_saga/customer/orders/reducer'

export const rootReducer = combineReducers({
    global: globalReducer,
    productDetail: productDetailReducer,
    checkout: checkoutReducer,
    wishList: wishListReducer,
    filter: filterReducer,
    order: orderReducer
})

export type RootReducerType = ReturnType<typeof rootReducer>;

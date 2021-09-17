import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';
import { CREATE_ORDER } from '../../../contants/actions.constants';
import { actions } from './action';

function* createOrder({ payload }: any): any {
    try {
        const data = payload.createOrderInfo;
        const response = yield axios({
            url: 'http://localhost:5035/orders/create',
            method: 'POST',
            data,
            withCredentials: true
        });
        if (response.data && response.data.order) {
            yield put(actions.createOrderSuccess(response.data.order))
        } else {
            if (response.data && response.data.outOfStockItems) {
                yield put(actions.createOrderFail('Out of stock', response.data.outOfStockItems));
            }
        }
    } catch (error) {
        yield put(actions.createOrderFail(error + '', []));
    }
}

export default function* checkoutSaga() {
    yield takeLatest(CREATE_ORDER, createOrder);
}
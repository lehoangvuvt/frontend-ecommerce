import axios from "axios";
import { put, takeLatest } from "redux-saga/effects";
import { GET_LIST_ORDER, GET_LIST_ORDER_SUCCESSFULL, GET_ORDER_DETAIL } from "../../../../contants/actions.constants";
import {actions} from './action'

function* getListOrder({payload}: any):any {
    try {
        const response = yield axios({
            method: "GET",
            url: "http://localhost:5035/orders/personal",
            withCredentials: true
        });
        const data = response.data.listOrders;
        yield put(actions.getListOrderSuccess(data));
    }
    catch(ex) {

    }
} 

function* getOrderDetail({payload}: any):any {
    try{
        const response = yield axios({
            method: "GET",
            url: `http://localhost:5035/orders/personal/${payload.order_id}`,
            withCredentials: true
        })
        const data = response.data.orderDetail;
        yield put(actions.getOrderDetailSuccess(data));
    }
    catch(ex) {

    }
}

export function* watchGetListOrder() {
    yield takeLatest(GET_LIST_ORDER, getListOrder);
}

export function* watchGetOrderDetail() {
    yield takeLatest(GET_ORDER_DETAIL, getOrderDetail);
}
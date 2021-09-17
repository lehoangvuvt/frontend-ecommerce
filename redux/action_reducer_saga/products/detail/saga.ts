import axios from 'axios'
import * as Eff from 'redux-saga/effects'
import { GET_PRODUCT_DETAIL } from '../../../../contants/actions.constants'
import { actions } from './action'

const takeLatest: any = Eff.takeLatest;
const put: any = Eff.put;

function* fetchGetProductDetail({ payload }: any): any {
    try {
        const response = yield axios.get(`http://localhost:5035/products/product-information/${payload.product_sid}`);
        const data = response.data;
        yield put(actions.setProductDetailSuccess({
            productByGroupedAttribute: response.data.productByGroupedAttribute,
            productInformation: response.data.productInformation
        }))
    }
    catch (ex) {
        yield put(actions.setProductDetailError({ error: 1 }))
    }
}

export function* takeGetProductDetail() {
    yield takeLatest(GET_PRODUCT_DETAIL, fetchGetProductDetail)
}
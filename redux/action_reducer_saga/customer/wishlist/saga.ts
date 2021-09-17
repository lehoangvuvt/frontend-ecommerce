import { actions } from './action'
import axios from 'axios'
import { takeLatest, put } from 'redux-saga/effects'
import { ADD_TO_WISHLIST,
     GET_WISHLIST_ONE_PRODUCT, 
     DELETE_WISHLIST_ONE_PRODUCT, 
     GET_WISHLIST_ALL, 
     GET_WISHLIST_ALL_SUCCESS, 
     GET_WISHLIST_ALL_FAIL,
     DELETE_WISHLIST_IN_LIST,
     DELETE_WISHLIST_IN_LIST_SUCCESS,
     GET_WISHLIST_NUMBER
    } from '../../../../contants/actions.constants'

function* addToWishList({ payload }: any): any {
    try {
        const response = yield axios({
            url: 'http://localhost:5035/customers/wishlist',
            method: "POST",
            withCredentials: true,
            data: {
                PRODUCT_SID: payload.PRODUCT_SID
            }
        });
        const data: any = response.data;
        if ((data.error === null || data.error === undefined) && data.SID !== null && data.SID !== undefined && data.SID.length > 0)
            yield put(actions.addToWishListSuccess(data.SID));
    }
    catch (ex) {
        console.log(ex);
    }
}

function* getWishListOneProduct({ payload }: any): any {
    try {
        // console.log(payload.PRODUCT_SID)
        const response = yield axios({
            url: `http://localhost:5035/customers/wishlist?psid=${payload.PRODUCT_SID}`,
            method: "GET",
            withCredentials: true
        });
        const data: any = response.data;
        if (data.error === null || data.error === undefined) {
            yield put(actions.getWishListOneProductSuccess(data.SID))
        }
        else yield put(actions.getWishListOneProductFail(data.error))

    }
    catch (ex) {
        yield put(actions.getWishListOneProductFail('Something went wrong'))
    }
}

function* deleteWishListOneProduct({ payload }: any): any {
    try {
        const response = yield axios({
            url: `http://localhost:5035/customers/wishlist?wlsid=${payload.WISHLIST_SID}`,
            method: "DELETE",
            withCredentials: true
        });
        const data: any = response.data;
        if ((data.error === null || data.error === undefined) && data.affectedRows === 1) {
            yield put(actions.deleteWishListOneProductSuccess())
        }
    }
    catch (ex) {

    }
}

function* getWishListAll({ payload }: any): any {
    try {
        const response = yield axios({
            url: 'http://localhost:5035/customers/wishlist/all',
            method: 'GET',
            withCredentials: true
        });
        const data: any = response.data;
        // console.log(data.error);
        if (response.status === 200 && (data.error === undefined))
            yield put(actions.getWishListAllSuccess(data.wishlist));
        else yield put(actions.getWishListAllFail(data.error));
    }
    catch (ex) {

    }
}

function* deleteWishListInList({payload}: any): any {
    try {
        // console.log(payload);
        const response = yield axios({
            url: `http://localhost:5035/customers/wishlist?wlsid=${payload.WISHLIST_SID}`,
            method: "DELETE",
            withCredentials: true
        });
        const data: any = response.data;
        if ((data.error === null || data.error === undefined) && data.affectedRows === 1) {
            yield put(actions.deleteWishListInListSuccess(payload.WISHLIST_SID))
        }
    }
    catch (ex) {

    }
}

function* getWishListNumber({payload}: any):any {
    try {
        const response = yield axios({
            url: 'http://localhost:5035/customers/wishlist/count',
            method: 'GET',
            withCredentials: true
        });
        const data: any = response.data;
        yield put(actions.getWishListNumberSuccess(data.count));
    }
    catch(ex) {
        yield put(actions.getWishListNumberSuccess(0))
    }
}

export function* watchAddToWishList() {
    yield takeLatest(ADD_TO_WISHLIST, addToWishList);
}

export function* watchGetWishListOneProduct() {
    yield takeLatest(GET_WISHLIST_ONE_PRODUCT, getWishListOneProduct);
}

export function* watchDeleteWishListOneProduct() {
    yield takeLatest(DELETE_WISHLIST_ONE_PRODUCT, deleteWishListOneProduct);
}

export function* watchGetWishListAll() {
    yield takeLatest(GET_WISHLIST_ALL, getWishListAll);
}

export function* watchDeleteWishListInList() {
    yield takeLatest(DELETE_WISHLIST_IN_LIST, deleteWishListInList);
}

export function* watchGetWishListNumber() {
    yield takeLatest(GET_WISHLIST_NUMBER, getWishListNumber);
}
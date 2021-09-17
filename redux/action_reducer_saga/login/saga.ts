import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';
import { LOGIN, LOGOUT } from '../../../contants/actions.constants';
import { actions } from './action';
import { actions as checkoutActions } from '../checkout/action';

function* login({ payload }: any): any {
    try {
        const { EMAIL, PASSWORD } = payload;
        const body = { EMAIL, PASSWORD };
        const response = yield axios({
            url: 'http://localhost:5035/customers/login',
            method: 'POST',
            data: body,
            withCredentials: true,
        });
        const data = yield response.data;
        const customer_info = data.customer_info;
        if (data.message) {
            yield put(actions.loginFail(data.message));
        } else {
            yield put(actions.loginSuccess(customer_info));
        }
    } catch (error) {
        yield put(actions.loginFail(error));
    }
}

function* logout(): any {
    try {
        const response = yield fetch('http://localhost:5035/customers/logout', {
            method: 'GET',
            credentials: 'include'
        });
        yield put(checkoutActions.setSelectedAddress(null));
        yield put(actions.logoutSuccess());
    } catch (error) {
        yield put(actions.logoutFail(error));
    }
}

export default function* loginRegisterSaga() {
    yield takeLatest(LOGIN, login);
    yield takeLatest(LOGOUT, logout);
}
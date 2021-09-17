import { action } from 'typesafe-actions';
import { LOGIN, LOGIN_SUCCESSFUL, LOGIN_FAIL, LOGOUT, LOGOUT_SUCCESSFUL, LOGOUT_FAIL } from '../../../contants/actions.constants';
import { CustomerInfoType } from '../../types';

export const actions = {
    login: (EMAIL: string, PASSWORD: string) => action(LOGIN, { EMAIL, PASSWORD }),
    loginSuccess: (customer_info: CustomerInfoType | null) => action(LOGIN_SUCCESSFUL, { customer_info }),
    loginFail: (error: string | boolean | any) => action(LOGIN_FAIL, { error }),
    logout: () => action(LOGOUT),
    logoutSuccess: () => action(LOGOUT_SUCCESSFUL),
    logoutFail: (error: string | boolean | any) => action(LOGOUT_FAIL, { error }),
}

// export const login = (EMAIL, PASSWORD) => {
//     return {
//         type: LOGIN,
//         EMAIL, PASSWORD
//     }
// }

// export const loginSuccess = (email) => {
//     return {
//         type: LOGIN_SUCCESSFUL,
//         email,
//     }
// }

// export const loginFail = (error) => {
//     return {
//         type: LOGIN_FAIL,
//         error
//     }
// }
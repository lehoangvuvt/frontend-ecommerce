import { ActionType, Reducer } from 'typesafe-actions'
import {
    GET_WISHLIST_ONE_PRODUCT_SUCCESS,
    GET_WISHLIST_ONE_PRODUCT_FAIL,
    DELETE_WISHLIST_ONE_PRODUCT_SUCCESS,
    ADD_TO_WISHLIST_SUCCESS,
    GET_WISHLIST_ALL_SUCCESS,
    GET_WISHLIST_ALL_FAIL,
    DELETE_WISHLIST_IN_LIST_SUCCESS,
    GET_WISHLIST_NUMBER_SUCCESS
} from '../../../../contants/actions.constants'
import { ProductInformationType } from '../../../types';
import { actions } from './action'
import { WishList } from './interface'

type Action = ActionType<typeof actions>;

interface State {
    wishList: {
        error: number,
        SID: string | string[] | undefined,
        msg: string | string[] | undefined
    },
    wishListAll: {
        error: number,
        msg: string | string[] | undefined,
        data: WishList[]
    },
    wishListNumber: number,
    wishListDeletedSID: string|undefined
}

const initialState = {
    wishList: {
        error: 0,
        SID: '',
        msg: ''
    },
    wishListAll: {
        error: 0,
        msg: '',
        data: []
    },
    wishListNumber: 0,
    wishListDeletedSID: undefined
}

export const wishListReducer: Reducer<Readonly<State>, Action> = (state = initialState, action: Action) => {
    switch (action.type) {
        case GET_WISHLIST_NUMBER_SUCCESS:
            return {
                ...state,
                wishListNumber: action.payload.count
            }
        case GET_WISHLIST_ALL_SUCCESS:
            return {
                ...state,
                wishListAll: {
                    error: 0,
                    msg: '',
                    data: action.payload.data
                }
            }
        case GET_WISHLIST_ALL_FAIL:
            return {
                ...state,
                wishListAll: {
                    error: 1,
                    msg: action.payload.error,
                    data: []
                }
            }
        case GET_WISHLIST_ONE_PRODUCT_SUCCESS:
            return {
                ...state,
                wishList: {
                    error: 0,
                    msg: '',
                    SID: action.payload.WISHLIST_SID
                }
            }
        case GET_WISHLIST_ONE_PRODUCT_FAIL:
            return {
                ...state,
                wishList: {
                    error: 1,
                    msg: action.payload.error,
                    SID: ''
                }
            }
        case DELETE_WISHLIST_ONE_PRODUCT_SUCCESS:
            return {
                ...state,
                wishList: {
                    error: 0,
                    msg: '',
                    SID: ''
                }
            }
        case ADD_TO_WISHLIST_SUCCESS:
            return {
                ...state,
                wishList: {
                    error: 0,
                    msg: '',
                    SID: action.payload.WISHLIST_SID
                }
            }
        case DELETE_WISHLIST_IN_LIST_SUCCESS:
            return {
                ...state,
                wishListDeletedSID: action.payload.WISHLIST_SID
            }
        default:
            return {
                ...state
            }
    }
}
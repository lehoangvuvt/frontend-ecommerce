import { action } from 'typesafe-actions'
import {
    ADD_TO_WISHLIST,
    ADD_TO_WISHLIST_SUCCESS,
    ADD_TO_WISHLIST_FAIL,
    GET_WISHLIST_ONE_PRODUCT,
    GET_WISHLIST_ONE_PRODUCT_SUCCESS,
    GET_WISHLIST_ONE_PRODUCT_FAIL,
    DELETE_WISHLIST_ONE_PRODUCT,
    DELETE_WISHLIST_ONE_PRODUCT_FAIL,
    DELETE_WISHLIST_ONE_PRODUCT_SUCCESS,
    DELETE_WISHLIST_IN_LIST,
    DELETE_WISHLIST_IN_LIST_SUCCESS,
    GET_WISHLIST_ALL,
    GET_WISHLIST_ALL_FAIL,
    GET_WISHLIST_ALL_SUCCESS,
    GET_WISHLIST_NUMBER,
    GET_WISHLIST_NUMBER_SUCCESS
} from '../../../../contants/actions.constants'
import { ProductInformationType } from '../../../types'
import { WishList } from './interface'

export const actions = {
    addToWishList: (PRODUCT_SID: string | string[]) => action(ADD_TO_WISHLIST, { PRODUCT_SID }),
    getWishListOneProduct: (PRODUCT_SID: string | string[]) => action(GET_WISHLIST_ONE_PRODUCT, { PRODUCT_SID }),
    getWishListOneProductSuccess: (WISHLIST_SID: string | string[]) => action(GET_WISHLIST_ONE_PRODUCT_SUCCESS, { WISHLIST_SID }),
    getWishListOneProductFail: (error: string | string[]) => action(GET_WISHLIST_ONE_PRODUCT_FAIL, { error }),
    deleteWishListOneProduct: (WISHLIST_SID: string | string[] | undefined) => action(DELETE_WISHLIST_ONE_PRODUCT, { WISHLIST_SID }),
    deleteWishListOneProductSuccess: () => action(DELETE_WISHLIST_ONE_PRODUCT_SUCCESS, {}),
    deleteWishListInList: (WISHLIST_SID: string) => action(DELETE_WISHLIST_IN_LIST, {WISHLIST_SID}),
    deleteWishListInListSuccess: (WISHLIST_SID: string) => action(DELETE_WISHLIST_IN_LIST_SUCCESS, {WISHLIST_SID}),
    addToWishListSuccess: (WISHLIST_SID: string | string[] | undefined) => action(ADD_TO_WISHLIST_SUCCESS, { WISHLIST_SID }),
    getWishListAll: () => action(GET_WISHLIST_ALL, {}),
    getWishListAllSuccess: (data: WishList[]) => action(GET_WISHLIST_ALL_SUCCESS, { data }),
    getWishListAllFail: (error: string | string[] | undefined) => action(GET_WISHLIST_ALL_FAIL, { error }),
    getWishListNumber: () => action(GET_WISHLIST_NUMBER, {}),
    getWishListNumberSuccess: (count: number) => action(GET_WISHLIST_NUMBER_SUCCESS, {count})
}
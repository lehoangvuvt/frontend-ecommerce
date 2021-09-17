import { GET_PRODUCT_DETAIL, GET_PRODUCT_DETAIL_SUCCESS, GET_PRODUCT_DETAIL_ERROR } from "../../../../contants/actions.constants";
import { ProductDetailState, ProductDetailError } from './interface'
import { action } from 'typesafe-actions'

export const actions = {
    getProductDetail: (product_sid: string | string[]) => action(GET_PRODUCT_DETAIL, { product_sid }),
    setProductDetailSuccess: (details: ProductDetailState) => action(GET_PRODUCT_DETAIL_SUCCESS, details),
    setProductDetailError: (err: ProductDetailError) => action(GET_PRODUCT_DETAIL_ERROR, err),
}
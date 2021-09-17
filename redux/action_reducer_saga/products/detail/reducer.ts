import { Reducer, ActionType } from 'typesafe-actions'
import { actions } from './action'
import { ProductDetailState } from './interface'
import { GET_PRODUCT_DETAIL, GET_PRODUCT_DETAIL_ERROR, GET_PRODUCT_DETAIL_SUCCESS } from '../../../../contants/actions.constants'
import { ProductAttributeValueType, ProductImageType, ProductInformationType } from '../../../types';


type Action = ActionType<typeof actions>;

const initialState = {
    error: 0,
    productInformation: null,
    productByGroupedAttribute: [],
}

type State = {
    error: number,
    productInformation: ProductInformationType | null,
    productByGroupedAttribute: Array<{
        GROUP_ID: number,
        GROUP_ATTRIBUTE_ID: number,
        GROUP_ATTRIBUTE_NAME: string,
        GROUP_ATTRIBUTE_VALUE: string | number | Date,
        groupedProducts: Array<ProductAttributeValueType>
    }>;
}

export const productDetailReducer: Reducer<Readonly<State>, Action> = (state = initialState, action: Action) => {
    switch (action.type) {
        case GET_PRODUCT_DETAIL_SUCCESS: {
            return {
                ...state,
                //...action.payload,
                error: 0,
                productInformation: action.payload.productInformation,
                productByGroupedAttribute: action.payload.productByGroupedAttribute,
            }
        }
        case GET_PRODUCT_DETAIL_ERROR: {
            return {
                ...state,
                error: 1,
                productInformation: null,
                productByGroupedAttribute: [],
            }
        }
        default:
            return { ...state }
    }
}

export type ProductDetailReducerType = ReturnType<typeof productDetailReducer>;
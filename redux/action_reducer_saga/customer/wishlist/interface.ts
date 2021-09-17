import {ProductDetailState} from '../../products/detail/interface'
import {ProductInformationType} from '../../../types'
export interface WishList {
    SID: string,
    SID_PRODUCT: string,
    SID_CUSTOMER:string,
    CREATED_DATETIME: string,
    MODIFIED_DATETIME: string,
    productInformation: ProductInformationType
}
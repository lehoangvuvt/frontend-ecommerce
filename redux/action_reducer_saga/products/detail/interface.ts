import { ProductAttributeValueType, ProductImageType, ProductInformationType } from '../../../types';

export interface ProductDetailState {
    productInformation: ProductInformationType,
    productByGroupedAttribute: Array<{
        GROUP_ID: number,
        GROUP_ATTRIBUTE_ID: number,
        GROUP_ATTRIBUTE_NAME: string,
        GROUP_ATTRIBUTE_VALUE: string | number | Date,
        groupedProducts: Array<ProductAttributeValueType>
    }>;
}

export interface ProductDetailError {
    error: number
}
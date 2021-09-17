

export interface ProductImageType {
    CREATED_BY: string | null;
    CREATED_DATETIME: Date;
    IMAGE_TYPE: number;
    PRISM_URL: string;
    IMAGE_NAME: string;
    MODIFIED_BY: string | null;
    MODIFIED_DATETIME: Date | null;
    PRODUCT_SID: string;
    SID: string;
}

export interface CategoryType {
    CATEGORY_NAME: string;
    CREATED_BY: string | null;
    CREATED_DATETIME: Date;
    LONG_DESCRIPTION: string;
    MODIFIED_BY: string | null;
    MODIFIED_DATETIME: Date | null;
    SHORT_DESCRIPTION: string;
    SID: string
}

export interface CategoryConnectionsType {
    SID_CATEGORY: string;
    SID_PRODUCT: string;
    category: CategoryType
}

export interface ProductInformationType {
    SID: string;
    SID_BRAND: string;
    SKU: string;
    CREATED_DATETIME: Date;
    MODIFIED_DATETIME: Date;
    PRODUCT_NAME: string;
    LONG_DESCRIPTION: string;
    SHORT_DESCRIPTION: string;
    THRESHOLD: number;
    CAN_PREORDER: boolean;
    PRODUCT_GENDER: 'Men' | 'Women' | 'Both';
    products: ProductType[];
    categoryConnections: CategoryConnectionsType[];
    productBrand: ProductBrandType;
    productReviews: ProductReviewType[];
    productPrices: ProductPriceType[];
    productAttributeGroups: ProductAttributeGroupType[];
    SELLABLE_QTY?: number | 0;
    DISC_VALUE?: number | 0;
}

export interface ProductAttributeGroupType {
    ID: number;
    PRODUCT_INFORMATION_SID: string;
    GROUP_ATTRIBUTE_ID: number;
    GROUP_VALUE_VARCHAR: string;
    GROUP_VALUE_INT: string;
    GROUP_VALUE_DECIMAL: number;
    GROUP_VALUE_DATETIME: Date;
    CREATED_DATETIME: Date;
    MODIFIED_DATETIME: Date;
    productAttributeValues: ProductAttributeValueType[];
    productAttribute: ProductAttributeType;
}

export interface ProductPriceType {
    ID: number;
    SID_PRODUCT_INFORMATION: string;
    CREATED_DATETIME: Date;
    UNIT_PRICE: number;
    TAX: number;
    DISCOUNT: number;
}

export interface ProductReviewType {
    ID: number;
    SID_PRODUCT_INFORMATION: string;
    CREATED_BY: string;
    CREATED_DATETIME: Date;
    MODIFIED_DATETIME: Date;
    CONTENT: string;
    RATING: number;
    productInformation: ProductInformationType;
}

export interface ProductBrandType {
    SID: string;
    CREATED_DATETIME: Date;
    MODIFIED_DATETIME: Date;
    NAME: string;
}

export interface ProductType {
    SID: string;
    SID_PRODUCT_INFORMATION: string;
    QTY: number;
    CREATED_DATETIME: Date;
    MODIFIED_DATETIME: Date;
    images: ProductImageType[];
    productInformation: ProductInformationType;
    discount_promotion?: DiscountPromotionType[];
}

export interface DiscountPromotionType {
    SID: string;
    SID_PRODUCT: string;
    SID_PROMOTION: string;
    DISC_VALUE: number;
    promotion: PromotionType;
}

export interface PromotionType {
    DESCRIPTION: string;
    CREATED_BY: string;
    PROMO_NAME: string;
    DISCOUNT_REASON: string;
    PROMO_GROUP: string;
    PROMO_TYPE: number;
    START_DATE: Date;
    END_DATE: Date;
    START_TIME: number;
    END_TIME: number;
    USE_STORES: boolean;
    USE_PRICE_LEVEL: boolean;
    CAN_BE_COMBINED: boolean;
    APPLY_COUNT: number;
    VALIDATION_USE_ITEMS: boolean;
    VALIDATION_USE_SUBTOTAL: boolean;
    VALIDATION_SUBTOTAL: number;
    VALIDATION_USE_COUPON: boolean;
    VALIDATION_USE_CUSTOMERS: boolean;
    VALIDATION_CUSTOMER_FILTER: number;
    REWARD_VALIDATION_ITEMS: boolean;
    REWARD_VALIDATION_MODE: number;
    REWARD_VALIDATION_DISC_TYPE: number;
    REWARD_VALIDATION_DISC_VALUE: number;
    REWARD_TRANSACTION: boolean;
    REWARD_TRANSACTION_MODE: number;
    REWARD_TRANSACTION_DISC_TYPE: number;
    REWARD_TRANSACTION_DISC_VALUE: number;
    item_rule: PromotionValidationItemRuleType[];
    priority: PromotionPriorityType;
}

export interface PromotionPriorityType {
    PROMOTION_SID: string;
    LEVEL: number;
}

export interface PromotionValidationItemRuleType {
    CREATED_BY: string;
    SUBTOTAL: number;
    filter_element: PromotionValidationFilterElementType[];
}

export interface PromotionValidationFilterElementType {
    CREATED_BY: string;
    FIELD: string;
    OPERATOR: number;
    OPERAND: string;
    JOIN_OPERATOR: number;
}

export interface ProductAttributeType {
    ID: number;
    ATTRIBUTE_NAME: string;
    LABEL_TEXT: string;
    VALUE_TYPE: string;
    CREATED_DATETIME: Date;
    MODIFIED_DATETIME: Date;
}

export interface ProductAttributeValueType {
    ID: number;
    SID_PRODUCT: string;
    PRODUCT_ATTRIBUTE_ID: number;
    CREATED_DATETIME: Date;
    MODIFIED_DATETIME: Date;
    VALUE_VARCHAR: string;
    VALUE_INT: string;
    VALUE_DECIMAL: number;
    VALUE_DATETIME: Date;
    product: ProductType;
    productAttribute: ProductAttributeType;
}

export interface CartItemType {
    CART_SID: string;
    CREATED_DATETIME: string;
    MODIFIED_DATETIME: string;
    QUANTITY: number;
    SID_PRODUCT: string;
    product: CartItemProductType;
    PROMO_NAME: string;
}

export interface CartItemProductType {
    SID: string;
    SID_PRODUCT_INFORMATION: string;
    QTY: number;
    CREATED_DATETIME: Date;
    MODIFIED_DATETIME: Date;
    images: ProductImageType[];
    PRICE: number;
    TAX: number;
    PRODUCT_NAME: string;
    productInformation: ProductInformationType;
    DISC_VALUE?: number;
    productAttributeGroup: ProductAttributeGroupType;
    UPC: string;
    PROMO_NAME: string;
}

export interface DiscountTransactionType {
    PROMO_NAME: string;
    disc_Value: number;
    disc_type: number;
    real_value: number;
}

export interface CartInfoType {
    CREATED_DATETIME: Date;
    SID: string;
    SID_CUSTOMER: string;
    STATUS: number;
    SUB_TOTAL: number;
    TOTAL_ITEMS: number;
    TAX_PRICE: number;
    items: CartItemType[];
    discountTransaction: DiscountTransactionType[];
    itemReward: CartItemProductType[];
    havePromo: boolean;
    discValue: number;
    promoName: string;
    rewardType: number;
}

export interface CustomerInfoType {
    ACTIVE: number;
    PHONE: string;
    BIRTH_DAY: number | null;
    BIRTH_MONTH: number | null;
    BIRTH_YEAR: number | null;
    CREATED_DATETIME: Date;
    CREDIT_LIMIT: number | null;
    CREDIT_USED: number | null;
    CUST_TYPE: number | null;
    EMAIL: string;
    FIRST_NAME: string;
    FIRST_SALE_DATE: Date | null;
    GENDER: number | null;
    LAST_NAME: string;
    LAST_ORDER_DATE: Date | null;
    LAST_SALE_AMT: number | null;
    LAST_SALE_DATE: Date | null;
    MIDDLE_NAME: string | null;
    MODIFIED_DATETIME: Date | null;
    ORDER_ITEM_COUNT: number | null;
    PAYMENT_TERMS_SID: number | null;
    RETURN_ITEM_COUNT: number | null;
    SALE_ITEM_COUNT: number | null;
    SID: string;
    TOTAL_TRANSACTIONS: number | null;
    addresses: Array<CustomerAddressType>;
}

export interface CustomerAddressType {
    FIRST_NAME: string;
    LAST_NAME: string;
    STREET_ADDRESS: string;
    COUNTRY: string;
    CITY: string;
    DISTRICT: string;
    PHONE: string;
    IS_DEFAULT_ADDRESS: number;
}

export interface ItemPropsType {
    productInformation: ProductInformationType;
}

export interface ShippingInfoType {
    EMAIL: string;
    S_FIRST_NAME: string;
    S_LAST_NAME: string;
    S_STREET_ADDRESS: string;
    S_COUNTRY: string;
    S_CITY: string;
    S_DISTRICT: string;
    S_PHONE: string;
    S_TYPE: number;
    P_TYPE: number;
}

export interface BillingInfoType {
    B_FIRST_NAME: string;
    B_LAST_NAME: string;
    B_STREET_ADDRESS: string;
    B_COUNTRY: string;
    B_CITY: string;
    B_DISTRICT: string;
    B_PHONE: string;
}

export interface DistrictOfCityType {
    name: string;
    districts: string[];
}


export interface OrderItemType {
    SID_PRODUCT: string;
    QUANTITY: number;
    HAVE_PROMO: number;
    PRICE: number;
    PRODUCT_NAME: string;
    ORIG_PRICE: number;
    PROMO_NAME: string;
}

export interface CreateOrderType {
    STATUS: number;
    EMAIL: string;
    S_FIRST_NAME: string;
    S_LAST_NAME: string;
    S_STREET_ADDRESS: string;
    S_COUNTRY: string;
    S_CITY: string;
    S_DISTRICT: string;
    S_PHONE: string;
    S_TYPE: number;
    P_TYPE: number;
    DISC_AMT: number;
    PROMO_NAME: string;
    REDEEM_POINT?: number | null;
    REDEEM_AMOUNT?: number | null;
    ITEMS: OrderItemType[];
}


export interface OrderType {
    CREATED_DATETIME: Date;
    STATUS: number;
    EMAIL: string;
    SID_CUSTOMER: string;
    SESSION_ID: string;
    S_FIRST_NAME: string;
    S_LAST_NAME: string;
    S_STREET_ADDRESS: string;
    S_COUNTRY: string;
    S_CITY: string;
    S_DISTRICT: string;
    S_ZIP_CODE: string;
    S_PHONE: string;
    S_TYPE: number;
    P_TYPE: number;
    ITEMS: OrderItemType[];
}

export interface OutOfStockItemType {
    SID_PRODUCT: string;
    exceedQty: number;
}

export interface ErrorFieldsType {
    fieldName: string;
    error: string;
}

export interface StoreType {
    STORE_ID: string;
    CREATED_DATETIME: Date;
    MODIFIED_DATETIME: Date;
    NAME: string;
    LATITUDE: string
    LONGITUDE: string;
    CITY: string;
    DISTRICT: string;
    ADDRESS: string;
    STORE_CODE: string;
}

export interface SelectedFilterType {
    filterFieldName: string;
    filterName: string;
    filterValue: string | number | Date;
    filterSetValue: string;
}

export interface ListOrderType {
    CREATED_DATETIME: Date,
    DISC_AMT: number,
    DISC_PERC: number,
    EMAIL: string,
    ERROR_LOG: string,
    NOTE: string,
    ID: number,
    IP_ADDRESS: string | null,
    MODIFIED_BY: string | null,
    MODIFIED_DATETIME: Date | null,
    P_TYPE: number,
    SESSION_ID: string | null,
    SHIPPING_AMT: number,
    SID_CUSTOMER: string,
    STATUS: number,
    S_CITY: string,
    S_COMPANY: string | null,
    S_COUNTRY: string,
    S_DISTRICT: string,
    S_FIRST_NAME: string,
    S_LAST_NAME: string,
    S_PHONE: string,
    S_STREET_ADDRESS: string,
    S_TYPE: number,
    S_ZIP_CODE: string | null,
    TOTAL_ITEM_COUNT: number,
    TOTAL_LINE_ITEM: number,
    TRANSACTION_SUBTOTAL: number,
    TRANSACTION_TOTAL_AMT: number,
    TRANSACTION_TOTAL_TAX_AMT: number,
    TRANSACTION_TOTAL_WITH_TAX: number
}

export interface OrderDetailType extends ListOrderType {
    historyLines: OrderHistoryType[],
    orderItems: OrderItemsType[]
}

export interface OrderHistoryType {
    CREATED_DATETIME: Date,
    ID: number,
    NOTE: string | null,
    ORDER_ID: number,
    ORDER_STATUS: number
}

export interface OrderItemsType {
    CREATED_DATETIME: Date,
    ID: number,
    ORDER_ID: number,
    QUANTITY: number,
    SID_PRODUCT: string,
    product: ProductType
}

export interface CouponListType {
    SID: string;
    SID_COUPON: string;
    SID_CUSTOMER: string;
    coupon: CouponType;
}

export interface CouponType {
    ACTIVE: boolean;
    APPLY_COUNT?: number;
    COUPON_NAME: string;
    DESCRIPTION: string;
    END_DATE: string;
    REWARD_DISCOUNT_TYPE: number;
    REWARD_DISCOUNT_VALUE: number;
    REWARD_MODE: number;
    SID: string;
    START_DATE: string;
    VALIDATION_SUBTOTAL: number;
    VALIDATION_USE_SUBTOTAL: boolean;
}
export interface OrderRC {
    SID: string,
    PRODUCT_NAME: string,
    UNIT_PRICE: number,
    PRISM_URL: string,
    IMAGE_NAME: string,
    CATEGORY_NAME: string,
    RATING: string,
    DISC_VALUE: number,
}

export interface PaymentMethodType {
    ID: number;
    CREATED_DATETIME: Date;
    MODIFIED_DATETIME: Date;
    PAYMENT_DESCRIPTION: string;
    ICON_URL: string;
}

export interface ShippingMethodType {
    ID: number;
    CREATED_DATETIME: Date;
    MODIFIED_DATETIME: Date;
    SHIPPING_METHOD_NAME: string;
    DESCRIPTION: string;
    FLAT_PRICE: number;
}
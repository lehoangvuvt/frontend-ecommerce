import { action } from 'typesafe-actions';
import { CHOOSE_PICK_UP_OPTION, CLEAR_ERROR, CREATE_ORDER, CREATE_ORDER_FAIL, CREATE_ORDER_SUCCESS, SET_SELECTED_ADDRESS, SUBMIT_BILLING_INFO, SUBMIT_SHIPPING_INFO } from '../../../contants/actions.constants';
import { BillingInfoType, CreateOrderType, CustomerAddressType, OrderType, OutOfStockItemType, ShippingInfoType } from '../../types';

export const actions = {
    submitShippingInfo: (shippingInfo: ShippingInfoType) => action(SUBMIT_SHIPPING_INFO, { shippingInfo }),
    submitBillingInfo: (billingInfo: BillingInfoType) => action(SUBMIT_BILLING_INFO, { billingInfo }),
    createOrder: (createOrderInfo: CreateOrderType) => action(CREATE_ORDER, { createOrderInfo }),
    createOrderSuccess: (orderInfo: OrderType) => action(CREATE_ORDER_SUCCESS, { orderInfo }),
    createOrderFail: (error: string | boolean, outOfStockItems: OutOfStockItemType[]) => action(CREATE_ORDER_FAIL, { error, outOfStockItems }),
    clearError: (SID_PRODUCT: string) => action(CLEAR_ERROR, { SID_PRODUCT }),
    choosePickupOption: (option: number) => action(CHOOSE_PICK_UP_OPTION, { option }),
    setSelectedAddress: (address: CustomerAddressType | null) => action(SET_SELECTED_ADDRESS, { address }),
}
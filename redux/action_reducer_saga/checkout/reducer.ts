import { Reducer, ActionType } from 'typesafe-actions';
import {
    CHOOSE_PICK_UP_OPTION,
    CLEAR_ERROR,
    CREATE_ORDER,
    CREATE_ORDER_FAIL,
    CREATE_ORDER_SUCCESS,
    SET_SELECTED_ADDRESS,
    SUBMIT_BILLING_INFO,
    SUBMIT_SHIPPING_INFO
} from '../../../contants/actions.constants';
import { BillingInfoType, CustomerAddressType, OrderType, OutOfStockItemType, ShippingInfoType } from '../../types';
import { actions } from './action';

const intialState = {
    shippingInfo: {
        CREATED_BY: '',
        EMAIL: '',
        S_FIRST_NAME: '',
        S_LAST_NAME: '',
        S_COMPANY: '',
        S_STREET_ADDRESS: '',
        S_COUNTRY: '',
        S_CITY: '',
        S_DISTRICT: '',
        S_ZIP_CODE: '',
        S_PHONE: '',
        S_TYPE: 1,
        P_TYPE: 1,
    },
    billingInfo: {
        B_FIRST_NAME: '',
        B_LAST_NAME: '',
        B_COMPANY: '',
        B_STREET_ADDRESS: '',
        B_COUNTRY: '',
        B_CITY: '',
        B_DISTRICT: '',
        B_ZIP_CODE: '',
        B_PHONE: '',
    },
    createOrder: {
        isLoading: false,
        error: false,
        outOfStockItems: [],
        order: null,
    },
    pickUpOption: 1,
    selectedAddress: null,
}

interface State {
    shippingInfo: ShippingInfoType,
    billingInfo: BillingInfoType,
    createOrder: {
        isLoading: boolean,
        error: string | boolean,
        outOfStockItems: OutOfStockItemType[],
        order: OrderType | null,
    },
    pickUpOption: number,
    selectedAddress: CustomerAddressType | null,
}

type Action = ActionType<typeof actions>;

export const checkoutReducer: Reducer<Readonly<State>, Action> = (state = intialState, action: Action) => {
    switch (action.type) {
        case SUBMIT_SHIPPING_INFO:
            return {
                ...state,
                shippingInfo: action.payload.shippingInfo
            }
        case SUBMIT_BILLING_INFO:
            return {
                ...state,
                billingInfo: action.payload.billingInfo,
            }
        case CREATE_ORDER:
            return {
                ...state,
                createOrder: {
                    isLoading: true,
                    error: false,
                    order: null,
                    outOfStockItems: [],
                },
            }
        case CREATE_ORDER_SUCCESS:
            return {
                ...state,
                createOrder: {
                    isLoading: false,
                    error: false,
                    order: action.payload.orderInfo,
                    outOfStockItems: [],
                },
            }
        case CREATE_ORDER_FAIL:
            return {
                ...state,
                createOrder: {
                    isLoading: false,
                    error: action.payload.error,
                    order: null,
                    outOfStockItems: action.payload.outOfStockItems,
                }
            }
        case CLEAR_ERROR:
            return {
                ...state,
                createOrder: {
                    ...state.createOrder,
                    error: false,
                    outOfStockItems: state.createOrder.outOfStockItems.filter(item => item.SID_PRODUCT !== action.payload.SID_PRODUCT),
                }
            }
        case CHOOSE_PICK_UP_OPTION:
            return {
                ...state,
                pickUpOption: action.payload.option,
            }
        case SET_SELECTED_ADDRESS:
            return {
                ...state,
                selectedAddress: action.payload.address,
            }
        default:
            return state;
    }
}
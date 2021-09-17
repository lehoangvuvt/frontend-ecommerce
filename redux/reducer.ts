import { ActionType, Reducer } from "typesafe-actions";
import { ADD_TO_CART, ADD_TO_CART_FAIL, ADD_TO_CART_SUCCESS, CREATE_ORDER_SUCCESS, DIMINISH_ITEM_FROM_CART, DIMINISH_ITEM_FROM_CART_FAIL, DIMINISH_ITEM_FROM_CART_SUCCESS, GET_CART_INFO, GET_CART_INFO_FAIL, GET_CART_INFO_SUCCESS, LOGIN, LOGIN_FAIL, LOGIN_SUCCESSFUL, LOGOUT, LOGOUT_FAIL, LOGOUT_SUCCESSFUL, REMOVE_ITEM_FROM_CART, REMOVE_ITEM_FROM_CART_FAIL, REMOVE_ITEM_FROM_CART_SUCCESS } from "../contants/actions.constants";
import { actions as loginActions } from "./action_reducer_saga/login/action";
import { actions as cartActions } from "./action_reducer_saga/cart/action";
import { actions as orderActions } from "./action_reducer_saga/checkout/action";
import { CartInfoType, CartItemType, CustomerInfoType } from "./types";

const intialState = {
    login: {
        isLoading: false,
        error: false,
    },
    logout: {
        isLoading: false,
        error: false
    },
    customer_info: null,
    getCartInfo: {
        isLoading: false,
        error: false,
    },
    addToCart: {
        isLoading: false,
        error: false,
    },
    cartInfo: null,
    removeItemFromCart: {
        isLoading: false,
        error: false,
    },
    diminishItemFromCart: {
        isLoading: false,
        error: false,
    }
}

interface State {
    login: {
        isLoading: boolean,
        error: string | boolean,
    },
    logout: {
        isLoading: boolean,
        error: boolean | string
    }
    customer_info: CustomerInfoType | null,
    getCartInfo: {
        isLoading: boolean,
        error: boolean | string,
    },
    addToCart: {
        isLoading: boolean,
        error: string | boolean
    },
    cartInfo: CartInfoType | null,
    removeItemFromCart: {
        isLoading: boolean,
        error: string | boolean,
    },
    diminishItemFromCart: {
        isLoading: boolean,
        error: string | boolean,
    },
}

type Action = ActionType<typeof loginActions & typeof cartActions & typeof orderActions>;

export const globalReducer: Reducer<Readonly<State>, Action> = (state = intialState, action: Action) => {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                login: {
                    isLoading: true,
                    error: false,
                },
                customer_info: null,
            }
        case LOGIN_SUCCESSFUL:
            return {
                ...state,
                login: {
                    isLoading: false,
                    error: false,
                },
                customer_info: action.payload.customer_info,
            }
        case LOGIN_FAIL:
            return {
                ...state,
                login: {
                    isLoading: false,
                    error: action.payload.error,
                },
                customer_info: null,
            }
        case LOGOUT:
            return {
                ...state,
                logout: {
                    isLoading: true,
                    error: false,
                }
            }
        case LOGOUT_SUCCESSFUL:
            return {
                ...state,
                logout: {
                    isLoading: false,
                    error: false,
                },
                customer_info: null,
            }
        case LOGOUT_FAIL:
            return {
                ...state,
                logout: {
                    isLoading: false,
                    error: action.payload.error,
                },
            }
        case GET_CART_INFO:
            return {
                ...state,
                getCartInfo: {
                    isLoading: true,
                    error: false,
                },
                cartInfo: null
            }
        case GET_CART_INFO_SUCCESS:
            return {
                ...state,
                getCartInfo: {
                    isLoading: false,
                    error: false,
                },
                cartInfo: action.payload.cartInfo,
            }
        case GET_CART_INFO_FAIL:
            return {
                ...state,
                getCartInfo: {
                    isLoading: false,
                    error: action.payload.error,
                },
                cartInfo: null,
            }
        case ADD_TO_CART:
            return {
                ...state,
                addToCart: {
                    isLoading: true,
                    error: false
                },
            }
        case ADD_TO_CART_SUCCESS:
            return {
                ...state,
                addToCart: {
                    isLoading: false,
                    error: false,
                },
                cartInfo: action.payload.cart,
            }
        case ADD_TO_CART_FAIL:
            return {
                ...state,
                addToCart: {
                    isLoading: false,
                    error: action.payload.error,
                }
            }
        case REMOVE_ITEM_FROM_CART:
            return {
                ...state,
                removeItemFromCart: {
                    isLoading: true,
                    error: false,
                },
            }
        case REMOVE_ITEM_FROM_CART_SUCCESS:
            return {
                ...state,
                removeItemFromCart: {
                    isLoading: false,
                    error: false,
                },
                cartInfo: action.payload.cart,
            }
        case REMOVE_ITEM_FROM_CART_FAIL:
            return {
                ...state,
                removeItemFromCart: {
                    isLoading: false,
                    error: action.payload.error,
                },
            }
        case DIMINISH_ITEM_FROM_CART:
            return {
                ...state,
                diminishItemFromCart: {
                    isLoading: true,
                    error: false
                },
            }
        case DIMINISH_ITEM_FROM_CART_SUCCESS:
            return {
                ...state,
                diminishItemFromCart: {
                    isLoading: false,
                    error: false,
                },
                cartInfo: action.payload.cart,
            }
        case DIMINISH_ITEM_FROM_CART_FAIL:
            return {
                ...state,
                diminishItemFromCart: {
                    isLoading: false,
                    error: action.payload.error,
                }
            }
        case CREATE_ORDER_SUCCESS:
            return {
                ...state,
                cartInfo: null,
            }
        default:
            return state;
    }
}
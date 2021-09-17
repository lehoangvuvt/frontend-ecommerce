import {Reducer, ActionType} from 'typesafe-actions'
import { GET_LIST_ORDER_SUCCESSFULL, GET_ORDER_DETAIL_SUCCESS } from '../../../../contants/actions.constants';
import { ListOrderType, OrderDetailType } from '../../../types';
import {actions} from './action'

type Action = ActionType<typeof actions>;

interface State{
    listOrder: ListOrderType[],
    orderDetail: OrderDetailType | null
}

const initialState = {
    listOrder: [],
    orderDetail: null
}

export const orderReducer: Reducer<Readonly<State>,Action> = (state=initialState, action: Action) => {
    switch(action.type) {
        case GET_LIST_ORDER_SUCCESSFULL: 
            return {
                ...state,
                listOrder: action.payload.data
            }
        case GET_ORDER_DETAIL_SUCCESS:
            return {
                ...state,
                orderDetail: action.payload.orderDetail
            } 
        default:
            return {
                ...state
            }
    }
}
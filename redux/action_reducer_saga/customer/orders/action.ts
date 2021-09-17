import {action} from 'typesafe-actions'
import {
    GET_LIST_ORDER,
    GET_LIST_ORDER_SUCCESSFULL,
    GET_LIST_ORDER_ERROR,
    GET_ORDER_DETAIL,
    GET_ORDER_DETAIL_SUCCESS,
    GET_ORDER_DETAIL_FAIL
} from '../../../../contants/actions.constants'
import { ListOrderType, OrderDetailType } from '../../../types'

export const actions = {
    getListOrder: () => action(GET_LIST_ORDER, {}),
    getListOrderSuccess: (data: ListOrderType[]) => action(GET_LIST_ORDER_SUCCESSFULL, {data}),
    getOrderDetail: (order_id: string) => action(GET_ORDER_DETAIL, {order_id}),
    getOrderDetailSuccess: (orderDetail: OrderDetailType) => action(GET_ORDER_DETAIL_SUCCESS, {orderDetail})
}
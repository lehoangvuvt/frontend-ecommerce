import {FC, useEffect, useState} from 'react'
import MenuAdmin from '../../../component/MenuAdmin'
import { Typography, Paper, TableContainer, TableHead, Table, TableRow, TableCell, TableBody } from '@material-ui/core'
import { RootReducerType } from '../../../redux/rootReducer'
import {actions as actionsGetListOrder} from '../../../redux/action_reducer_saga/customer/orders/action'
import { useRouter } from 'next/router'
import { connect } from 'react-redux'
import styles from './style.module.css'
import { formatter } from '../../../utils/currency.formatter'
import { ListOrderType } from '../../../redux/types'
import moment from 'moment'

const columns = [
    {id: 'id', name: 'Order ID', minWidth: 100},
    {id: 'date', name: 'Date', minWidth: 100},
    {id: 'shipto', name: 'Ship to', minWidth: 150},
    {id: 'total', name: 'Total', minWidth: 100},
    {id: 'status', name: 'Status', minWidth: 100},
    {id: 'action', name: 'Action', minWidth: 100}
];

const statusLst = [
    "",
    "New", "On Hold", "Processing", "Store assigned", "Cancelled", "In delivery", "Completed", "Closed", "Pick up on hold"
]

const mapStateToProps = (state: RootReducerType) => {
    return {
        listOrder: state.order.listOrder
    }
} 

const mapDispatchToProps = {
    getListOrder: actionsGetListOrder.getListOrder
}

type IndexType =ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;;

const OrderHistory: FC<IndexType> = ({getListOrder, listOrder}) => {
    const router = useRouter();
    const [lstOrder, setLstOrder] = useState<ListOrderType[]>([]);
    useEffect(() => {
        if (!router.isReady) return;
        getListOrder();
    }, [router.isReady])

    useEffect(() => {
        setLstOrder(listOrder);
    },[listOrder])

    return (
        <MenuAdmin>
            <div style={{ width: '70%' }}>
                <Typography variant="h3" className="widget-title">My Orders</Typography>
                {/* <div className="wishlist-container">
                    {
                    }
                </div> */}
                <Paper className={styles.root}>
                    <TableContainer className={styles.container}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {
                                        columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                style={{minWidth: column.minWidth, fontSize: '11px'}}
                                            > 
                                                {column.name}
                                            </TableCell>
                                        ))
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    lstOrder ?
                                    lstOrder.map((order) => (
                                        <TableRow>
                                            <TableCell key={`id-${order.ID}`} style={{minWidth: columns[0].minWidth, fontSize: '11px'}}>#{order.ID}</TableCell>
                                            <TableCell key={`date-${order.CREATED_DATETIME}`} style={{minWidth: columns[1].minWidth, fontSize: '11px'}}>{moment(order.CREATED_DATETIME).format('DD-MM-YYYY')}</TableCell>
                                            <TableCell key={`shipto`} style={{minWidth: columns[2].minWidth, fontSize: '11px'}}>{order.S_STREET_ADDRESS + " " + order.S_DISTRICT}</TableCell>
                                            <TableCell key={`total`} style={{minWidth: columns[3].minWidth, fontSize: '11px'}}>{formatter(order.TRANSACTION_TOTAL_WITH_TAX)}</TableCell>
                                            <TableCell key={`status`} style={{minWidth: columns[4].minWidth, fontSize: '11px'}}>{statusLst[order.STATUS]}</TableCell>
                                            <TableCell key={'action'} style={{minWidth: columns[5].minWidth, fontSize: '11px'}}>
                                                <span>
                                                    <a href={`/customer/orders/${order.ID}`}>View</a>
                                                    {` | `}
                                                    <a href="/">Reorder</a>
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    )) 
                                    :
                                    null
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </div>
        </MenuAdmin>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderHistory)
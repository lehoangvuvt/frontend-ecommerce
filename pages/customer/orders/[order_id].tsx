import MenuAdmin from "../../../component/MenuAdmin";
import { Typography, Paper, Container, CircularProgress, TableContainer, Table, TableHead,TableBody,TableCell,TableRow, Button, Stepper, Step, StepLabel, StepContent } from "@material-ui/core";
import {Timeline,TimelineConnector, TimelineDot, TimelineContent, TimelineItem, TimelineSeparator} from '@material-ui/lab'
import styles from './style.module.css'
import { useEffect } from "react";
import {useRouter} from 'next/router';
import { useState } from "react";
import { RootReducerType } from "../../../redux/rootReducer";
import {connect} from 'react-redux';
import {actions} from '../../../redux/action_reducer_saga/customer/orders/action'
import moment from 'moment'
import { formatter } from '../../../utils/currency.formatter'
import { BrandingWatermarkTwoTone } from "@material-ui/icons";
import { OrderDetailType, OrderHistoryType } from "../../../redux/types";
import { useTranslation } from "react-i18next";

const statusLst = [
    "",
    "New", "On Hold", "Processing", "Store assigned", "Cancelled", "In delivery", "Completed", "Closed", "Pick up on hold"
]

interface lstTimeline {
    statusText?: string,
    note?: string | null,
    createdDate?: Date | null,
    finish?: boolean,
    id?: number
}

const tlHomeDelivery:lstTimeline[]  = [ 
    {
        statusText: "New",
        id: 1,
    }, 
    {
        statusText: "On hold",
        id: 2
    }, 
    {
        statusText: "Processing",
        id: 3
    }, 
    {
        statusText: "Store assigned",
        id: 4
    }, 
    {
        statusText: "In delivery",
        id: 6
    }, 
    {
        statusText: "Completed",
        id: 7
    }
];

const mapDispatchToProps = {
    getOrderDetail: actions.getOrderDetail
}

const mapStateToProps = (state: RootReducerType) => {
    return {
        orderDetailTemp: state.order.orderDetail
    }
}

type ModalType = {
    type?: string;
    orderFromHeader?: OrderDetailType;
}

type IndexType = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & ModalType;


const OrderDetail: React.FC<IndexType> = ({getOrderDetail,orderDetailTemp, type, orderFromHeader }) => {
    const router = useRouter();
    const [orderID, setOrderID] = useState<string>('');
    const [homeTimeLine, setHomeTimeLine] = useState<lstTimeline[]>([]);
    const [activeStep, setActiveStep] = useState<number>(0);
    const [orderDetail, setOrderDetail] = useState<OrderDetailType | null>();
    const { t } = useTranslation();
    // console.log(orderDetail);
    useEffect(() => {   
        if (!router.isReady) return;
        if (type && type === 'header') return;
        const order_id: any = router.query.order_id;
        getOrderDetail(order_id);
        setOrderID(order_id);
    },[router.isReady])

    useEffect(() => {
        setOrderDetail(orderDetailTemp);
    }, [orderDetailTemp])

    useEffect(() => {
        if (type && type === 'header') {
            setOrderID(orderFromHeader && orderFromHeader.ID ? orderFromHeader?.ID.toString() : "")
            setOrderDetail(orderFromHeader);
        }
    }, [orderFromHeader])

    useEffect(() => {
        if (!orderDetail) return;
        let tlLst: lstTimeline[] = tlHomeDelivery;
        let historys: OrderHistoryType[] = orderDetail.historyLines;
        historys.sort((a,b) => {return a.ORDER_STATUS - b.ORDER_STATUS})
        let ind = 0;
        for (let index = 0; index < tlLst.length; index++)
            if (tlLst[index].id === historys[historys.length - 1].ORDER_STATUS) {
                ind = index;
                break;
            }
        setActiveStep(ind);
        for (let index = 0; index < tlLst.length; index++)
            tlLst[index].finish = index <= ind;
        for (let index = 0; index < historys.length; index++)
            for (let j = 0; j < tlLst.length; j++)
                if (historys[index].ORDER_STATUS === tlLst[j].id) {
                    tlLst[j].createdDate = historys[index].CREATED_DATETIME;
                    tlLst[j].note = historys[index].NOTE;
                }
                console.log(tlLst);
        setHomeTimeLine(tlLst);
    }, [orderDetail])

    return (
        <MenuAdmin visibleMenu={type}>
            <div style={{ width: 'auto' }}>
                <Typography variant="h3" className="widget-title title-responsive">{t('check.orderDetail')} #{orderID}</Typography>
                {orderDetail ? <Typography variant="subtitle1" className="title-responsive">{t('check.order')} #{orderID} {t('check.order.date1')} {moment(orderDetail.CREATED_DATETIME).format("DD MMM, YYYY")} {t('check.order.date2')} {statusLst[orderDetail.STATUS]}.</Typography> : null}
                {orderDetail? (
                    <Container className={styles.containerOrder}>
                        <Typography variant="h5" className="widget-title">{t('check.orderitem')}</Typography>
                        <Paper className={`${styles.root} ${styles.paperContainer}`}>
                            <TableContainer className={styles.orderDetailContainer}>
                                <Table >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell key="product" style={{minWidth: '70%'}} className={styles.cellDisplay}>{t('cart.product')}</TableCell>
                                            <TableCell key="total" style={{minWidth:'30%'}} className={styles.cellDisplay} align="right">{t('cart.total')}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            orderDetail.orderItems ? 
                                            (
                                                orderDetail.orderItems.map((item)=> (
                                                    <TableRow>
                                                        <TableCell key="product" className={styles.cellDisplay}>
                                                            <a href={`/products/detail/${item.product.productInformation.PRODUCT_NAME}?psid=${item.product.SID_PRODUCT_INFORMATION}`}>{item.product.productInformation.PRODUCT_NAME} </a>
                                                            x 
                                                            {item.QUANTITY}
                                                        </TableCell>
                                                        <TableCell key="price" align="right" className={styles.cellDisplay}>{formatter(item.product.productInformation.productPrices[0].UNIT_PRICE*item.QUANTITY)}</TableCell>
                                                    </TableRow>
                                                ))
                                            )
                                            : null
                                        }
                                        {/* Shipping Amount */}
                                        <TableRow>
                                            <TableCell key="shippingamt" className={styles.cellDisplay}>{t('checkout.ship')}</TableCell>
                                            <TableCell key="price-shippingamt" align="right" className={styles.cellDisplay}>{formatter(orderDetail.SHIPPING_AMT)}</TableCell>
                                        </TableRow>
                                        {/* Subtotal = all product + shipping amount */}
                                        <TableRow>
                                            <TableCell key="subtotal" className={styles.cellDisplay}>{t('cart.subtotal')}</TableCell>
                                            <TableCell key="price-subtotal" align="right" className={styles.cellDisplay}>{formatter(orderDetail.TRANSACTION_TOTAL_AMT)}</TableCell>
                                        </TableRow>
                                        {/* Tax amt */}
                                        <TableRow>
                                            <TableCell key="taxamt" className={styles.cellDisplay}>{t('order.taxAmount')}</TableCell>
                                            <TableCell key="price-taxamt" align="right" className={styles.cellDisplay}>{formatter(orderDetail.TRANSACTION_TOTAL_TAX_AMT)}</TableCell>
                                        </TableRow>
                                        {/* Total */}
                                        <TableRow>
                                            <TableCell key="taxamt" className={styles.cellDisplay}>{t('checkout.total')}</TableCell>
                                            <TableCell key="price-taxamt" align="right" className={styles.cellDisplay}>{formatter(orderDetail.TRANSACTION_TOTAL_WITH_TAX)}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                        <Button variant="contained" className={styles.cellDisplay}>{t('check.orderAgain')}</Button>
                        <br /> <br/>
                        <Typography variant="h5" className="widget-title">{t('check.orderInfo')}</Typography>
                        <Paper className={`${styles.root} ${styles.paperContainer}`}>
                            <Container className={styles.orderDetailContainer}>
                                <Typography variant="body1">{t('order.customerName')}: {orderDetail.S_FIRST_NAME + " " + orderDetail.S_LAST_NAME}</Typography>
                                <Typography variant="body1">{t('inStore.phone')}: {orderDetail.S_PHONE}</Typography>
                                <Typography variant="body1">{t('inStore.email')}: {orderDetail.EMAIL}</Typography>
                                <Typography variant="body1">{t('order.address')}: {[orderDetail.S_STREET_ADDRESS, orderDetail.S_DISTRICT, orderDetail.S_CITY, orderDetail.S_COUNTRY].join(', ')}</Typography>
                            </Container>
                        </Paper>
                        <br/><br/>
                        <Typography variant="h5" className="widget-title">{t('check.orderStatus')}</Typography>
                        <Paper className={`${styles.root} ${styles.paperContainer}`}>
                            <Container className={styles.orderDetailContainer}>
                                <Stepper className="stepperStyle" alternativeLabel activeStep={activeStep}>
                                    {
                                        homeTimeLine.map((tl, index) => (
                                            <Step key={tl.statusText}>
                                                <StepLabel style={{fontWeight: (index <= activeStep) ? 700: 500}}>{tl.statusText}</StepLabel>
                                                <StepContent>
                                                    <span>{moment(tl.createdDate).format("DD-MM-YYYY")}</span>
                                                    {'\n'}
                                                    <span>{tl.note}</span>
                                                </StepContent>
                                            </Step>
                                        ))
                                    }
                                </Stepper>
                            </Container>
                        </Paper>
                    </Container>
                    ) 
                : 
                (
                    <CircularProgress />
                )
                }
            </div>
        </MenuAdmin>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail);
import {useEffect, useState} from 'react'
import MenuAdmin from '../../../component/MenuAdmin'
import { CircularProgress, LinearProgress, TableContainer, Table, Typography, TableHead, TableRow, TableBody, TableCell, Paper, TablePagination } from '@material-ui/core'
import { useRouter } from 'next/router'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx'
import {formatter} from '../../../utils/currency.formatter'
import moment from 'moment'

interface CustomerLoyaltyLevelDTO {
    DESCRIPTION: string;
    EARN_MULTIPLIER: number;
    HEX_COLOR: string;
    ID: number;
    LOW_RANGE: number;
    NAME: string;
    REDEEM_MULTIPLIER: number;
    UPPER_RANGE: number;
}

interface OrderType {
    ID: number;
    POINT: number;
    CREATED_DATETIME: string;
    REDEEM_POINT: number;
    TRANSACTION_TOTAL_WITH_TAX: number;
}

const YourPoint: React.FC = () => {
    const router = useRouter();
    const [point, setPoint] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [custLoyaltyLevel, setCustLoyaltyLevel] = useState<CustomerLoyaltyLevelDTO>();
    const [listOrder, setListOrder] = useState<OrderType[]>([]);
    const [page, setPage] = useState<number>(0);
    const [rowPerPage, setRowPerPage] = useState<number>(10);
    useEffect(() => {
        async function fetchDataOrder() {
            const response = await axios({
                method: "GET",
                url: "http://localhost:5035/customers/get/point",
                withCredentials: true
            })
            if (response.status === 200) {
                setIsLoading(false);
                setPoint(response.data.POINT);
                setCustLoyaltyLevel(response.data.customerLoyaltyLevel);
                setListOrder(response.data.order);
            }
        }
        if (!router.isReady) return;
        fetchDataOrder();
    }, [router.isReady])

    const normalise = () => {
       if (point && custLoyaltyLevel) {
            return (point - custLoyaltyLevel.LOW_RANGE) / (custLoyaltyLevel.UPPER_RANGE - custLoyaltyLevel.LOW_RANGE) * 100;
       }
       return 0;
    }

    const useStyles = {
        bar: {
            backgroundColor: (custLoyaltyLevel) ? custLoyaltyLevel?.HEX_COLOR : ""
        }
    }

    const handleChangePage = (event: any, newPage: number) => {
        setPage(newPage);   
    }

    const handleChangeRowPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowPerPage(Number(event.target.value))
        setPage(0);
    }

    return (
        <MenuAdmin>
            <div style={{ width: '70%' }}>
                <Typography variant="h3" className="widget-title">My point</Typography>
                <div className="wishlist-container" style={{height: 'auto'}}>
                    {
                        isLoading &&
                        <CircularProgress color="primary" />
                    }
                    {
                        !isLoading && custLoyaltyLevel &&
                        <div>
                            <div className="point-panel">
                                <Typography variant="h5" style={{textAlign: 'center', fontWeight:700 , color: custLoyaltyLevel.HEX_COLOR}}>{custLoyaltyLevel.NAME}</Typography>
                                <Typography variant="body1" style={{textAlign:'center', fontWeight:500}}>{point} Points</Typography>
                                <div style={{padding: '10px 20%'}}>
                                    <LinearProgress variant="determinate" value={normalise()} 
                                        className={clsx(useStyles.bar)}
                                    />
                                </div>
                                <Typography variant="body1" style={{textAlign: 'center'}}>Bạn Còn {custLoyaltyLevel.UPPER_RANGE - point} để lên hạng tiếp theo. Nhanh tay book order để tích lũy thêm điểm nào</Typography>
                            </div>
                        </div>
                    }
                </div>
                <Typography variant="h3" className="widget-title">Accumulate History</Typography>
                <Paper>
                <TableContainer >
                    <Table className="table-information-point">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    #Order ID
                                </TableCell>
                                <TableCell align="center">
                                    Created Date
                                </TableCell>
                                <TableCell align="center">
                                    Total Bill
                                </TableCell>
                                <TableCell align="center">
                                    Used Point
                                </TableCell>
                                <TableCell align="center">
                                    Earn Point
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                listOrder && 
                                listOrder.slice(page*rowPerPage, (page+1)*rowPerPage).map((item) => (
                                    <TableRow>
                                        <TableCell>#{item.ID}</TableCell>
                                        <TableCell align="center">
                                            {moment(item.CREATED_DATETIME).format("DD-MM-YYYY HH:mm:ss")}
                                        </TableCell>
                                        <TableCell align="center">
                                            {formatter(item.TRANSACTION_TOTAL_WITH_TAX)}
                                        </TableCell>
                                        <TableCell align="center" style={{color: 'red'}}>
                                            {item.REDEEM_POINT}
                                        </TableCell>
                                        <TableCell align="center" style={{color: 'green'}}>{Number(item.POINT) + Number(item.REDEEM_POINT)}</TableCell>
                                    </TableRow>
                                ))

                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination 
                    className="table-pagination"
                    count={listOrder.length}
                    rowsPerPageOptions={[10, 20, 30]}
                    rowsPerPage={rowPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowPerPage}
                />
                </Paper>
            </div>
        </MenuAdmin>
    )
}

export default YourPoint
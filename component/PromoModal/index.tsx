import { Paper, Typography, Button, Tabs, Tab, AppBar } from "@material-ui/core";
import { Close } from '@material-ui/icons'
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import { useState, useEffect } from 'react';
import { formatter } from "../../utils/currency.formatter";
import styles from './style.module.css'
import {CouponListType} from '../../redux/types'

type IndexType = {
    setOpenModal: (vari: boolean) => void;
    currentPoint: number |null;
    redeemMultiplier: number|null;
    loyaltyRate: number | null;
    updatePoint: (data: UpdatePointType) => void;
    listCoupon: CouponListType[];
    checkCoupon: (coupon: CouponListType) => number;
    setCoupon: (coupon: CouponListType) => void;
    total: number;
}

interface UpdatePointType {
    type: string;
    targetPoint?: number;
    targetAmount?: number;
}

const PromoModal: React.FC<IndexType> = ({ setOpenModal, currentPoint, redeemMultiplier, loyaltyRate, updatePoint, listCoupon, checkCoupon, setCoupon, total }) => {
    const [type, setType] = useState<string>("1");
    const [value, setValue] = useState<string>("0");
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: string) => {
        setType(newValue);
    }

    const handleSetExchangePoint = (e: any) => {    
        if (e.target.value.length === 0) {
            setValue('0')
            return;
        }
        let target: string = e.target.value;
        while (target[0] === '0')
            target = target.slice(1);
        const t: number = Number(target) * (loyaltyRate ? loyaltyRate : 0) / (redeemMultiplier ? redeemMultiplier : 1);
        if (t > total) {
            setValue(Math.floor(total * (redeemMultiplier ? redeemMultiplier : 0) / (loyaltyRate ? loyaltyRate : 1)).toString());
            return;
        }
        if (!currentPoint) {
            setValue(target)
            return;
        }
        if (parseInt(target) <= currentPoint)
            setValue(target)
        else
            setValue(currentPoint?.toString())
    }

    const handleSave = () => {
        console.log(redeemMultiplier);
        if (type === '2') {
            updatePoint({
                type,
                targetPoint: Number(value),
                targetAmount: (loyaltyRate && redeemMultiplier) ? (Number(value) * loyaltyRate / redeemMultiplier) : undefined
            })
            setOpenModal(false);
        }
        else {
            // console.log(selectedIndex);
            if (selectedIndex === null) return;
            // console.log('check')
            let check = checkCoupon(listCoupon[selectedIndex])
            // console.log(check);
            if (check === 1)  {
                setCoupon(listCoupon[selectedIndex]);
                setOpenModal(false);
            }
        }
        
    }
    return (
        <Paper className="paper">
            <div className="title-modal">
                <div className="heading-modal">
                    <Typography variant="h5">Get Promotion</Typography>

                </div>
                <Button onClick={(e) => setOpenModal(false)}>
                    <Close />
                </Button>
            </div>
            <div className="body-modal">
                <TabContext value={type}>
                    <AppBar position="static">
                        <TabList 
                            onChange={handleChangeTab}  
                            centered 
                            variant="fullWidth" 
                            color="default" 
                            indicatorColor="primary" 
                            className="tab-list"
                            textColor="primary"
                        >
                            <Tab label="Coupon" value="1" />
                            <Tab label="Exchange point" value="2" />
                        </TabList>
                    </AppBar>
                    <TabPanel value="1" style={{height: 'inherit'}}>
                        <div className={styles.couponDiv}>
                            {
                                listCoupon.map((item, index) => (
                                    <div className={`${styles.coupon} ${index === selectedIndex ? styles.couponBorder : ''}`} onClick={() => setSelectedIndex(index)} >
                                        <img src="https://img.vietnamfinance.vn/webp-png/600x391/upload/news/quynhanh/2018/6/20/vnf-coupon.webp" />
                                        <div className={styles.couponInfo}>
                                            <Typography variant="h5">{item.coupon.COUPON_NAME}</Typography>
                                            <Typography variant="body1">{item.coupon.DESCRIPTION}</Typography>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                    </TabPanel>
                    <TabPanel value="2"  style={{textAlign: 'center'}}>
                        <p style={{fontSize: '1.5rem', textAlign: 'center'}}>Bạn còn {currentPoint} điểm</p>
                        <input value={value} onChange={handleSetExchangePoint} style={{textAlign: 'center', fontSize: '1.4rem'}}/>
                        {
                            loyaltyRate && redeemMultiplier &&
                            <p>Số tiền bạn quy đổi là {formatter(Number(value) * loyaltyRate / redeemMultiplier)}</p>
                        }
                    </TabPanel>
                </TabContext>
            </div>
            <div className={styles.footerModal}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSave()}
                >
                    Apply
                </Button>
            </div>
        </Paper>
    )
}

export default PromoModal;
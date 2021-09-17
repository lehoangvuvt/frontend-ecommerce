import { useEffect, useState } from "react";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import CircularProgress from '@material-ui/core/CircularProgress';

import Rating from "@material-ui/lab/Rating";
import validator from 'validator';
import { connect } from 'react-redux';
import cities_data from '../../data/vietnam.json';
import { actions } from "../../redux/action_reducer_saga/checkout/action";
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal'
import { useRouter } from "next/router";
import Autocomplete from '@material-ui/lab/Autocomplete';
import Typography from '@material-ui/core/Typography';
import { RootReducerType } from "../../redux/rootReducer";
import { formatter } from '../../utils/currency.formatter';
import { FC } from "react";
import { CartItemType, DistrictOfCityType, ErrorFieldsType, OrderItemType, StoreType, CouponListType, CouponType, OrderRC, CartInfoType, PaymentMethodType } from "../../redux/types";
import axios from "axios";
import { Button } from "reactstrap";
import PromoModal from "../../component/PromoModal";
import { useTranslation } from "react-i18next";
import { PRISM_URL } from "../../contants/url.constants";

const mapStateToProps = (state: RootReducerType) => {
    return {
        cartInformation: state.global.cartInfo,
        customerInfo: state.global.customer_info,
        shippingInfo: state.checkout.shippingInfo,
        createOrderState: state.checkout.createOrder,
    }
}

const mapDispatchToProps = {
    submitShippingInfo: actions.submitShippingInfo,
    createOrder: actions.createOrder,
}

interface UpdatePointType {
    type: string;
    targetPoint?: number;
    targetAmount?: number;
}

type PickupStorePropsType = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const PickupStore: FC<PickupStorePropsType> = ({ cartInformation, customerInfo, submitShippingInfo, shippingInfo, createOrderState, createOrder }) => {
    const [email, setEmail] = useState('');
    const { isLoading, error, outOfStockItems, order } = createOrderState;
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [cartInfo, setCartInfo] = useState<CartInfoType | null>(null);
    const [shippingType, setShippingType] = useState(0);
    const [paymentType, setPaymentType] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [emailError, setEmailError] = useState('');
    const [firstnameError, setFirstnameError] = useState('');
    const [lastnameError, setLastnameError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [note, setNote] = useState('');
    const router = useRouter();
    const [allStores, setAllStores] = useState<StoreType[]>([]);
    const [isLoadingStores, setIsLoadingStores] = useState(false);
    const [getStoresError, setGetStoreError] = useState('');
    const [chosenStore, setChosenStore] = useState<StoreType | null>(null);
    const [chosenStoreError, setChosenStoreError] = useState<string | boolean>(false);
    const [exchangePoint, setExchangePoint] = useState<number | undefined>(0)
    const [redeemMultiplier, setRedeemMultiplier] = useState<number | null>(null);
    const [redeemAmount, setRedeemAmount] = useState<number | null | undefined>(null);
    const [currentPoint, setCurrentPoint] = useState<number | null>(null);
    const [loyaltyRate, setLoyaltyRate] = useState<number | null>(null);
    const [open, setOpen] = useState(true);
    const [rewardItem, setRewardItem] = useState<CartItemType>();
    const [openModalPromo, setOpenModalPromo] = useState<boolean>(false);
    const [listCoupon, setListCoupon] = useState<CouponListType[]>([]);
    const [couponCurrent, setCouponCurrent] = useState<CouponListType | null>(null);
    const [list, setList] = useState<Array<OrderRC>>([]);
    const [orderTotal, setOrderTotal] = useState<number>(0);
    const [pickupDatetime, setPickupDatetime] = useState('');
    const [paymentMethods, setPaymentMethods] = useState<Array<PaymentMethodType>>([]);
    const [isOpenVerifyModal, setOpenVerifyModal] = useState(false);
    const [isIssueInvoice, setIsIssueInvoice] = useState<boolean>(false);
    const [issueCompanyName, setIssueCompanyName] = useState<string>("");
    const [issueCompanyAddress, setIssueCompanyAddress] = useState<string>("");
    const [issueCompanyTaxNum, setIssueCompanyTaxNum] = useState<string>("");
    const [issueCompanyNameError, setIssueCompanyNameError] = useState<string>("");
    const [issueCompanyAddressError, setIssueCompanyAddressError] = useState<string>("");
    const [issueCompanyTaxNumError, setIssueCompanyTaxNumError] = useState<string>("");
    const { t } = useTranslation();

    useEffect(() => {
        const currentDT = new Date();
        let currentDTString = '';
        currentDTString = `${currentDT.getFullYear()}-${('0' + (currentDT.getMonth() + 1)).slice(-2)}-${('0' + currentDT.getDate()).slice(-2)}T${('0' + currentDT.getHours()).slice(-2)}:${('0' + currentDT.getMinutes()).slice(-2)}`;
        setPickupDatetime(currentDTString);
    }, [])

    useEffect(() => {
        setCartInfo(cartInformation);
    }, [cartInformation])

    useEffect(() => {
        const getAllStores = async () => {
            setIsLoadingStores(true);
            let availableStoreCodes: Array<string> = [];
            if (cartInformation) {
                const getAvailableStoreCodes = cartInformation.items.map(async item => {
                    const qty = item.QUANTITY;
                    const upc = item.product.UPC;
                    const response = await axios({
                        url: `http://localhost:5035/prism/stores-qty/${upc}`,
                        method: "GET",
                        withCredentials: true,
                    })
                    let storesQty: Array<{
                        minqty: number,
                        qty: number,
                        storecode: string,
                    }> = response.data;
                    if (availableStoreCodes.length === 0) {
                        for (let i = 0; i < storesQty.length; i++) {
                            if (storesQty[i].qty - storesQty[i].minqty >= qty) {
                                availableStoreCodes.push(storesQty[i].storecode);
                            }
                        }
                    } else {
                        for (let i = 0; i < storesQty.length; i++) {
                            if (storesQty[i].qty - storesQty[i].minqty >= qty) {
                                if (!availableStoreCodes.includes(storesQty[i].storecode)) {
                                    availableStoreCodes = availableStoreCodes.filter(storeCode => storeCode !== storesQty[i].storecode);
                                } else {
                                    availableStoreCodes.push(storesQty[i].storecode);
                                }
                            } else {
                                if (availableStoreCodes.includes(storesQty[i].storecode)) {
                                    availableStoreCodes = availableStoreCodes.filter(storeCode => storeCode !== storesQty[i].storecode);
                                }
                            }
                        }
                    }
                    return availableStoreCodes;
                });
                await Promise.all(getAvailableStoreCodes);
                const response = await axios({
                    method: 'GET',
                    url: 'http://localhost:5035/stores'
                });
                const data = await response.data;
                if (data.error) {
                    setGetStoreError('');
                    setIsLoadingStores(false);
                } else {
                    setGetStoreError('');
                    const getStores = data.stores.map((store: StoreType, i: number) => {
                        if (availableStoreCodes.includes(store.STORE_CODE)) {
                            setAllStores(oldArray => [...oldArray, store]);
                            if (i === 0) {
                                setChosenStore(store);
                            }
                        }
                    });
                    await Promise.all(getStores);
                    setIsLoadingStores(false);
                }
            }
        }

        async function fetchCoupon() {
            try {
                const response = await axios({
                    method: "GET",
                    url: "http://localhost:5035/customers/coupon",
                    withCredentials: true
                })
                if (response.status === 200) {
                    setListCoupon(response.data)
                }
            }
            catch (ex) {

            }
        }

        const getPoint = async () => {
            const response = await axios({
                method: "POST",
                url: "http://localhost:5035/customers/loyalty/exchange-point",
                withCredentials: true
            })
            if (response.status === 200 && response.data.REDEEM_MULTIPLIER) {
                setRedeemMultiplier(response.data.REDEEM_MULTIPLIER)
                setCurrentPoint(response.data.CURRENT_POINT);
                setLoyaltyRate(response.data.LOYALTY_RATE);
            }
        }

        getAllStores();
        getPoint();
        fetchCoupon();
    }, [])
    // console.log(cartInfo);

    useEffect(() => {
        if (cartInfo && cartInfo.itemReward && cartInfo.itemReward.length > 0) {
            let temp: CartItemType = {
                CART_SID: "",
                CREATED_DATETIME: "",
                MODIFIED_DATETIME: "",
                QUANTITY: 1,
                SID_PRODUCT: cartInfo.itemReward[0].SID,
                product: cartInfo.itemReward[0],
                PROMO_NAME: cartInfo.itemReward[0].PROMO_NAME
            }
            temp.product.PRODUCT_NAME = `${cartInfo.itemReward[0].productInformation.PRODUCT_NAME} - ${cartInfo.itemReward[0].productAttributeGroup.GROUP_VALUE_VARCHAR}, ${cartInfo.itemReward[0].productAttributeGroup.productAttributeValues[0].VALUE_VARCHAR}`;
            setRewardItem(temp)
        }
        if (cartInfo) {
            let cartInfoTemp: CartInfoType = cartInfo;
            let subtotal: number = cartInfo.SUB_TOTAL;
            for (let i: number = 0; i < cartInfoTemp.discountTransaction.length; i++)
                if (cartInfoTemp.discountTransaction[i].disc_type === 1) {
                    let disc = Number(cartInfoTemp.discountTransaction[i].disc_Value);
                    cartInfoTemp.discountTransaction[i].real_value = disc;
                    subtotal -= disc;
                }
                else {
                    let disc: number = (subtotal * Number(cartInfoTemp.discountTransaction[i].disc_Value) / 100);
                    cartInfoTemp.discountTransaction[i].real_value = disc;
                    subtotal -= disc;
                }
            setOrderTotal(subtotal);
            setCartInfo(cartInfoTemp);
        }
    }, [cartInfo])

    useEffect(() => {
        if (customerInfo) {
            setEmail(customerInfo.EMAIL);
            setFirstName(customerInfo.FIRST_NAME);
            setLastName(customerInfo.LAST_NAME);
        }
        if (cartInfo) {
            setTotalItems(cartInfo.TOTAL_ITEMS);
        }
    }, [customerInfo])

    useEffect(() => {

        const getProductsRC = async () => {
            try {

                let url = `http://localhost:5035/products/getProductIndex`;
                const response = await axios({
                    url,
                    method: 'GET',
                });
                const dtproduct = await response.data;

                if (dtproduct.details.productPromo.length > 0) {
                    setList(dtproduct.details.productPromo);
                }
                else {
                    setList(dtproduct.details.product);
                }

            }
            catch (ex) {
            }

        }
        getProductsRC();

    }, [])
    const viewDetails = (name: string, sid: string) => {
        window.location.href = `/products/detail/${name}?psid=${sid}`;
    };

    const attributeAndSize = (name: string) => {
        const splitFirst = name.split(' - ')[1];
        const splitSecond = splitFirst.split(',');
        return {
            ATTRIBUTE: splitSecond[0].trim(),
            ITEMSIZE: splitSecond[1].trim()
        }
    }

    const openVerifyModal = () => {
        setOpenVerifyModal(true);
    }

    const submit = () => {
        if (validateField()) {
            if (chosenStore) {
                let items: OrderItemType[];
                let discountAmt: number = 0;
                items = [];
                if (cartInfo) {
                    cartInfo.items.map(item => {
                        items.push({
                            SID_PRODUCT: item.SID_PRODUCT,
                            QUANTITY: item.QUANTITY,
                            PRODUCT_NAME: item.product.PRODUCT_NAME,
                            HAVE_PROMO: 0,
                            PRICE: (item.product.PRICE ? (item.product.PRICE - (item.product.DISC_VALUE ? item.product.PRICE * item.product.DISC_VALUE / 100 : 0)) : 0),
                            ORIG_PRICE: item.product.PRICE,
                            PROMO_NAME: item.product.PROMO_NAME ? item.product.PROMO_NAME : "",
                            ...attributeAndSize(item.product.PRODUCT_NAME)
                        });
                    })
                    cartInfo.discountTransaction.map((disc) => discountAmt = discountAmt + disc.real_value);
                    if (rewardItem) {
                        items.push({
                            SID_PRODUCT: rewardItem?.SID_PRODUCT,
                            QUANTITY: 1,
                            HAVE_PROMO: 1,
                            PRICE: 0,
                            PRODUCT_NAME: rewardItem?.product.PRODUCT_NAME,
                            PROMO_NAME: rewardItem.PROMO_NAME ? rewardItem.PROMO_NAME : "",
                            ORIG_PRICE: Number(rewardItem.product.productInformation.productPrices[0].UNIT_PRICE) + Number(rewardItem.product.productInformation.productPrices[0].TAX),
                            ...attributeAndSize(rewardItem?.product.PRODUCT_NAME)
                        })
                    }

                }
                let PROMO_NAME = cartInfo?.discountTransaction && cartInfo.discountTransaction.length > 0 ? cartInfo.discountTransaction[0].PROMO_NAME : "";
                let shippingInfo: any = {
                    STATUS: 1,
                    ITEMS: items,
                    EMAIL: email,
                    S_FIRST_NAME: firstName,
                    S_LAST_NAME: lastName,
                    S_STREET_ADDRESS: chosenStore.ADDRESS,
                    S_COUNTRY: 'vietnam',
                    S_CITY: chosenStore.CITY,
                    S_DISTRICT: chosenStore.DISTRICT,
                    S_PHONE: phone,
                    ORDER_TYPE: 1,
                    S_TYPE: shippingType,
                    P_TYPE: paymentType,
                    DISC_AMT: discountAmt,
                    REDEEM_POINT: exchangePoint,
                    REDEEM_AMOUNT: redeemAmount,
                    PROMO_NAME,
                    STORE_ID: chosenStore.STORE_ID,
                    PICKUP_DATETIME: pickupDatetime,
                    PAYMENT_METHOD: paymentType,
                    COUPON_SID: (couponCurrent) ? couponCurrent?.SID_COUPON : null,
                    COUPON_VALUE: couponCurrent && cartInfo ? parseInt(couponCurrent.coupon.REWARD_DISCOUNT_TYPE.toString()) === 1 ? couponCurrent.coupon.REWARD_DISCOUNT_VALUE
                        : Number(couponCurrent.coupon.REWARD_DISCOUNT_VALUE / 100) * cartInfo.SUB_TOTAL : 0,
                    IS_ISSUE_INVOICE: (isIssueInvoice) ? 1 : 0,
                    ISSUE_COMPANY_NAME: issueCompanyName,
                    ISSUE_COMPANY_ADDRESS: issueCompanyAddress,
                    ISSUE_COMPANY_TAX_NUMBER: issueCompanyTaxNum
                };
                if (note.trim() !== '' && note !== '') {
                    shippingInfo.NOTE = note;
                }
                createOrder(shippingInfo);
            } else {
                window.scrollTo({ left: 0, top: 450, behavior: 'smooth' });
            }
        } else {
            setErrors();
            window.scrollTo({ left: 0, top: 450, behavior: 'smooth' });
        }
        setOpenVerifyModal(false);
    }

    function validateField() {
        let isValidate = true;
        if (validator.isEmpty(email.trim()) || !validator.isEmail(email.trim())
            || validator.isEmpty(firstName.trim()) || validator.isEmpty(lastName.trim())
            || chosenStore === null || validator.isEmpty(phone.trim())
            || !validator.isMobilePhone(phone.trim(), 'vi-VN')
            || (isIssueInvoice && (validator.isEmpty(issueCompanyName.trim()) || validator.isEmpty(issueCompanyAddress.trim()) || validator.isEmpty(issueCompanyTaxNum.trim())))
        ) {
            setErrors();
            isValidate = false;
        } else {
            setErrors();
            isValidate = true;
        }
        return isValidate;
    }

    function setErrors() {
        if (validator.isEmpty(email.trim())) {
            setEmailError('Email cannot be empty');
        } else {
            if (!validator.isEmail(email.trim())) {
                setEmailError('Incorrect email format');
            } else {
                setEmailError('');
            }
        }

        if (validator.isEmpty(firstName.trim())) {
            setFirstnameError('First name cannot be empty');
        } else {
            setFirstnameError('');
        }

        if (validator.isEmpty(lastName.trim())) {
            setLastnameError('Last name cannot be empty');
        } else {
            setLastnameError('');
        }

        if (validator.isEmpty(phone.trim())) {
            setPhoneError('Phone cannot be empty');
        } else {
            if (!validator.isMobilePhone(phone.trim(), 'vi-VN')) {
                setPhoneError('Incorrect phone number');
            } else {
                setPhoneError('');
            }
        }

        if (isIssueInvoice) {
            if (validator.isEmpty(issueCompanyName.trim()))
                setIssueCompanyNameError('Company name cannot be empty');
            else
                setIssueCompanyNameError('');

            if (validator.isEmpty(issueCompanyAddress.trim()))
                setIssueCompanyAddressError('Company address cannot be empty');
            else
                setIssueCompanyAddressError('');

            if (validator.isEmpty(issueCompanyTaxNum.trim()))
                setIssueCompanyTaxNumError('Company identifical number cannot be empty');
            else
                setIssueCompanyTaxNumError('');
        }

        if (chosenStore === null) {
            setChosenStoreError('Please choose a store to pick up your order');
        } else {
            setChosenStoreError(false);
        }
    }

    const handleClick = () => {
        setOpen(!open);
    };

    function redirect(path: string) {
        router.push(path);
    }

    const updatePoint = (data: UpdatePointType) => {
        if (data.type === '2') {
            setExchangePoint(data.targetPoint)
            setRedeemAmount(data.targetAmount)
        }
    }

    const handleModal = (vari: boolean) => {
        setOpenModalPromo(vari);
    }

    const checkCoupon = (coupon: CouponListType): number => {
        let cp: CouponType = coupon.coupon;
        if (cp.ACTIVE && (!cp.APPLY_COUNT || (cp.APPLY_COUNT && cp.APPLY_COUNT > 0))) {
            return 1
        }
        else return 0;
    }

    const setCoupon = (coupon: CouponListType) => {
        setCouponCurrent(coupon);
    }

    const getMinDateTime = () => {
        const currentDT = new Date();
        const currentDTString = `${currentDT.getFullYear()}-${('0' + (currentDT.getMonth() + 1)).slice(-2)}-${('0' + currentDT.getDate()).slice(-2)}T${('0' + currentDT.getHours()).slice(-2)}:${('0' + currentDT.getMinutes()).slice(-2)}`;
        return currentDTString;
    }

    useEffect(() => {
        const getAllPaymentMethods = async () => {
            const response = await axios({
                url: "http://localhost:5035/payment/payment-methods/get-all",
                method: "GET",
                withCredentials: true
            })
            const data = response.data;
            setPaymentMethods(data.paymentMethods);

        }
        getAllPaymentMethods();
    }, [])

    return (
        <div style={{
            width: '100%',
            minHeight: '225px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            {
                !isLoadingStores ?
                    <>
                        <main className="main">
                            <div className="container mb-6">
                                <div className="row">
                                    <div className="col-lg-8">
                                        <ul className="checkout-steps">
                                            <li>
                                                <h2
                                                    style={{ border: 'none' }}
                                                    className="step-title">2. {t('inStore.store')}</h2>

                                                <form action="#">
                                                    <div className="form-group required-field">
                                                        <label>{t('inStore.storePick')} </label>
                                                        <Autocomplete
                                                            renderOption={(option) => (
                                                                <Typography
                                                                    style={{ fontSize: "1.5rem" }}>
                                                                    {option.NAME + ' - ' + option.ADDRESS + ', ' + option.DISTRICT + ', ' + option.CITY}</Typography>
                                                            )}
                                                            id="combo-box-store"
                                                            value={chosenStore}
                                                            onChange={(event: any, newValue: StoreType | null) => {
                                                                setChosenStore(newValue);
                                                            }}
                                                            options={allStores}
                                                            getOptionLabel={(option) => option.NAME + ' - ' + option.ADDRESS + ', ' + option.DISTRICT + ', ' + option.CITY}
                                                            style={{ width: 300 }}
                                                            renderInput={(params) => <TextField {...params} size="medium" label="" variant="outlined" />}
                                                        />
                                                        <p
                                                            style={{
                                                                color: '#e74c3c',
                                                                fontSize: '1.25rem',
                                                            }}
                                                        >{chosenStoreError ? chosenStoreError : null}</p>
                                                    </div>

                                                    <div className="form-group required-field">
                                                        <label>{t('inStore.datetime')}</label>
                                                        <TextField
                                                            style={{
                                                                width: '100%',
                                                            }}
                                                            id="date"
                                                            label=""
                                                            type="datetime-local"
                                                            InputProps={{ inputProps: { min: getMinDateTime() } }}
                                                            value={pickupDatetime}
                                                            onChange={(e) => { setPickupDatetime(e.target.value.toString()) }}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="form-group required-field">
                                                        <label>{t('inStore.email')} </label>
                                                        <input
                                                            style={{ border: emailError !== '' ? '1px solid #e74c3c' : '1px solid #ced4da' }}
                                                            value={email}
                                                            onChange={(e) => { setEmail(e.target.value) }}
                                                            type="email" className="form-control" required />
                                                        <p
                                                            style={{
                                                                color: '#e74c3c',
                                                                fontSize: '1.25rem',
                                                            }}
                                                        >{emailError !== '' ? emailError : null}</p>
                                                    </div>

                                                    <div className="form-group required-field">
                                                        <label>{t('inStore.firtName')}</label>
                                                        <input
                                                            style={{ border: firstnameError !== '' ? '1px solid #e74c3c' : '1px solid #ced4da' }}
                                                            value={firstName}
                                                            onChange={(e) => { setFirstName(e.target.value) }}
                                                            type="text" className="form-control" required />
                                                        <p
                                                            style={{
                                                                color: '#e74c3c',
                                                                fontSize: '1.25rem',
                                                            }}
                                                        >{firstnameError !== '' ? firstnameError : null}</p>
                                                    </div>

                                                    <div className="form-group required-field">
                                                        <label>{t('inStore.lastName')}</label>
                                                        <input
                                                            style={{ border: lastnameError !== '' ? '1px solid #e74c3c' : '1px solid #ced4da' }}
                                                            value={lastName}
                                                            onChange={(e) => { setLastName(e.target.value) }}
                                                            type="text" className="form-control" required />
                                                        <p
                                                            style={{
                                                                color: '#e74c3c',
                                                                fontSize: '1.25rem',
                                                            }}
                                                        >{lastnameError !== '' ? lastnameError : null}</p>
                                                    </div>
                                                    {/* 
                                        <div className="form-group">
                                            <label>Company </label>
                                            <input
                                                value={company}
                                                onChange={(e) => { setCompany(e.target.value) }}
                                                type="text" className="form-control" />
                                        </div> */}

                                                    {/* <div className="form-group">
                                            <label>Country</label>
                                            <div className="select-custom">
                                                <select
                                                    value={country}
                                                    onChange={(e) => { setCountry(e.target.value) }}
                                                    className="form-control">
                                                    <option value="vietnam">Vietnam</option>
                                                    <option value="usa">USA</option>
                                                </select>
                                            </div>
                                        </div> */}

                                                    {/* <div className="form-group required-field">
                                            <label>Zip/Postal Code </label>
                                            <input
                                                value={zipCode}
                                                onChange={(e) => { setZipCode(e.target.value) }}
                                                type="text" className="form-control" required />
                                        </div> */}

                                                    <div className="form-group required-field">
                                                        <label>{t('inStore.phone')}</label>
                                                        <input
                                                            style={{ border: phoneError !== '' ? '1px solid #e74c3c' : '1px solid #ced4da' }}
                                                            value={phone}
                                                            onChange={(e) => { setPhone(e.target.value) }}
                                                            type="text"
                                                            className="form-control" required />
                                                        <p
                                                            style={{
                                                                color: '#e74c3c',
                                                                fontSize: '1.25rem',
                                                            }}
                                                        >{phoneError !== '' ? phoneError : null}</p>
                                                    </div>

                                                    <div className="form-group">
                                                        <label>{t('inStore.note')} </label>
                                                        <input
                                                            value={note}
                                                            onChange={(e) => { setNote(e.target.value) }}
                                                            type="text"
                                                            className="form-control" />
                                                    </div>
                                                    <div className="form-group" style={{ display: 'inline-flex' }}>
                                                        <input
                                                            checked={isIssueInvoice}
                                                            type="checkbox"
                                                            onChange={(e) => setIsIssueInvoice(e.target.checked)}
                                                            style={{ marginRight: '1rem' }}
                                                        />
                                                        <label>{t('checkout.issueInvoice')}</label>
                                                    </div>
                                                    {
                                                        isIssueInvoice && (
                                                            <div>
                                                                <div className="form-group required-field">
                                                                    <label>{t('checkout.companyName')} </label>
                                                                    <input
                                                                        style={{ border: issueCompanyNameError !== '' ? '1px solid #e74c3c' : '1px solid #ced4da' }}
                                                                        value={issueCompanyName}
                                                                        onChange={(e) => { setIssueCompanyName(e.target.value) }}
                                                                        type="text"
                                                                        className="form-control"
                                                                    />
                                                                    <p
                                                                        style={{
                                                                            color: '#e74c3c',
                                                                            fontSize: '1.25rem',
                                                                        }}
                                                                    >{issueCompanyNameError !== '' ? issueCompanyNameError : null}</p>
                                                                </div>
                                                                <div className="form-group required-field">
                                                                    <label>{t('checkout.companyAddress')} </label>
                                                                    <input
                                                                        style={{ border: issueCompanyAddressError !== '' ? '1px solid #e74c3c' : '1px solid #ced4da' }}
                                                                        value={issueCompanyAddress}
                                                                        onChange={(e) => { setIssueCompanyAddress(e.target.value) }}
                                                                        type="text"
                                                                        className="form-control"
                                                                    />
                                                                    <p
                                                                        style={{
                                                                            color: '#e74c3c',
                                                                            fontSize: '1.25rem',
                                                                        }}
                                                                    >{issueCompanyAddressError !== '' ? issueCompanyAddressError : null}</p>
                                                                </div>
                                                                <div className="form-group required-field">
                                                                    <label>{t('checkout.companyTaxNumber')} </label>
                                                                    <input
                                                                        style={{ border: issueCompanyTaxNumError !== '' ? '1px solid #e74c3c' : '1px solid #ced4da' }}
                                                                        value={issueCompanyTaxNum}
                                                                        onChange={(e) => { setIssueCompanyTaxNum(e.target.value) }}
                                                                        type="text"
                                                                        className="form-control"
                                                                    />
                                                                    <p
                                                                        style={{
                                                                            color: '#e74c3c',
                                                                            fontSize: '1.25rem',
                                                                        }}
                                                                    >{issueCompanyTaxNumError !== '' ? issueCompanyTaxNumError : null}</p>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                </form>
                                            </li>

                                            <li>
                                                <div className="checkout-step-shipping">
                                                    <h2
                                                        style={{ border: 'none', marginBottom: '10px' }}
                                                        className="step-title">3. {t('inStore.promotion')}:</h2>
                                                    <Button className="btn-promo" onClick={() => setOpenModalPromo(true)}>
                                                        {t('inStore.getPromo')}
                                                    </Button>
                                                </div>
                                            </li>

                                            <li>
                                                <div className="checkout-step-shipping">
                                                    <h2
                                                        style={{ border: 'none', marginBottom: '10px' }}
                                                        className="step-title">4. {t('inStore.payOption')}:</h2>

                                                    <table className="table table-step-shipping">
                                                        <tbody className="table table-step-shipping__tbody">
                                                            {
                                                                paymentMethods.length > 0 ?
                                                                    paymentMethods.filter(payment => payment.ID !== 2).map(payment =>

                                                                        <tr
                                                                            onClick={() => {
                                                                                setPaymentType(payment.ID);
                                                                            }}
                                                                            className={paymentType === payment.ID ? 'option-type option-type--active' : 'option-type'}
                                                                        >
                                                                            <td
                                                                                style={{
                                                                                    border: 'none',
                                                                                    height: '60px',
                                                                                    width: '7%',
                                                                                    display: 'flex',
                                                                                    alignItems: 'center'
                                                                                }}
                                                                            >
                                                                                <input
                                                                                    type="radio"
                                                                                    name="payment-method"
                                                                                    value={payment.ID}
                                                                                    checked={paymentType === payment.ID ? true : false}
                                                                                    onChange={(e) => { setPaymentType(parseInt(e.target.value)) }}
                                                                                />
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: 'none',
                                                                                    display: 'flex',
                                                                                    flexFlow: 'row warp',
                                                                                    height: '60px',
                                                                                    width: '93%',
                                                                                    alignItems: 'center',
                                                                                }}
                                                                            >
                                                                                <img
                                                                                    style={{
                                                                                        width: "8%",
                                                                                        height: '40px',
                                                                                        marginRight: '15px'
                                                                                    }}
                                                                                    src={payment.ICON_URL} />
                                                                                {payment.PAYMENT_DESCRIPTION}
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                    : null
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="col-lg-4">
                                        <List
                                            component="nav"
                                            aria-labelledby="nested-list"
                                            className='shipping-address-summary'
                                        >
                                            <ListItem>
                                                <ListItemText primary={t('checkout.summary')} />
                                            </ListItem>
                                            <ListItem className='shipping-address-summary__name'>
                                                {firstName} {lastName}
                                            </ListItem>
                                            <ListItem className='shipping-address-summary__phone'>
                                                {t('inStore.phone')}: {phone}
                                            </ListItem>
                                            {chosenStore ?
                                                <ListItem className='shipping-address-summary__address'>
                                                    {t('inStore.storeAdd')}: {chosenStore.NAME}, {chosenStore.ADDRESS}, {t('address.district')} {chosenStore.DISTRICT}, {chosenStore.CITY} {t('address.city')}
                                                </ListItem>
                                                : null}
                                        </List>
                                        <List
                                            component="nav"
                                            aria-labelledby="nested-list-subheader"
                                            className='products-list'
                                        >
                                            <ListItem button onClick={handleClick}>
                                                <ListItemText primary={t('checkout.item')} />
                                                {open ? <ExpandLess /> : <ExpandMore />}
                                            </ListItem>
                                            <Collapse in={open} timeout="auto" unmountOnExit>
                                                <List
                                                    className='products-list__items-container'
                                                    component="div" disablePadding>
                                                    {cartInfo ?
                                                        cartInfo.items.map(item =>
                                                            <ListItem
                                                                onClick={() => {
                                                                    router.push(`products/detail/${item.product.PRODUCT_NAME}?psid=${item.SID_PRODUCT}`);
                                                                }}
                                                                className='products-list__items-container__item' button>
                                                                <div className='products-list__items-container__item__left'>
                                                                    {item.QUANTITY}x
                                                                </div>
                                                                <div className='products-list__items-container__item__center'>
                                                                    {item.product.PRODUCT_NAME}
                                                                </div>
                                                                <div className='products-list__items-container__item__right'>
                                                                    {formatter(item.QUANTITY * (((Number(item.product.TAX) + Number(item.product.PRICE)) * (1 - Number(item.product.DISC_VALUE ? item.product.DISC_VALUE / 100 : 0)))))}
                                                                </div>
                                                            </ListItem>
                                                        ) : null}
                                                    {
                                                        rewardItem &&
                                                        <ListItem
                                                            onClick={() => {
                                                                router.push(`products/detail/${rewardItem.product.PRODUCT_NAME}?psid=${rewardItem.SID_PRODUCT}`);
                                                            }}
                                                            className='products-list__items-container__item' button>
                                                            <div className='products-list__items-container__item__left'>
                                                                {rewardItem.QUANTITY}x
                                                            </div>
                                                            <div className='products-list__items-container__item__center'>
                                                                {rewardItem.product.PRODUCT_NAME}
                                                            </div>
                                                            <div className='products-list__items-container__item__right'>
                                                                {formatter(rewardItem.product.PRICE ? rewardItem.product.PRICE : 0)}
                                                            </div>
                                                        </ListItem>
                                                    }
                                                </List>
                                            </Collapse>
                                            {cartInfo ?
                                                <div className='products-list__footer'>
                                                    <ListItem className='products-list__footer__row'>
                                                        <div
                                                            className='products-list__footer__row__left'>
                                                            {t('checkout.subtotal')}
                                                        </div>
                                                        <div className='products-list__footer__row__center'>

                                                        </div>
                                                        <div className='products-list__footer__row__right'>
                                                            {formatter(cartInfo.SUB_TOTAL)}
                                                        </div>
                                                    </ListItem>
                                                    <ListItem className='products-list__footer__row'>
                                                        <div
                                                            className='products-list__footer__row__left'>
                                                            {t('checkout.ship')}
                                                        </div>
                                                        <div className='products-list__footer__row__center'>

                                                        </div>
                                                        <div className='products-list__footer__row__right'>
                                                            {formatter(0)}
                                                        </div>
                                                    </ListItem>
                                                </div>
                                                : null}
                                            {cartInfo ?
                                                <div className='products-list__total'>
                                                    {
                                                        (redeemMultiplier) &&
                                                        <ListItem className='products-list__total__row'>
                                                            <div
                                                                className='products-list__footer__row__left'>
                                                                {t('promo.exchange')} ({exchangePoint} {t('promo.point')}
)
                                                            </div>
                                                            <div className='products-list__total__row__center'>

                                                            </div>
                                                            <div className='products-list__footer__row__right'>
                                                                {formatter(redeemAmount ? redeemAmount : 0)}
                                                            </div>
                                                        </ListItem>
                                                    }
                                                    {
                                                        cartInfo.discountTransaction.map(discTransaction => (
                                                            <ListItem className='products-list__total__row'>
                                                                <div
                                                                    className='products-list__footer__row__left'>
                                                                    {`Discount (${discTransaction.PROMO_NAME})`}
                                                                </div>
                                                                <div className='products-list__total__row__center'>

                                                                </div>
                                                                <div className='products-list__footer__row__right'>
                                                                    -{formatter(discTransaction.real_value)}
                                                                </div>
                                                            </ListItem>
                                                        ))
                                                    }

                                                    {/* <ListItem className='products-list__total__row'>
                                            <div
                                                className='products-list__footer__row__left'>
                                                Tax
                                            </div>
                                            <div className='products-list__total__row__center'>

                                            </div>
                                            <div className='products-list__footer__row__right'>
                                                {formatter(cartInfo.TAX_PRICE)}
                                            </div>
                                        </ListItem> */}
                                                    {
                                                        couponCurrent &&
                                                        <ListItem className='products-list__total__row'>
                                                            <div
                                                                className='products-list__footer__row__left'>
                                                                {`Coupon (${couponCurrent.coupon.COUPON_NAME})`}
                                                            </div>
                                                            <div className='products-list__total__row__center'>

                                                            </div>
                                                            <div className='products-list__footer__row__right'>
                                                                -{formatter(parseInt(couponCurrent.coupon.REWARD_DISCOUNT_TYPE.toString()) === 1 ? couponCurrent.coupon.REWARD_DISCOUNT_VALUE
                                                                    : Number(couponCurrent.coupon.REWARD_DISCOUNT_VALUE / 100) * cartInfo.SUB_TOTAL)}
                                                            </div>
                                                        </ListItem>
                                                    }

                                                    <ListItem className='products-list__total__row'>
                                                        <div
                                                            className='products-list__total__row__left'>
                                                            {t('checkout.total')}
                                                        </div>
                                                        <div className='products-list__total__row__center'>

                                                        </div>
                                                        <div className='products-list__total__row__right'>
                                                            {formatter(orderTotal - (redeemAmount ? redeemAmount : 0) -
                                                                (couponCurrent ? parseInt(couponCurrent.coupon.REWARD_DISCOUNT_TYPE.toString()) === 1 ? couponCurrent.coupon.REWARD_DISCOUNT_VALUE
                                                                    : Number(couponCurrent.coupon.REWARD_DISCOUNT_VALUE / 100) * cartInfo.SUB_TOTAL : 0)
                                                            )}
                                                        </div>
                                                    </ListItem>

                                                </div>
                                                : null}
                                        </List>
                                    </div>
                                </div>
                                <div className="col-lg-8">
                                    <div
                                        className="checkout-steps-action">
                                        <button onClick={() => {
                                            openVerifyModal()
                                        }}
                                            id='submit-btn'
                                        >{t('inStore.order')}</button>
                                        <p>{t('inStore.orderNote')}</p>
                                    </div>
                                </div>
                            </div>
                            {!isLoading && order ?
                                <div id="message-container" >
                                    <div
                                        style={{ borderLeftColor: '#3f51b5' }}
                                        id="message-modal">
                                        <img src="https://www.pngitem.com/pimgs/m/341-3416354_blue-tick-icon-success-icon-png-transparent-png.png" />
                                        {t('checkout.success')}
                                        <button
                                            onClick={() => {
                                                redirect('/');
                                            }}
                                        >
                                            <i className="fa fa-arrow-left"></i> {t('checkout.back')}
                                        </button>
                                        <h2 style={{ textAlign: 'center', fontWeight: 700, paddingBottom: '10px' }}>HOT DEAL!</h2>
                                        <h2 style={{ textAlign: 'center', fontWeight: 700, paddingBottom: '10px' }}>Hot deal!</h2>
                                        <div className="homepage-container__products-container">
                                            <div style={{ display: 'flex', flexFlow: 'row wrap', width: '85%', }} >
                                                {list && list.length > 0 ? list.map(product =>

                                                    <ul style={{ width: '20%' }}  >
                                                        <div className='homepage-container__products-container__right__products-container__item'>
                                                            <li  >
                                                                <div className='homepage-container__products-container__right__products-container' onClick={() => { viewDetails(product.PRODUCT_NAME, product.SID) }}  >

                                                                    <div className='homepage-container__products-container__right__products-container__item__top'>
                                                                        {
                                                                            (product.DISC_VALUE > 0) &&
                                                                            <span>
                                                                                -{product.DISC_VALUE}%
                                                                            </span>
                                                                        }
                                                                        <img src={
                                                                            product.PRISM_URL ?
                                                                                `${PRISM_URL}/images/${product.PRISM_URL}` :
                                                                                `http://localhost:5035/products/image/${product.IMAGE_NAME}`
                                                                        } />
                                                                    </div>
                                                                    <div style={{ display: 'block', flexFlow: 'row wrap' }} className='products-container__right__products-container__item__bottom'>
                                                                        {/* <div className='homepage-container__products-container__right__products-container__item__bottom__top'>
												<div className='homepage-container__products-container__right__products-container__item__bottom__top__left'>
													<p>{product.CATEGORY_NAME}</p>
												</div>
											</div> */}
                                                                        <div className='homepage-container__products-container__right__products-container__item__bottom__middle'>
                                                                            <p>{product.PRODUCT_NAME}</p>
                                                                        </div>
                                                                        <div className='homepage-container__products-container__right__products-container__item__bottom__bottom'>
                                                                            <Rating
                                                                                name="simple-controlled"
                                                                                value={4}
                                                                                readOnly
                                                                                size='medium'
                                                                            />
                                                                        </div>

                                                                        <div className='homepage-container__products-container__right__products-container__item__bottom__price'>

                                                                            <p>{formatter(product.UNIT_PRICE - (product.UNIT_PRICE * product.DISC_VALUE / 100))}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        </div >
                                                    </ul>
                                                ) : null}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                : null
                            }
                            {!isLoading && error ?
                                <div id="message-container">
                                    <div
                                        style={{ borderLeftColor: '#e74c3c' }}
                                        id="message-modal">
                                        <img src='https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-error-icon.png' />
                                        {/* {error} */} {t('checkout.error')}
                                        <button
                                            onClick={() => {
                                                redirect('/cart');
                                            }}
                                        >
                                            <i className="fa fa-arrow-left"></i> {t('checkout.backCart')}
                                        </button>
                                    </div>
                                </div>
                                : null
                            }
                            {isLoading ?
                                <div id="message-modal">
                                    Loading
                                </div>
                                : null
                            }
                        </main >
                        <Modal open={openModalPromo} className="modal-paper">
                            <PromoModal
                                setOpenModal={setOpenModalPromo}
                                currentPoint={currentPoint}
                                redeemMultiplier={redeemMultiplier}
                                loyaltyRate={loyaltyRate}
                                updatePoint={updatePoint}
                                listCoupon={listCoupon}
                                checkCoupon={checkCoupon}
                                setCoupon={setCoupon}
                                total={orderTotal}
                            />
                        </Modal>

                        {
                            isOpenVerifyModal ?
                                <div className="verify-modal">
                                    <div className="verify-modal__top">
                                        <h1>Xác nhận thông tin đơn hàng</h1>
                                        <p>
                                            Nếu đã kiểm tra lại và chắc chắn các thông tin bạn vừa nhập là
                                            chính xác, hãy nhấn chọn Xác nhận để tiến hàng tạo đơn hàng. Nhấn
                                            chọn Quay lại để kiểm tra lại thông tin đơn hàng
                                        </p>
                                    </div>
                                    <div className="verify-modal__bottom">
                                        <button
                                            onClick={() => {
                                                submit();
                                            }}
                                        >Xác nhận</button>
                                        <button
                                            onClick={() => {
                                                setOpenVerifyModal(false);
                                            }}
                                        >Quay lại</button>
                                    </div>
                                </div>
                                :
                                null
                        }
                    </>
                    :
                    <CircularProgress />
            }
        </div >
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(PickupStore);

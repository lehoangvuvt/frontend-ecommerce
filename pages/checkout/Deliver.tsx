import { useEffect, useState } from "react";
import validator from 'validator';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Button } from "reactstrap";
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Rating from "@material-ui/lab/Rating";
import { connect } from 'react-redux';
import Modal from '@material-ui/core/Modal'
import cities_data from '../../data/vietnam.json';
import { actions } from "../../redux/action_reducer_saga/checkout/action";
import { useRouter } from "next/router";
import { RootReducerType } from "../../redux/rootReducer";
import { formatter } from '../../utils/currency.formatter';
import { FC } from "react";
import {
    DistrictOfCityType,
    ErrorFieldsType,
    OrderItemType,
    OrderRC,
    CartItemType,
    CartInfoType,
    PaymentMethodType,
    ShippingMethodType,
    CouponListType,
    CouponType,
    CustomerAddressType
} from "../../redux/types";
import axios from "axios";
import { useTranslation } from "react-i18next";
import PromoModal from "../../component/PromoModal";
import { PRISM_URL } from "../../contants/url.constants";

const mapStateToProps = (state: RootReducerType) => {
    return {
        cartInformation: state.global.cartInfo,
        customerInfo: state.global.customer_info,
        shippingInfo: state.checkout.shippingInfo,
        createOrderState: state.checkout.createOrder,
        selectedAddress: state.checkout.selectedAddress,
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


type DeliverPropsType = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const Deliver: FC<DeliverPropsType> = ({
    cartInformation,
    customerInfo,
    createOrder,
    createOrderState,
    shippingInfo,
    selectedAddress,
}) => {
    const { isLoading, error, outOfStockItems, order } = createOrderState;
    const [cities, setCities] = useState([]);
    const [allDistricts, setAllDistricts] = useState<DistrictOfCityType[]>([]);
    const [chosenCity, setChosenCity] = useState('');
    const [chosenCityDistricts, setChosenCityDistricts] = useState<string[]>([]);
    const [chosenDistrict, setChosenDistric] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [company, setCompany] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [country, setCountry] = useState('vietnam');
    const [zipCode, setZipCode] = useState('');
    const [phone, setPhone] = useState('');
    const [shippingType, setShippingType] = useState(1);
    const [paymentType, setPaymentType] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [emailError, setEmailError] = useState('');
    const [firstnameError, setFirstnameError] = useState('');
    const [lastnameError, setLastnameError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [note, setNote] = useState('');
    const [open, setIsOpen] = useState(true);
    const router = useRouter();
    const [list, setList] = useState<Array<OrderRC>>([]);
    const [orderTotal, setOrderTotal] = useState<number>(0);
    const [cartInfo, setCartInfo] = useState<CartInfoType | null>(null);
    const [paymentMethods, setPaymentMethods] = useState<Array<PaymentMethodType>>([]);
    const [shippingMethods, setShippingMethods] = useState<Array<ShippingMethodType>>([]);
    const [rewardItem, setRewardItem] = useState<CartItemType>();
    const { t } = useTranslation();
    const [exchangePoint, setExchangePoint] = useState<number | undefined>(0)
    const [redeemMultiplier, setRedeemMultiplier] = useState<number | null>(null);
    const [redeemAmount, setRedeemAmount] = useState<number | null | undefined>(null);
    const [couponCurrent, setCouponCurrent] = useState<CouponListType | null>(null);
    const [openModalPromo, setOpenModalPromo] = useState<boolean>(false);
    const [currentPoint, setCurrentPoint] = useState<number | null>(null);
    const [listCoupon, setListCoupon] = useState<CouponListType[]>([]);
    const [loyaltyRate, setLoyaltyRate] = useState<number | null>(null);
    const [isOpenModal, setOpenModal] = useState(false);
    const [isOpenVerifyModal, setOpenVerifyModal] = useState(false);
    const [isIssueInvoice, setIsIssueInvoice] = useState<boolean>(false);
    const [issueCompanyName, setIssueCompanyName] = useState<string>("");
    const [issueCompanyAddress, setIssueCompanyAddress] = useState<string>("");
    const [issueCompanyTaxNum, setIssueCompanyTaxNum] = useState<string>("");
    const [issueCompanyNameError, setIssueCompanyNameError] = useState<string>("");
    const [issueCompanyAddressError, setIssueCompanyAddressError] = useState<string>("");
    const [issueCompanyTaxNumError, setIssueCompanyTaxNumError] = useState<string>("");

    useEffect(() => {
        let citiesToSet: any
        let districtsToSet: DistrictOfCityType[];
        citiesToSet = [];
        districtsToSet = [];

        const datas = Object.entries(cities_data);

        datas.forEach(data => {
            const city = { name: data[1].name, city: data[1] }
            citiesToSet.push(city);
        })

        setCities(citiesToSet);

        datas.forEach(data => {
            let districts: string[];
            districts = [];
            const cityDistricts = Object.entries(data[1].cities);
            cityDistricts.forEach(district => {
                districts.push(district[1]);
            })
            districtsToSet.push({ name: data[1].name, districts });
        })
        setAllDistricts(districtsToSet);
        if (shippingInfo.S_CITY !== "") {
            setChosenCity(shippingInfo.S_CITY);
            const chosenCityDistricts = districtsToSet.filter((d: DistrictOfCityType) => d.name === shippingInfo.S_CITY)[0];
            setChosenCityDistricts(chosenCityDistricts.districts);
            setChosenDistric(chosenCityDistricts.districts.filter(district => district === shippingInfo.S_DISTRICT)[0]);
        } else {
            setChosenCity('H\u00e0 N\u1ed9i');
            const chosenCityDistricts = districtsToSet.filter((d: DistrictOfCityType) => d.name === 'H\u00e0 N\u1ed9i')[0];
            setChosenCityDistricts(chosenCityDistricts.districts);
            setChosenDistric(chosenCityDistricts.districts[1]);
        }
    }, [])

    useEffect(() => {
        if (allDistricts.length > 0) {
            if (customerInfo && customerInfo.addresses.length > 0) {
                const defaultAddress = customerInfo.addresses.filter(address => address.IS_DEFAULT_ADDRESS === 1)[0];
                setStreetAddress(defaultAddress.STREET_ADDRESS);
                setFirstName(defaultAddress.FIRST_NAME);
                setLastName(defaultAddress.LAST_NAME);
                setPhone(defaultAddress.PHONE);
                setChosenCity(defaultAddress.CITY);
                let chosenCityDistricts: any;
                chosenCityDistricts = allDistricts.filter((d: any) => d.name === defaultAddress.CITY)[0];
                setChosenCityDistricts(chosenCityDistricts.districts);
                setChosenDistric(chosenCityDistricts.districts.filter(
                    (district: any) => district === defaultAddress.DISTRICT)[0]);
            }
        }
    }, [allDistricts])

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
        getProductsRC();
        fetchCoupon();
        getPoint();
    }, [])

    const updatePoint = (data: UpdatePointType) => {
        if (data.type === '2') {
            setExchangePoint(data.targetPoint)
            setRedeemAmount(data.targetAmount)
        }
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

    useEffect(() => {
        const getAllShippingMethods = async () => {
            const response = await axios({
                url: "http://localhost:5035/shipping-methods",
                method: "GET",
                withCredentials: true
            })
            const data = response.data;
            setShippingMethods(data.shippingMethods);
        }
        getAllShippingMethods();
    }, [])

    useEffect(() => {
        setCartInfo(cartInformation);
    }, [cartInformation])

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
                if (cartInfoTemp.discountTransaction[i].disc_type === 1)
                    subtotal -= Number(cartInfoTemp.discountTransaction[i].disc_Value);
                else {
                    let disc: number = (subtotal * Number(cartInfoTemp.discountTransaction[i].disc_Value) / 100);
                    cartInfoTemp.discountTransaction[i].real_value = disc;
                    subtotal -= disc;
                }
            setOrderTotal(subtotal);
            setCartInfo(cartInfoTemp);
        }
    }, [cartInfo])
    const viewDetails = (name: string, sid: string) => {
        console.log(name);
        console.log(sid);
        window.location.href = `/products/detail/${name}?psid=${sid}`;
    };
    const chooseCity = (name: string) => {
        setChosenCity(name);
        let chosenCityDistricts: any;
        chosenCityDistricts = allDistricts.filter((d: any) => d.name === name)[0];
        setChosenCityDistricts(chosenCityDistricts.districts);
        setChosenDistric(chosenCityDistricts.districts[1]);
    }

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
            }
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

            let PROMO_NAME = cartInfo?.discountTransaction && cartInfo.discountTransaction.length > 0 ? cartInfo.discountTransaction[0].PROMO_NAME : "";
            if (note.trim() !== '' && note !== '') {
                const shippingInfo = {
                    STATUS: 1,
                    ITEMS: items,
                    EMAIL: email,
                    S_FIRST_NAME: selectedAddress ? selectedAddress.FIRST_NAME : firstName,
                    S_LAST_NAME: selectedAddress ? selectedAddress.LAST_NAME : lastName,
                    S_STREET_ADDRESS: selectedAddress ? selectedAddress.STREET_ADDRESS : streetAddress,
                    S_COUNTRY: 'Vietnam',
                    S_CITY: selectedAddress ? selectedAddress.CITY : chosenCity,
                    S_DISTRICT: selectedAddress ? selectedAddress.DISTRICT : chosenDistrict,
                    S_PHONE: selectedAddress ? selectedAddress.PHONE : phone,
                    ORDER_TYPE: 2,
                    S_TYPE: shippingType,
                    P_TYPE: paymentType,
                    NOTE: note,
                    DISC_AMT: discountAmt,
                    PROMO_NAME,
                    PAYMENT_METHOD: paymentType,
                    COUPON_SID: (couponCurrent) ? couponCurrent.SID_COUPON : null,
                    COUPON_VALUE: couponCurrent && cartInfo ? parseInt(couponCurrent.coupon.REWARD_DISCOUNT_TYPE.toString()) === 1 ? couponCurrent.coupon.REWARD_DISCOUNT_VALUE
                        : Number(couponCurrent.coupon.REWARD_DISCOUNT_VALUE / 100) * cartInfo.SUB_TOTAL : 0,
                    IS_ISSUE_INVOICE: (isIssueInvoice) ? 1 : 0,
                    ISSUE_COMPANY_NAME: issueCompanyName,
                    ISSUE_COMPANY_ADDRESS: issueCompanyAddress,
                    ISSUE_COMPANY_TAX_NUMBER: issueCompanyTaxNum
                }
                createOrder(shippingInfo);
            } else {
                const shippingInfo = {
                    STATUS: 1,
                    ITEMS: items,
                    EMAIL: email,
                    S_FIRST_NAME: selectedAddress ? selectedAddress.FIRST_NAME : firstName,
                    S_LAST_NAME: selectedAddress ? selectedAddress.LAST_NAME : lastName,
                    S_STREET_ADDRESS: selectedAddress ? selectedAddress.STREET_ADDRESS : streetAddress,
                    S_COUNTRY: 'Vietnam',
                    S_CITY: selectedAddress ? selectedAddress.CITY : chosenCity,
                    S_DISTRICT: selectedAddress ? selectedAddress.DISTRICT : chosenDistrict,
                    S_PHONE: selectedAddress ? selectedAddress.PHONE : phone,
                    ORDER_TYPE: 2,
                    S_TYPE: shippingType,
                    P_TYPE: paymentType,
                    DISC_AMT: discountAmt,
                    PROMO_NAME,
                    PAYMENT_METHOD: paymentType,
                    COUPON_SID: (couponCurrent) ? couponCurrent?.SID_COUPON : null,
                    COUPON_VALUE: couponCurrent && cartInfo ? parseInt(couponCurrent.coupon.REWARD_DISCOUNT_TYPE.toString()) === 1 ? couponCurrent.coupon.REWARD_DISCOUNT_VALUE
                        : Number(couponCurrent.coupon.REWARD_DISCOUNT_VALUE / 100) * cartInfo.SUB_TOTAL : 0,
                    IS_ISSUE_INVOICE: (isIssueInvoice) ? 1 : 0,
                    ISSUE_COMPANY_NAME: issueCompanyName,
                    ISSUE_COMPANY_ADDRESS: issueCompanyAddress,
                    ISSUE_COMPANY_TAX_NUMBER: issueCompanyTaxNum
                }
                createOrder(shippingInfo);
            }
        } else {
            setErrors();
            window.scrollTo({ left: 0, top: 450, behavior: 'smooth' });
        }
        setOpenVerifyModal(false)
    }

    function validateField() {
        let isValidate = true;
        if (validator.isEmpty(email.trim()) || !validator.isEmail(email.trim())
            || validator.isEmpty(firstName.trim()) || validator.isEmpty(lastName.trim())
            || validator.isEmpty(streetAddress.trim()) || validator.isEmpty(phone.trim())
            || !validator.isMobilePhone(phone.trim(), 'vi-VN')
            || (isIssueInvoice && (validator.isEmpty(issueCompanyName.trim()) || validator.isEmpty(issueCompanyAddress.trim()) || validator.isEmpty(issueCompanyTaxNum.trim())))
        ) {
            isValidate = false;
        } else {
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

        if (validator.isEmpty(streetAddress.trim())) {
            setAddressError('Address cannot be empty');
        } else {
            setAddressError('');
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

        if (validator.isEmpty(phone.trim())) {
            setPhoneError('Phone cannot be empty');
        } else {
            if (!validator.isMobilePhone(phone.trim(), 'vi-VN')) {
                setPhoneError('Incorrect phone number');
            } else {
                setPhoneError('');
            }
        }
    }

    const handleClick = () => {
        setIsOpen(!open);
    }

    function redirect(path: string) {
        router.push(path);
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

    return (
        <div style={{ width: '100%' }}>
            <main className="main">
                <div className="container mb-6">
                    <div className="row">
                        <div className="col-lg-8">
                            <ul className="checkout-steps">
                                <li>
                                    <h2
                                        style={{ border: 'none' }}
                                        className="step-title">
                                        2. {t('inStore.deliver')}
                                    </h2>
                                    <form action="#">
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

                                        {
                                            customerInfo ?
                                                <div className="form-group required-field">
                                                    <label>Giao tới</label>
                                                    <div className="shipping-address-container">
                                                        {
                                                            selectedAddress ?
                                                                <>
                                                                    <div className="shipping-address-container__top">
                                                                        <div className="shipping-address-container__top__left">
                                                                            {selectedAddress.FIRST_NAME} {selectedAddress.LAST_NAME}
                                                                        </div>
                                                                        <div className="shipping-address-container__top__right">
                                                                            {selectedAddress.PHONE}
                                                                        </div>
                                                                    </div>
                                                                    <div className="shipping-address-container__middle">
                                                                        {selectedAddress.STREET_ADDRESS}, {selectedAddress.DISTRICT}, {selectedAddress.CITY}
                                                                    </div>
                                                                    <div className="shipping-address-container__bottom">
                                                                        <p
                                                                            onClick={() => {
                                                                                router.push('/checkout/shipping');
                                                                            }}
                                                                        >Thay đổi</p>
                                                                    </div>
                                                                </>
                                                                :
                                                                <>
                                                                    <div className="shipping-address-container__top">

                                                                        <div className="shipping-address-container__top__right">
                                                                            Bạn hiện không có địa chỉ nào
                                                                        </div>
                                                                    </div>
                                                                    <div className="shipping-address-container__middle">

                                                                    </div>
                                                                    <div className="shipping-address-container__bottom">
                                                                        <p
                                                                            onClick={() => {
                                                                                router.push('/checkout/shipping');
                                                                            }}
                                                                        >Thêm địa chỉ</p>
                                                                    </div>
                                                                </>
                                                        }
                                                    </div>
                                                </div>
                                                :
                                                <>
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
                                                        <label>{t('inStore.lastName')} </label>
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

                                                    <div className="form-group">
                                                        <label>{t('deliver.city')}</label>
                                                        <div className="select-custom">
                                                            <select
                                                                onChange={(e) => {
                                                                    chooseCity(e.target.value);
                                                                }}
                                                                value={chosenCity}
                                                                defaultValue={chosenCity}
                                                                className="form-control">
                                                                {cities.map((city: any) =>
                                                                    city.name === chosenCity ?
                                                                        <option
                                                                            key={city.name}
                                                                            value={city.name}>{city.city.name}</option>
                                                                        :
                                                                        <option
                                                                            key={city.name}
                                                                            value={city.name}>{city.city.name}</option>
                                                                )}
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="form-group">
                                                        <label>{t('deliver.district')}</label>
                                                        <div className="select-custom">
                                                            <select
                                                                defaultValue={chosenDistrict}
                                                                onChange={(e) => { setChosenDistric(e.target.value) }}
                                                                value={chosenDistrict}
                                                                className="form-control">
                                                                {
                                                                    chosenCityDistricts.length > 0 ?
                                                                        chosenCityDistricts.map(district =>
                                                                            district === chosenDistrict ?
                                                                                <option
                                                                                    key={district}
                                                                                    value={district}>{district}</option>
                                                                                :
                                                                                <option
                                                                                    key={district}
                                                                                    value={district}>{district}</option>
                                                                        )
                                                                        : null
                                                                }
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="form-group required-field">
                                                        <label>{t('deliver.add')}</label>
                                                        <input
                                                            style={{ border: addressError !== '' ? '1px solid #e74c3c' : '1px solid #ced4da' }}
                                                            value={streetAddress}
                                                            onChange={(e) => { setStreetAddress(e.target.value) }}
                                                            type="text" className="form-control" required />
                                                        <p
                                                            style={{
                                                                color: '#e74c3c',
                                                                fontSize: '1.25rem',
                                                            }}
                                                        >{addressError !== '' ? addressError : null}</p>
                                                    </div>

                                                    {/* <div className="form-group required-field">
                                            <label>Zip/Postal Code </label>
                                            <input
                                                value={zipCode}
                                                onChange={(e) => { setZipCode(e.target.value) }}
                                                type="text" className="form-control" required />
                                        </div> */}

                                                    <div className="form-group required-field">
                                                        <label> {t('inStore.phone')} </label>
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

                                                </>
                                        }

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
                                            className="step-title">3. {t('deliver.option')}</h2>

                                        <table className="table table-step-shipping">
                                            {shippingMethods.length > 0 ?
                                                <tbody className="table table-step-shipping__tbody">
                                                    {
                                                        shippingMethods.map(shippingMethod =>
                                                            <tr
                                                                className={shippingType === shippingMethod.ID ? 'option-type option-type--active' : 'option-type'}
                                                                onClick={() => {
                                                                    setShippingType(shippingMethod.ID);
                                                                }}>
                                                                <td style={{ border: 'none' }}>
                                                                    <input
                                                                        type="radio"
                                                                        name="shipping-method"
                                                                        value={shippingMethod.ID}
                                                                        checked={shippingType === shippingMethod.ID ? true : false}
                                                                        onChange={(e) => { setShippingType(parseInt(e.target.value)) }}
                                                                    />
                                                                </td>
                                                                <td style={{ border: 'none' }}>{shippingMethod.SHIPPING_METHOD_NAME}</td>
                                                                <td style={{ border: 'none' }}>{shippingMethod.DESCRIPTION}</td>
                                                                <td style={{ border: 'none' }}>{formatter(shippingMethod.FLAT_PRICE)}</td>
                                                            </tr>
                                                        )
                                                    }
                                                </tbody>
                                                : null
                                            }
                                        </table>
                                    </div>
                                </li>
                                <li>
                                    <div className="checkout-step-shipping">
                                        <h2
                                            style={{ border: 'none', marginBottom: '10px' }}
                                            className="step-title">4. {t('inStore.promotion')}:</h2>
                                        <Button className="btn-promo" onClick={() => setOpenModalPromo(true)}>
                                            {t('inStore.getPromo')}
                                        </Button>
                                    </div>
                                </li>
                                <li>
                                    <div className="checkout-step-shipping">
                                        <h2
                                            style={{ border: 'none', marginBottom: '10px' }}
                                            className="step-title">5. {t('inStore.payOption')}:</h2>

                                        <table className="table table-step-shipping">
                                            <tbody className="table table-step-shipping__tbody">
                                                {
                                                    paymentMethods.length > 0 ?
                                                        paymentMethods.map(payment =>
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
                                                                ><input
                                                                        type="radio"
                                                                        name="payment-method"
                                                                        value={payment.ID}
                                                                        checked={paymentType === payment.ID ? true : false}
                                                                        onChange={(e) => { setPaymentType(parseInt(e.target.value)) }}
                                                                    /></td>
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
                                    {
                                        customerInfo ?
                                            selectedAddress?.FIRST_NAME + ' ' + selectedAddress?.LAST_NAME
                                            :
                                            firstName + ' ' + lastName
                                    }
                                </ListItem>
                                <ListItem className='shipping-address-summary__address'>
                                    {t('deliver.add')}:&nbsp;
                                    {
                                        customerInfo ?
                                            selectedAddress?.STREET_ADDRESS + ', ' + selectedAddress?.DISTRICT + ', ' + selectedAddress?.CITY
                                            :
                                            streetAddress + ', ' + chosenDistrict + ', ' + chosenCity
                                    }
                                </ListItem>
                                <ListItem className='shipping-address-summary__phone'>
                                    {t('inStore.phone')}: {customerInfo ? selectedAddress?.PHONE : phone}
                                </ListItem>
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
                                    </List>
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
                                                {
                                                    shippingMethods.length > 0 ?
                                                        formatter(shippingMethods.filter(
                                                            method => method.ID === shippingType)[0].FLAT_PRICE
                                                        )
                                                        :
                                                        null
                                                }
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
                                                {formatter(orderTotal +
                                                    (shippingMethods.length > 0 && shippingMethods.filter(
                                                        method => method.ID === shippingType).length > 0 ?
                                                        Number(shippingMethods.filter(
                                                            method => method.ID === shippingType)[0].FLAT_PRICE)
                                                        :
                                                        0)

                                                    - (redeemAmount ? redeemAmount : 0) -
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
                                openVerifyModal();
                            }}
                                id='submit-btn'
                            >{t('inStore.order')}</button>
                            <p>{t('inStore.orderNote')}</p>
                        </div>
                    </div>
                </div>
                {!isLoading && order ?
                    <div id="message-container">
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
            </main>
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
                                onClick={() => { submit() }}
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

        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(Deliver);

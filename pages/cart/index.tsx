import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FC } from "react";
import { connect } from 'react-redux';
import { formatter } from '../../utils/currency.formatter';
import { RootReducerType } from "../../redux/rootReducer";
import CartItem from '../../component/CartItem';
import { actions as checkoutActions } from "../../redux/action_reducer_saga/checkout/action";
import { CartInfoType, CartItemType } from "../../redux/types";
import { useTranslation } from "react-i18next";

const mapStateToProps = (state: RootReducerType) => {
    return {
        cartInformation: state.global.cartInfo,
        createOrderState: state.checkout.createOrder,
    }
}

type CartPropsType = ReturnType<typeof mapStateToProps>;

const Cart: FC<CartPropsType> = ({ cartInformation, createOrderState }) => {
    const { outOfStockItems } = createOrderState;
    const [isToggleShipInfo, setToggleShipInfo] = useState(false);
    const [rewardItem, setRewardItem] = useState<CartItemType>();
    const [cartInfo, setCartInfo] = useState<CartInfoType | null>(null);
    const [orderTotal, setOrderTotal] = useState<number>(0);
    const router = useRouter();
    const { t } = useTranslation();

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
            // console.log(cartInfo.itemReward[0].productInformation);
            temp.product.PRODUCT_NAME = `${cartInfo.itemReward[0].productInformation.PRODUCT_NAME} - ${cartInfo.itemReward[0].productAttributeGroup.GROUP_VALUE_VARCHAR}, ${cartInfo.itemReward[0].productAttributeGroup.productAttributeValues[0].VALUE_VARCHAR}`;
            temp.product.SID_PRODUCT_INFORMATION = cartInfo.itemReward[0].productInformation.SID;
            setRewardItem(temp)
        }
        if (cartInfo && cartInfo.discountTransaction) {
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

    function submitCart() {
        if (outOfStockItems.length === 0) {
            router.push('/checkout');
        }
    }
    console.log(cartInfo);
    return (
        <div className='cart-page-container'>
            <div className='cart-page-container__header'>
            {t('cart.items')} &nbsp;<span id='total-items'>({cartInfo && cartInfo.TOTAL_ITEMS > 0 ? cartInfo.TOTAL_ITEMS : 0})</span>
            </div>
            <div className='cart-page-container__left'>
                <div className='cart-page-container__left__header'>
                    <div className='cart-page-container__left__header__column1'>
                    {t('cart.product')}
                    </div>
                    <div className='cart-page-container__left__header__column2'>
                    {t('cart.price')}
                    </div>
                    <div className='cart-page-container__left__header__column3'>
                    {t('cart.itemDiscount')}
                    </div>
                    <div className='cart-page-container__left__header__column4'>
                    {t('cart.itemQTY')}
                    </div>
                    <div className='cart-page-container__left__header__column5'>
                    {t('cart.itemSubtotal')}
                    </div>
                </div>
                <div className='cart-page-container__left__items'>
                    {
                        cartInfo ?
                            cartInfo.SID_CUSTOMER !== "" ?
                                cartInfo.items.length > 0 ?
                                    cartInfo.items.map(item =>
                                        <CartItem
                                            item={item}
                                        />
                                    )
                                    : <p
                                        style={{ fontSize: '15px' }}
                                    >{t('cart.empty')}</p>
                                : <p
                                    style={{ fontSize: '15px' }}
                                >{t('cart.empty')}</p>
                            : <p
                                style={{ fontSize: '15px' }}
                            >{t('cart.empty')}</p>
                    }
                    {
                        rewardItem &&
                        <CartItem item={rewardItem} disabledQty />
                    }
                </div>
            </div>
            <div className='cart-page-container__right'>
                <div className='cart-page-container__right__header'>
                {t('cart.summary')}
                </div>
                <div
                    style={{
                        height: !isToggleShipInfo ? '100px' : '50px'
                    }}

                    className='cart-page-container__right__shipping-info'>
                </div>
                <div className='cart-page-container__right__price-tax'>
                    <div>
                        <div className='text'>
                        {t('cart.subtotal')}
                        </div>
                        <div className='value'>
                            {formatter(cartInfo?.SUB_TOTAL)}
                        </div>
                    </div>
                    {/* <div>
                        <div className='text'>
                            Tax
                        </div>
                        <div className='value'>
                            {formatter(cartInfo?.TAX_PRICE)}
                        </div>
                    </div> */}
                </div>
                {
                    cartInfo && cartInfo.discountTransaction ?
                        cartInfo.discountTransaction.length > 0 ?
                            cartInfo.discountTransaction.map((discountItem) => (
                                <div style={{ height: 'auto' }} className='cart-page-container__right__total'>
                                    <div className='text'>
                                    {t('cart.discount')} ({discountItem.PROMO_NAME})
                                    </div>
                                    <div className='value'>
                                        -{formatter(discountItem.real_value)}
                                    </div>
                                </div>
                            ))
                            : null
                        : null
                }
                <div className='cart-page-container__right__total'>
                    <h1>{t('cart.total')}</h1>
                    <p>{formatter(orderTotal)}</p>
                </div>
                <div className='cart-page-container__right__checkout'>
                    <button
                        onClick={() => {
                            submitCart()
                        }}
                    >{t('cart.checkout')}</button>
                </div>
            </div>
        </div >
    )
}

export default connect(mapStateToProps)(Cart);
import { actions as cartActions } from "../../redux/action_reducer_saga/cart/action";
import { connect } from 'react-redux';
import { actions as checkoutActions } from "../../redux/action_reducer_saga/checkout/action";
import { formatter } from "../../utils/currency.formatter"
import { RootReducerType } from "../../redux/rootReducer"
import React, { FC, useEffect, useState } from "react";
import { CartItemType } from "../../redux/types";

const mapStateToProps = (state: RootReducerType) => {
    return {
        createOrderState: state.checkout.createOrder,
    }
}

const mapDispatchToProps = {
    addToCart: cartActions.addToCart,
    diminishItemFromCart: cartActions.diminishItemFromCart,
    clearError: checkoutActions.clearError,
}

type CartItemPropsType = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

interface CartItempType {
    item: CartItemType;
    disabledQty?: boolean;
}

const CartItem: FC<CartItemPropsType & CartItempType> = ({ item, createOrderState, disabledQty, addToCart, diminishItemFromCart, clearError }) => {
    const { outOfStockItems, error } = createOrderState;
    const [isOutOfStock, setIsOutOfStock] = useState(false);
    const [initialQty, setInitialQty] = useState<string>(item.QUANTITY.toString());
    const [qtyOnFocus, setQtyOnFocus] = useState<string>("");

    const discountValue: number = (item.product.DISC_VALUE
        ? -(Number(item.product.PRICE) + Number(item.product.TAX)) * (Number(item.product.DISC_VALUE) * 0.01)
        : 0) * item.QUANTITY;

    const increateQty = (SID_PRODUCT: string) => {
        addToCart(SID_PRODUCT, 1);
    }

    useEffect(() => {
        setInitialQty(item.QUANTITY.toString());
    }, [])

    useEffect(() => {
        const itemOutOfStock = outOfStockItems.filter(ousItem => ousItem.SID_PRODUCT === item.SID_PRODUCT)[0];
        if (itemOutOfStock) {
            if (item.QUANTITY > Number(initialQty) + itemOutOfStock.exceedQty) {
                setIsOutOfStock(true);
            } else {
                setIsOutOfStock(false);
                clearError(item.SID_PRODUCT);
            }
        }
        else {
            setInitialQty(item.QUANTITY.toString());
        }
    }, [item.QUANTITY])

    const decreaseQty = (SID_PRODUCT: string) => {
        diminishItemFromCart(SID_PRODUCT, 1);
    }

    const handleQuantity = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!isNaN(Number(event.target.value)))
            setInitialQty(event.target.value);
    }

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>, SID_PRODUCT: string) => {
        if (event.target.value === "")  {
            setInitialQty(qtyOnFocus);
            return;
        }
        const newNum: number = Number(event.target.value);
        const num: number = Number(qtyOnFocus);
        if (newNum - num > 0) {
            addToCart(SID_PRODUCT, newNum - num)
        }
        if (newNum - num < 0) {
            diminishItemFromCart(SID_PRODUCT, num - newNum);
        }
    }

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        setQtyOnFocus(initialQty);
    }

    const getProductInformationName = (productNameWithStyle: string) => {
        return {
            productInfoName: productNameWithStyle.split(' - ')[0],
            mainAttribute: productNameWithStyle.split(' - ')[1].split(',')[0],
            subAttribute: productNameWithStyle.split(' - ')[1].split(',')[1],
        };
    }

    return (
        <div
            style={{
                border: isOutOfStock ? '1px solid red' : 'none'
            }}
            key={item.SID_PRODUCT}
            className='cart-page-container__left__items__item'>
            <div className='cart-page-container__left__items__item__column cart-page-container__left__items__item__column1'>
                <div className='cart-page-container__left__items__item__column cart-page-container__left__items__item__column1__left'>
                    <div className='cart-page-container__left__items__item__column cart-page-container__left__items__item__column1__left__top'>
                        <img src={
                            item.product.images.filter(image => image.IMAGE_TYPE === 1)[0].PRISM_URL ?
                                `http://d71e-58-186-85-28.ap.ngrok.io/images/${item.product.images.filter(image => image.IMAGE_TYPE === 1)[0].PRISM_URL}` :
                                `http://localhost:5035/products/image/${item.product.images.filter(image => image.IMAGE_TYPE === 1)[0].IMAGE_NAME}`
                        } />
                    </div>
                    <div className='cart-page-container__left__items__item__column cart-page-container__left__items__item__column1__left__bottom'>
                        Move to Wishlist
                    </div>
                </div>
                <div className='cart-page-container__left__items__item__column cart-page-container__left__items__item__column1__product-name'>
                    <span className="cart-page-container__left__items__item__column1__product-name__name">
                        <a href={`/products/detail/${item.product.PRODUCT_NAME}?psid=${item.product.SID_PRODUCT_INFORMATION}`}>
                            {getProductInformationName(item.product.PRODUCT_NAME).productInfoName}
                        </a>
                        <p>
                            Color: {getProductInformationName(item.product.PRODUCT_NAME).mainAttribute}, Size: {getProductInformationName(item.product.PRODUCT_NAME).subAttribute}
                        </p>
                    </span>
                    <span className="cart-page-container__left__items__item__column1__product-name__discount-value">
                        {item.product.DISC_VALUE ? `(-${item.product.DISC_VALUE}%)` : null}
                    </span>
                </div>
            </div>
            <div className='cart-page-container__left__items__item__column cart-page-container__left__items__item__column2'>
                {formatter(item.QUANTITY * (item.product.PRICE ? Number(item.product.PRICE) : 0) + (item.product.TAX ? Number(item.product.TAX) : 0))}
            </div>
            <div className='cart-page-container__left__items__item__column cart-page-container__left__items__item__column3'>
                <div className="cart-page-container__left__items__item__column3__discount">
                    <span>{formatter(discountValue)}</span>
                </div>
            </div>
            <div className='cart-page-container__left__items__item__column cart-page-container__left__items__item__column4'>
                {
                    !disabledQty &&
                    <div>
                        <button
                            onClick={() => { decreaseQty(item.SID_PRODUCT) }}
                        >
                            <p>—</p>
                        </button>
                    </div>
                }

                <input
                    style={{
                        border: isOutOfStock ? '1px solid red' : '1px solid rgba(0,0,0,0.15)',
                        color: isOutOfStock ? 'red' : 'black'
                    }}
                    readOnly={disabledQty} value={initialQty} type="text" onChange={handleQuantity} onBlur={(e) => handleBlur(e,item.SID_PRODUCT)} onFocus={handleFocus}/>
                {
                    !disabledQty &&
                    <div>
                        <button
                            onClick={() => { increateQty(item.SID_PRODUCT) }}

                        >
                            <p>+</p>
                        </button>
                    </div>
                }

            </div>
            <div className='cart-page-container__left__items__item__column cart-page-container__left__items__item__column5'>
                {formatter(item.QUANTITY * (((Number(item.product.TAX ? item.product.TAX : 0) + Number(item.product.PRICE ? item.product.PRICE : 0)) * (1 - Number(item.product.DISC_VALUE ? item.product.DISC_VALUE / 100 : 0)))))}
            </div>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(CartItem);
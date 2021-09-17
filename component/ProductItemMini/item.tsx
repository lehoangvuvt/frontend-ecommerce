import { FC } from "react";
import { useState } from "react";
import { connect } from 'react-redux';
import Rating from "@material-ui/lab/Rating";
import { actions } from '../../redux/action_reducer_saga/cart/action';
import { formatter } from '../../utils/currency.formatter';
import { ItemPropsType } from "../../redux/types";
import { useEffect } from "react";
import { useRouter } from "next/router";

const mapDispatchToProps = {
    addToCart: actions.addToCart,
}

const Item: FC<ItemPropsType & typeof mapDispatchToProps> = ({ productInformation }) => {
    const router = useRouter();
    const discount: number = productInformation.DISC_VALUE ? parseInt(productInformation.DISC_VALUE.toString()) : 0;
    const viewDetails = () => {
        router.push(`products/detail/${productInformation.PRODUCT_NAME}?psid=${productInformation.SID}`);
    }
    return (
        <div
            onClick={() => { viewDetails() }}
            className='products-container__right__products-container__item'>
            <div className='products-container__right__products-container__item__top'>
                <img src={
                    productInformation.products[0].images[0].PRISM_URL ?
                        `http://d71e-58-186-85-28.ap.ngrok.io/images/${productInformation.products[0].images[0].PRISM_URL}` :
                        `http://localhost:5035/products/image/${productInformation.products[0].images[0].IMAGE_NAME}`
                } />
            </div>
            <div className='products-container__right__products-container__item__bottom'>
                <div className='products-container__right__products-container__item__bottom__top'>
                    <div className='products-container__right__products-container__item__bottom__top__left'>
                        <p>{productInformation.categoryConnections.length > 0 ? productInformation.categoryConnections[0].category.CATEGORY_NAME : null}</p>
                    </div>
                </div>
                <div className='products-container__right__products-container__item__bottom__middle'>
                    <p>{productInformation.PRODUCT_NAME}</p>
                </div>
                <div className='products-container__right__products-container__item__bottom__bottom'>
                    <Rating
                        name="simple-controlled"
                        value={4}
                        readOnly
                        size='medium'
                    />
                </div>
                <div className='products-container__right__products-container__item__bottom__price'>
                    <p>{formatter(Math.round(productInformation.productPrices.sort((a, b) => new Date(b.CREATED_DATETIME.toString()).getTime() - new Date(a.CREATED_DATETIME.toString()).getTime())[0].UNIT_PRICE * (1 - discount / 100)))}</p>

                    {
                        (discount > 0) &&
                        <span>
                            -{discount}%
                        </span>
                    }
                </div>
            </div>
        </div >
    )
}

export default connect(null, mapDispatchToProps)(Item);
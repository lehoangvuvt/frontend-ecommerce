import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useRouter } from "next/router";
import validator from 'validator';
import cities_data from '../../../data/vietnam.json';
import { CreateOrderType, DistrictOfCityType, OrderItemType } from '../../../redux/types';
import { RootReducerType } from '../../../redux/rootReducer';
import { FC } from 'react';
import { actions } from '../../../redux/action_reducer_saga/checkout/action';

const mapStateToProps = (state: RootReducerType) => {
	return {
		shippingInfo: state.checkout.shippingInfo,
		cartInfo: state.global.cartInfo,
		createOrderState: state.checkout.createOrder,
	}
}

const mapDispatchToProps = {
	submitBillingInfo: actions.submitBillingInfo,
	createOrder: actions.createOrder,
}

type CheckoutReviewPropsType = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const CheckoutReview: FC<CheckoutReviewPropsType> = ({ shippingInfo, cartInfo, createOrder, createOrderState }) => {
	const router = useRouter();


	// const submit = () => {
	// 	let newOrderInfo: CreateOrderType;
	// 	let items: OrderItemType[];
	// 	items = [];
	// 	if (cartInfo) {
	// 		cartInfo.items.map(item => {
	// 			items.push({ SID_PRODUCT: item.SID_PRODUCT, QUANTITY: item.QUANTITY, HAVE_PROMO: 0 });
	// 		})
	// 	}
	// 	const { ...props } = shippingInfo;
	// 	newOrderInfo = {
	// 		...props,
	// 		STATUS: 1,
	// 		ITEMS: items,
	// 		DISC_AMT: cartInfo?.havePromo ? cartInfo?.discValue : 0,
	// 		PROMO_NAME: (cartInfo?.havePromo) ? cartInfo.promoName: ""
	// 	}

	// }

	return (
		<div style={{ width: '100%', marginTop: '200px' }}>
			<main className="main">
				<div className="container mb-6">
					<ul className="checkout-progress-bar">
						<li>
							<span>Shipping</span>
						</li>
						<li className="active">
							<span>Review &amp; Payments</span>
						</li>
					</ul>
				</div>
			</main>
		</div>
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutReview);
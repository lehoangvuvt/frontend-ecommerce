import { useRouter } from 'next/router'
import validator from 'validator';
import React, { createRef, FC, useEffect, useState } from 'react'
import { actions as cartActions } from '../../../redux/action_reducer_saga/cart/action';
import { connect } from 'react-redux'
import { SideBySideMagnifier } from "react-image-magnifiers";
import { actions as productDetailsActions } from '../../../redux/action_reducer_saga/products/detail/action'
import { formatter } from '../../../utils/currency.formatter';
import { RootReducerType } from '../../../redux/rootReducer';
import ImageGallery from 'react-image-gallery';
import { DiscountPromotionType, ProductAttributeType, ProductAttributeValueType, ProductImageType, ProductInformationType, ProductType } from '../../../redux/types';
import { Favorite, FavoriteBorder } from '@material-ui/icons'
import { actions as wishListActions } from '../../../redux/action_reducer_saga/customer/wishlist/action'
import axios from 'axios';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Rating from "@material-ui/lab/Rating";
import { useTranslation } from 'react-i18next';
import { PRISM_URL } from "../../../contants/url.constants";

interface Props {
	details: {
		productInformation: ProductInformationType | null,
		productByGroupedAttribute: Array<{
			GROUP_ID: number,
			GROUP_ATTRIBUTE_ID: number,
			GROUP_ATTRIBUTE_NAME: string,
			GROUP_ATTRIBUTE_VALUE: string | number | Date,
			groupedProducts: Array<{
				ID: number,
				SID_PRODUCT: string,
				PRODUCT_ATTRIBUTE_ID: number,
				CREATED_DATETIME: Date,
				MODIFIED_DATETIME: Date,
				VALUE_VARCHAR: string,
				VALUE_INT: number,
				VALUE_DECIMAL: number,
				VALUE_DATETIME: Date,
				product: {
					SID: string,
					SID_PRODUCT_INFORMATION: string,
					QTY: number,
					CREATED_DATETIME: Date,
					MODIFIED_DATETIME: Date;
					images: ProductImageType[],
					discount_promotion?: DiscountPromotionType[],
					SELLABLE: boolean,
				}
				productAttribute: ProductAttributeType,
			}>
		}>;
	}
}

interface arrType {
	SID: string,
	PRODUCT_NAME: string,
	UNIT_PRICE: number,
	PRISM_URL: string,
	IMAGE_NAME: string,
	CATEGORY_NAME: string,
	RATING: string,
	DISC_VALUE: number,
}


// export const getStaticPaths: GetStaticPaths = async () => {
// 	return {
// 		paths: [],
// 		fallback: true
// 	}
// }

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	try {
		const psid = context.query ? context.query.psid : '';
		if (psid === '')
			return {
				notFound: true
			}
		const response = await axios.get(`http://localhost:5035/products/product-information/${psid}`);
		// console.log(response.data);
		return {
			props: {
				details: {
					productByGroupedAttribute: (response.data.productByGroupedAttribute) ? response.data.productByGroupedAttribute : [],
					productInformation: (response.data.productInformation) ? response.data.productInformation : null
				}
			}
		}
	}
	catch (ex) {
		return {
			notFound: true
		}
	}
}


const mapDispatchToProps = {
	product_detail: productDetailsActions.getProductDetail,
	addToCart: cartActions.addToCart,
	addWishList: wishListActions.addToWishList,
	getWishListOneProduct: wishListActions.getWishListOneProduct,
	deleteWishListOneProduct: wishListActions.deleteWishListOneProduct,
	getWishListNumber: wishListActions.getWishListNumber
}

const mapStateToProps = (state: RootReducerType) => {
	return {
		//details: state.productDetail,
		wishList: state.wishList,
		customerInfo: state.global.customer_info,
		cartInfo: state.global.cartInfo,
	}
}

interface wishListObj {
	SID: string | string[] | undefined;
	has: boolean;
}

type DetailsPropType = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & InferGetServerSidePropsType<typeof getServerSideProps>;

const Details: FC<DetailsPropType> = ({ customerInfo, details, wishList, cartInfo, product_detail, deleteWishListOneProduct, addToCart, addWishList, getWishListNumber, getWishListOneProduct }) => {
	const router = useRouter();
	const { t } = useTranslation();
	// console.log(details);
	const { productByGroupedAttribute, productInformation } = details;
	// const productInformation = (details && details.productInformation) ? details.productInformation : null;
	// const productByGroupedAttribute = (details && details.productByGroupedAttribute) ? details.productByGroupedAttribute: [];
	const [images, setImages] = useState<ProductImageType[]>([]);
	const [favorite, setFavorite] = useState<wishListObj>({ has: false, SID: '' });
	const [selectedProductByAttributes, setSelectedProductByAttributes] = useState<Array<{
		ID: number,
		SID_PRODUCT: string,
		PRODUCT_ATTRIBUTE_ID: number,
		CREATED_DATETIME: Date,
		MODIFIED_DATETIME: Date,
		VALUE_VARCHAR: string,
		VALUE_INT: number,
		VALUE_DECIMAL: number,
		VALUE_DATETIME: Date,
		product: {
			SID: string,
			SID_PRODUCT_INFORMATION: string,
			QTY: number,
			CREATED_DATETIME: Date,
			MODIFIED_DATETIME: Date;
			images: ProductImageType[],
			discount_promotion?: DiscountPromotionType[],
			SELLABLE: boolean,
		},
		productAttribute: ProductAttributeType,
	}>>([]);
	const [selectedGroupId, setSelectedGroupId] = useState(1);
	const [selectedProduct, setSelectedProduct] = useState<{
		SID: string,
		SID_PRODUCT_INFORMATION: string,
		QTY: number,
		CREATED_DATETIME: Date,
		MODIFIED_DATETIME: Date,
		images: ProductImageType[],
		discount_promotion?: DiscountPromotionType[],
		SELLABLE: boolean,
	} | null>(null);;
	const [currentPictureIndex, setCurrentPictureIndex] = useState(0);
	const [list, setList] = useState<Array<arrType>>([]);
	const [discount, setDiscount] = useState<number>(0);
	const [qty, setQty] = useState("1");
	let qtyRef: React.RefObject<HTMLInputElement>;
	qtyRef = createRef();

	const viewDetails = (name: string, sid: string) => {
		localStorage.setItem('recomendation_sid', sid);

		window.location.href = `/products/detail/${name}?psid=${sid}`;
	};


	useEffect(() => {
		if (!router.isReady) return;
		let queryObj = router.query;
		let psid: string | string[] | undefined;
		if (queryObj && queryObj['psid']) {
			psid = queryObj['psid'];
			//product_detail(psid);
			getWishListOneProduct(psid);
		}
	}, [router.isReady])

	useEffect(() => {
		if (wishList.wishList.error === 0 && wishList.wishList.msg === ''
			&& wishList.wishList.SID !== null && wishList.wishList.SID !== undefined && wishList.wishList.SID.length > 0) {
			// console.log('1');
			setFavorite({ has: true, SID: wishList.wishList.SID })
		}
		else {
			// console.log('0');
			setFavorite({ has: false, SID: '' })
		}
		// console.log('1');
		getWishListNumber();
	}, [wishList.wishList])

	useEffect(() => {

		const viewHist = async () => {
			const pSid = productInformation?.SID;
			let custSid = "";
			if (!customerInfo) {
				custSid = "";
			}
			else {
				custSid = customerInfo?.SID;
			}
			let url = `http://localhost:5035/customers/viewHist?CUST_SID=${custSid}&TSID=${pSid}`;
			const response = await axios({
				url,
				method: 'GET',
			});

		};

		viewHist();
	}, [productInformation])

	useEffect(() => {

		const getProducts = async () => {
			try {
				let custSid = "0";
				if (!customerInfo) {
					custSid = "0";
				}
				else {
					custSid = customerInfo?.SID;
				}

				const cateSid = productInformation?.categoryConnections[0].SID_CATEGORY!;
				const pSid = productInformation?.SID;

				const brandSid = productInformation?.SID_BRAND;
				let url = `http://localhost:5035/products/getProductRecommend?CATEGORY=${cateSid}&TSID=${pSid}&CUST_SID=${custSid}&BRAND_SID=${brandSid}`;
				const response = await axios({
					url,
					method: 'GET',
				});
				const dtproduct = await response.data;
				setList(dtproduct.details.product);
				console.log(list);
			}
			catch (ex) {
			}

		};
		if (productInformation) {
			getProducts();
		}
	}, [productInformation])

	useEffect(() => {
		if (productByGroupedAttribute.length > 0) {
			setImages(productByGroupedAttribute[0].groupedProducts[0].product.images);
			setSelectedGroupId(productByGroupedAttribute[0].GROUP_ID);
			productByGroupedAttribute[0].groupedProducts
			setSelectedProductByAttributes(productByGroupedAttribute[0].groupedProducts);
			setSelectedProduct(productByGroupedAttribute[0].groupedProducts[0].product);
			if (productByGroupedAttribute[0].groupedProducts[0].product.discount_promotion?.length === 1)
				setDiscount(productByGroupedAttribute[0].groupedProducts[0].product.discount_promotion[0].DISC_VALUE)
		}
	}, [productByGroupedAttribute])


	function actionWithList() {
		if (customerInfo) {
			if (favorite.has === false) {
				if (productInformation) {
					addWishList(productInformation.SID);
				}
			} else {
				deleteWishListOneProduct(favorite.SID);
			}
		} else {
			alert('Only logged in customer be able to use this feature');
		}
	}

	function addItemToCart() {
		if (selectedProduct) {
			addToCart(selectedProduct.SID, parseInt(qty));
		}
	}

	const decreaseQty = () => {
		if (parseInt(qty) > 1) {
			const newQty = (parseInt(qty) - 1) + "";
			setQty(newQty);
		}
	}

	const increaseQty = () => {
		const newQty = (parseInt(qty) + 1) + "";
		setQty(newQty);
	}

	const handleFocus = (ref: React.RefObject<any>) => {
		if (ref && ref.current) {
			ref.current.style.border = "1px solid #3f51b5";
		}
	}
	const handleBlur = (ref: React.RefObject<any>) => {
		if (ref && ref.current) {
			ref.current.style.border = "none";
		}
	};


	return (
		<div className="container" style={{ marginTop: '30px', marginLeft: '56px' }}>
			<div className="product-single-container product-single-default">
				<div className="row">
					<div className="col-md-5 product-single-gallery">
						{images.length > 0 ?
							<SideBySideMagnifier
								className="current-picture"
								alwaysInPlace={true}
								cursorStyle="zoom-in"
								imageSrc={images[currentPictureIndex].PRISM_URL ?
									`${PRISM_URL}/images/${images[currentPictureIndex].PRISM_URL}` :
									`http://localhost:5035/products/image/${images[currentPictureIndex].IMAGE_NAME}`
								}
								imageAlt={'Image ' + images[currentPictureIndex].IMAGE_TYPE}
							/>
							: <SideBySideMagnifier
								className="current-picture"
								alwaysInPlace={true}
								cursorStyle="zoom-in"
								imageSrc={"https://cdn5.vectorstock.com/i/1000x1000/98/14/empty-photo-frame-on-transparent-background-vector-20569814.jpg"}
								imageAlt={'Default image'}
							/>
						}
						<div id="picture-selector">
							{images.map((image, i) =>
								<img
									key={image.SID}
									style={{
										border: i === currentPictureIndex ? '1.5px solid #2980b9' : 'none'
									}}
									onClick={() => {
										setCurrentPictureIndex(i);
									}}
									src={
										image.PRISM_URL ?
											`${PRISM_URL}/images/${image.PRISM_URL}` :
											`http://localhost:5035/products/image/${image.IMAGE_NAME}`
									} />
							)}
						</div>
					</div>

					<div className="col-md-7 product-single-details">
						<div className="product-single-title">
							<h1 className="product-title">{productInformation ? productInformation.PRODUCT_NAME : 'Default name'}</h1>
							<button
								style={{
									border: 'none',
									backgroundColor: 'transparent',
									outline: 'none',
									cursor: 'pointer'
								}}
								onClick={() => actionWithList()}>
								{
									(favorite.has) ?
										(<Favorite
											fontSize={'large'} style={{
												fill: '#e74c3c',
												fontSize: '3rem',
											}} />)
										:
										(<FavoriteBorder fontSize={'large'} style={{ fontSize: '3rem' }} />)
								}
							</button>
						</div>
						<br />
						{selectedProduct ?
							!selectedProduct.SELLABLE ?
								<div className="out-of-stock-container">
									{t("productDetails.outOfStock")}
								</div>
								:
								null
							: null
						}
						<div className="ratings-container">
							<div className="product-ratings">
								<span className="ratings" style={{ width: "60%" }}></span>
							</div>

							<a href="#" className="rating-link">( 6 {t('productDetails.reviews')} )</a>
						</div>

						<hr className="short-divider" />

						<div className="price-box">
							<span className="product-price">
								{`${formatter(details && details.productInformation ? Math.round(details.productInformation?.productPrices.sort((a, b) => new Date(b.CREATED_DATETIME).getTime() - new Date(a.CREATED_DATETIME).getTime())[0].UNIT_PRICE * (1 - discount / 100)) : 0)}`}
							</span>
							{
								discount > 0 && (
									<span className="original-price">
										{formatter(details && details.productInformation ? Math.round(details.productInformation?.productPrices.sort((a, b) => new Date(b.CREATED_DATETIME).getTime() - new Date(a.CREATED_DATETIME).getTime())[0].UNIT_PRICE) : 0)}
									</span>
								)
							}
							{
								discount > 0 && (
									<span className="discount-number">
										-{discount}%
									</span>
								)
							}

						</div>
						{/* 
						<div
							id='short-des-div'
							className="product-desc">
							<a href="#">(read more)</a>
						</div> */}

						<div className="product-filters-container">
							<div className="product-single-filter mb-2">
								<label style={{ width: '50px' }}>{productInformation ? productInformation.productAttributeGroups[0].productAttribute.LABEL_TEXT : null}: </label>
								<ul className="config-size-list">
									{
										productByGroupedAttribute.length > 0 ?
											productByGroupedAttribute.map(pbga =>
												pbga.GROUP_ATTRIBUTE_NAME.includes('color') ?
													selectedGroupId === pbga.GROUP_ID ?
														<li className="color-list color-list--active">
															<img src={
																pbga.groupedProducts[0].product.images[0].PRISM_URL ?
																	`${PRISM_URL}/images/${pbga.groupedProducts[0].product.images[0].PRISM_URL}` :
																	`http://localhost:5035/products/image/${pbga.groupedProducts[0].product.images[0].IMAGE_NAME}`
															} />
														</li>
														:
														<li
															className='color-list'
															onClick={() => {
																setSelectedProduct(pbga.groupedProducts[0].product);
																setImages(pbga.groupedProducts[0].product.images);
																setSelectedGroupId(pbga.GROUP_ID);
																setSelectedProductByAttributes(pbga.groupedProducts);
																(pbga.groupedProducts[0].product.discount_promotion && pbga.groupedProducts[0].product.discount_promotion.length === 1)
																	? setDiscount(pbga.groupedProducts[0].product.discount_promotion[0].DISC_VALUE)
																	: setDiscount(0);
															}}
														>
															<img src={
																pbga.groupedProducts[0].product.images[0].PRISM_URL ?
																	`${PRISM_URL}/images/${pbga.groupedProducts[0].product.images[0].PRISM_URL}` :
																	`http://localhost:5035/products/image/${pbga.groupedProducts[0].product.images[0].IMAGE_NAME}`
															} />
														</li>
													:
													selectedGroupId === pbga.GROUP_ID ?
														<li className="not-color-list not-color-list--active"><a
															style={{
																cursor: 'pointer',
															}}
														>
															{pbga.GROUP_ATTRIBUTE_VALUE}
														</a></li>
														:
														<li
															className='not-color-list'
															onClick={() => {
																setSelectedProduct(pbga.groupedProducts[0].product);
																setImages(pbga.groupedProducts[0].product.images);
																setSelectedGroupId(pbga.GROUP_ID);
																setSelectedProductByAttributes(pbga.groupedProducts);
																(pbga.groupedProducts[0].product.discount_promotion && pbga.groupedProducts[0].product.discount_promotion.length === 1)
																	? setDiscount(pbga.groupedProducts[0].product.discount_promotion[0].DISC_VALUE)
																	: setDiscount(0);
															}}
														><a style={{
															cursor: 'pointer',
														}}
														>
																{pbga.GROUP_ATTRIBUTE_VALUE}
															</a></li>
											)
											: null
									}
								</ul>
							</div>
						</div>
						<div className="product-filters-container">
							<div className="product-single-filter mb-2">
								<label style={{ width: '50px' }}>{selectedProductByAttributes.length > 0 ? selectedProductByAttributes[0].productAttribute.LABEL_TEXT : null}: </label>
								<ul className="config-size-list">
									{
										selectedProductByAttributes.length > 0 && selectedProduct ?
											selectedProductByAttributes.map(spba =>
												selectedProduct.SID === spba.product.SID ?
													<li
														className='not-color-list not-color-list--active'
														onClick={() => {
															setImages(spba.product.images);
															setSelectedProduct(spba.product);
															(spba.product.discount_promotion && spba.product.discount_promotion.length === 1)
																? setDiscount(spba.product.discount_promotion[0].DISC_VALUE)
																: setDiscount(0);
														}}
													>
														<a
															style={{ cursor: 'pointer' }}
														>
															{spba.VALUE_VARCHAR ? spba.VALUE_VARCHAR
																: spba.VALUE_INT ? spba.VALUE_INT
																	: spba.VALUE_DECIMAL ? Number.parseFloat(spba.VALUE_DECIMAL.toString()).toFixed(1)
																		: spba.VALUE_DATETIME ? spba.VALUE_DATETIME
																			: null}
														</a>
													</li>
													:
													<li
														className='not-color-list'
														onClick={() => {
															setImages(spba.product.images);
															setSelectedProduct(spba.product);
															(spba.product.discount_promotion && spba.product.discount_promotion.length === 1)
																? setDiscount(spba.product.discount_promotion[0].DISC_VALUE)
																: setDiscount(0);
														}}
													>
														<a
															style={{ cursor: 'pointer' }}
														>
															{spba.VALUE_VARCHAR ? spba.VALUE_VARCHAR
																: spba.VALUE_INT ? spba.VALUE_INT
																	: spba.VALUE_DECIMAL ? Number.parseFloat(spba.VALUE_DECIMAL.toString()).toFixed(1)
																		: spba.VALUE_DATETIME ? spba.VALUE_DATETIME
																			: null}
														</a>
													</li>
											)
											: null
									}
								</ul>
							</div>
						</div>

						<hr className="divider" />

						<div className="product-action">
							{/* <div className="product-single-qty">
								<input className="horizontal-quantity form-control" type="text" />
							</div> */}
							<div className="quantity-field">
								<div className="quantity-field__top">
									Số Lượng
								</div>
								<div className="quantity-field__bottom">
									<div
										onClick={() => {
											decreaseQty();
										}}
										className="quantity-field__bottom__left">
										-
									</div>
									<div className="quantity-field__bottom__center">
										<input
											onFocus={() => {
												handleFocus(qtyRef);
											}}
											onBlur={() => {
												handleBlur(qtyRef);
											}}
											ref={qtyRef}
											type="text"
											value={qty}
											onChange={(e) => {
												if (e.target.value.trim() !== "") {
													if (validator.isNumeric(e.target.value)) {
														setQty(e.target.value);
													}
												} else {
													setQty("");
												}
											}}
										/>
									</div>
									<div
										onClick={() => {
											increaseQty();
										}}
										className="quantity-field__bottom__right">
										+
									</div>
								</div>
							</div>
							{selectedProduct ?
								<a
									style={{
										color: 'white',
										opacity: selectedProduct.SELLABLE ? 1 : 0.25,
										cursor: selectedProduct.SELLABLE ? 'pointer' : 'not-allowed'
									}}
									onClick={() => {
										if (!selectedProduct.SELLABLE) return;
										addItemToCart();
									}} className="btn btn-dark add-cart icon-shopping-cart" title={t("productDetails.addToCart")}>{t("productDetails.addToCart")}</a>
								: null
							}
						</div>
						<br />
						<div className="product-action">
							{selectedProduct ?
								<a
									style={{
										color: 'white',
										background: '#3f51b5',
										borderColor: '#3f51b5',
										opacity: selectedProduct.SELLABLE ? 1 : 0.25,
										cursor: selectedProduct.SELLABLE ? 'pointer' : 'not-allowed'
									}}
									onClick={() => {
										if (!selectedProduct.SELLABLE) return;
										addItemToCart();
										router.push('/cart');
									}} className="btn btn-dark add-cart" title={t("productDetails.buy")}>{t("productDetails.buy")}</a>
								: null
							}
						</div>

						<hr className="divider mb-1" />

						<div className="product-single-share">
							<label className="sr-only">Share:</label>

							<div className="social-icons mr-2">
								<a href="#" className="social-icon social-facebook icon-facebook" target="_blank" title="Facebook"></a>
								<a href="#" className="social-icon social-twitter icon-twitter" target="_blank" title="Twitter"></a>
								<a href="#" className="social-icon social-linkedin fab fa-linkedin-in" target="_blank" title="Linkedin"></a>
								<a href="#" className="social-icon social-gplus fab fa-google-plus-g" target="_blank" title="Google +"></a>
								<a href="#" className="social-icon social-mail icon-mail-alt" target="_blank" title="Mail"></a>
							</div>

							{/* <a href="#" className="add-wishlist" title="Add to Wishlist">Add to Wishlist</a> */}
						</div>
					</div>
				</div>
			</div>

			<div className="product-single-tabs">
				<ul className="nav nav-tabs" role="tablist">
					<li className="nav-item">
						<a className="nav-link active" id="product-tab-desc" data-toggle="tab" href="#product-desc-content" role="tab" aria-controls="product-desc-content" aria-selected="true">{t('product.description')}</a>
					</li>
					{/* <li className="nav-item">
						<a className="nav-link" id="product-tab-more-info" data-toggle="tab" href="#product-more-info-content" role="tab" aria-controls="product-more-info-content" aria-selected="false">More Info</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" id="product-tab-tags" data-toggle="tab" href="#product-tags-content" role="tab" aria-controls="product-tags-content" aria-selected="false">Tags</a>
					</li> */}
					<li className="nav-item">
						<a className="nav-link" id="product-tab-reviews" data-toggle="tab" href="#product-reviews-content" role="tab" aria-controls="product-reviews-content" aria-selected="false">{t('product.review')}`</a>
					</li>
				</ul>
				<div className="tab-content">
					<div className="tab-pane fade show active" id="product-desc-content" role="tabpanel" aria-labelledby="product-tab-desc">
						<div
							id='long-desc-div'
							className="product-desc-content">
						</div>
					</div>

					<div className="tab-pane fade fade" id="product-more-info-content" role="tabpanel" aria-labelledby="product-tab-more-info">
						<div className="product-desc-content">
							<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat.</p>
						</div>
					</div>

					<div className="tab-pane fade" id="product-tags-content" role="tabpanel" aria-labelledby="product-tab-tags">
						<div className="product-tags-content">
							<form action="#">
								<h4>Add Your Tags:</h4>
								<div className="form-group">
									<input type="text" className="form-control form-control-sm" required />
									<input type="submit" className="btn btn-dark" value="Add Tags" />
								</div>
							</form>
							<p className="note">Use spaces to separate tags. Use single quotes (') for phrases.</p>
						</div>
					</div>

					<div className="tab-pane fade" id="product-reviews-content" role="tabpanel" aria-labelledby="product-tab-reviews">
						<div className="product-reviews-content">
							<div className="row">
								<div className="col-xl-7">
									<h2 className="reviews-title">3 reviews for Product Long Name</h2>

									<ol className="comment-list">
										<li className="comment-container">
											<div className="comment-avatar">

											</div>

											<div className="comment-box">
												<div className="ratings-container">
													<div className="product-ratings">
														<span className="ratings" style={{ width: "80%" }}></span>
													</div>
												</div>

												<div className="comment-info mb-1">
													<h4 className="avatar-name">John Doe</h4> - <span className="comment-date">Novemeber 15, 2019</span>
												</div>

												<div className="comment-text">
													<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.</p>
												</div>
											</div>
										</li>

										<li className="comment-container">
											<div className="comment-avatar">

											</div>

											<div className="comment-box">
												<div className="ratings-container">
													<div className="product-ratings">
														<span className="ratings" style={{ width: "80%" }}></span>
													</div>
												</div>

												<div className="comment-info mb-1">
													<h4 className="avatar-name">John Doe</h4> - <span className="comment-date">Novemeber 15, 2019</span>
												</div>

												<div className="comment-text">
													<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.</p>
												</div>
											</div>
										</li>

										<li className="comment-container">
											<div className="comment-avatar">

											</div>

											<div className="comment-box">
												<div className="ratings-container">
													<div className="product-ratings">
														<span className="ratings" style={{ width: "80%" }}></span>
													</div>
												</div>

												<div className="comment-info mb-1">
													<h4 className="avatar-name">John Doe</h4> - <span className="comment-date">Novemeber 15, 2019</span>
												</div>

												<div className="comment-text">
													<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.</p>
												</div>
											</div>
										</li>
									</ol>
								</div>

								<div className="col-xl-5">
									<div className="add-product-review">
										<form action="#" className="comment-form m-0">
											<h3 className="review-title">Add a Review</h3>

											<div className="rating-form">
												<label>Your rating</label>
												<span className="rating-stars">
													<a className="star-1" href="#">1</a>
													<a className="star-2" href="#">2</a>
													<a className="star-3" href="#">3</a>
													<a className="star-4" href="#">4</a>
													<a className="star-5" href="#">5</a>
												</span>

												<select name="rating" id="rating" required={true} style={{ display: 'none' }}>
													<option value="">Rate…</option>
													<option value="5">Perfect</option>
													<option value="4">Good</option>
													<option value="3">Average</option>
													<option value="2">Not that bad</option>
													<option value="1">Very poor</option>
												</select>
											</div>

											<div className="form-group">
												<label>Your Review</label>
												<textarea cols={5} rows={6} className="form-control form-control-sm"></textarea>
											</div>

											<div className="row">
												<div className="col-md-6 col-xl-12">
													<div className="form-group">
														<label>Your Name</label>
														<input type="text" className="form-control form-control-sm" required />
													</div>
												</div>

												<div className="col-md-6 col-xl-12">
													<div className="form-group">
														<label>Your E-mail</label>
														<input type="text" className="form-control form-control-sm" required />
													</div>
												</div>
											</div>

											<input type="submit" className="btn btn-dark ls-n-15" value="Submit" />
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="products-section pt-0">
				<h2 className="section-title">{t('product.related')}</h2>
				<div className="homepage-container__products-container">
					<div style={{ display: 'flex', flexFlow: 'row wrap', width: '100%', }} >
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

				{/* <div style={{ display: 'flex', flexFlow: 'row wrap', width: '100%' }} >
					{list && list.length > 0 ? list.map(product =>
						<ul style={{ width: '25%' }}  >
							<div style={{ width: '100%' }} className='products-container__right__products-container__item'>
								<li style={{ display: 'inline-flex', flexWrap: 'wrap' }} >
									<div onClick={() => { viewDetails(product.PRODUCT_NAME, product.SID) }}  >
										<div className='products-container__right__products-container__item__top'>
											<img src={
												product.PRISM_URL ?
													`${PRISM_URL}/images/${product.PRISM_URL}` :
													`http://localhost:5035/products/image/${product.IMAGE_NAME}`
											} />
										</div>
										<div style={{ display: 'block', flexFlow: 'row wrap' }} className='products-container__right__products-container__item__bottom'>
											<div className='products-container__right__products-container__item__bottom__top'>
												<div className='products-container__right__products-container__item__bottom__top__left'>
													<p>{product.CATEGORY_NAME}</p>
												</div>
											</div>
											<div className='products-container__right__products-container__item__bottom__middle'>
												<p>{product.PRODUCT_NAME}</p>
											</div>
											<div className='products-container__right__products-container__item__bottom__price'>
												<p>{formatter(product.UNIT_PRICE)}</p>
											</div>
										</div>
									</div>
								</li>
							</div >
						</ul>
					) : null}
				</div> */}
			</div>
		</div >
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(Details);
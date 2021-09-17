import React, { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { formatter } from '../../utils/currency.formatter';
import axios from "axios";
import { RootReducerType } from "../../redux/rootReducer";
import { FC } from "react";
import { actions } from "../../redux/action_reducer_saga/cart/action";
import { actions as actionsCustomer } from '../../redux/action_reducer_saga/customer/wishlist/action'
import { CategoryType, OrderDetailType } from "../../redux/types";
import Login from "../../pages/login";
import Carousel from 'react-material-ui-carousel';
import { useTranslation } from 'react-i18next';
import OrderDetail from '../../pages/customer/orders/[order_id]'

interface Term {
	ID: number;
	SEARCH_TERM: string;
	COUNT: number;
	CREATED_DATETIME: Date;
	MODIFIED_DATETTIME: Date;
}

const mapStateToProps = (state: RootReducerType) => {
	return {
		customer_info: state.global.customer_info,
		cartInfo: state.global.cartInfo,
		wishListNumber: state.wishList.wishListNumber
	}
}

const mapDispatchToProps = {
	removeItemFromCart: actions.removeProductFromCart,
	getWishListNumber: actionsCustomer.getWishListNumber
}

type HeaderPropsTypes = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const Header: FC<HeaderPropsTypes> = ({ customer_info, cartInfo, wishListNumber, removeItemFromCart, getWishListNumber }) => {
	const { t } = useTranslation();
	const [isDisplayModal, setIsDisplayModal] = useState(false);
	const [description, setDescription] = useState<string[]>([]);
	//const [categories, setCategories] = useState(initialCategories);
	const [searchString, setSearchString] = useState('');
	const [suggestedTerms, setSuggestedTerms] = useState<Term[]>([]);
	const [isClickedSuggested, setIsClickedSuggested] = useState(false);
	const [isOpenSubMenu, setOpenSubMenu] = useState(false);
	const [currentSegment, setCurrentSegment] = useState('');
	const [categoriesBySegment, setCategoriesBySegment] = useState<Array<CategoryType>>([]);
	const [oldTotalCartItems, setOldTotalCartItems] = useState(0);
	const [initialLoad, setInitialLoad] = useState(true);
	const [openAddToCartSuccessModal, setOpenAddToCartSuccessModal] = useState(false);
	const [openCheckOrderModal, setOpenCheckOrderModal] = useState(false);
	const [openLoginModal, setOpenLoginModal] = useState(false);
	const [languageName, setLanguageName] = useState('');
	const [email, setEmail] = useState<string>("");
	const [orderID, setOrderID] = useState<string>("");
	const [openOrderModal, setOpenOrderModal] = useState<boolean>(false);
	const [orderDetailHeader, setOrderDetailHeader] = useState<OrderDetailType>();
	let inputRef: React.RefObject<HTMLInputElement>;
	inputRef = React.createRef();
	const router = useRouter();

	function toggleSearchBar() {
		setIsDisplayModal(!isDisplayModal);
	}

	function searchProducts() {
		window.location.href = `/products?q=${searchString}&page=1`;
	}

	useEffect(() => {
		getWishListNumber();
	}, [router.isReady])

	useEffect(() => {
		// const getCategories = async () => {
		// 	const response = await axios({
		// 		url: 'http://localhost:5035/categories',
		// 		method: 'GET',

		// 	})
		// 	const data = await response.data;
		// 	const categories = data.categories;
		// 	// setCategories(categories);
		// }
		// getCategories();

		async function getPromotionAll() {
			try {
				const response = await axios({
					method: "GET",
					url: 'http://localhost:5035/promotion/get/all/active'
				})
				// console.log(response);
				if (response.status === 200) {
					let tmpStr: string[] = [];
					response.data.map((item: any) => {
						tmpStr.push(item.DESCRIPTION);
					})
					setDescription(tmpStr);
				}
			}
			catch (ex) { }
		}

		getPromotionAll();

		window.onclick = function (e: any) {
			if (
				e.toElement
				&&
				e.toElement.name
				&&
				e.toElement.name !== 'searchString'
				&& e.toElement.name !== 'category-search'
				&& e.toElement.className !== 'icon-search-3'
				&& e.toElement.className !== 'suggested-terms-container'
				&& e.toElement.className != 'suggested-term-container'
				&& e.toElement.className != 'search-container'
				&& e.toElement.className != 'search-bar-modal'
				&& e.toElement.className != 'search-option'
				&& e.toElement.className != 'search-bar-modal__right'
				&& e.toElement.className != 'search-bar-modal__left'
				&& e.toElement.className != 'search-bar-modal__center'
				&& e.toElement.parentElement
				&& e.toElement.parentElement.className != 'suggested-term-container'
				&& e.toElement.id != 'layout'
			) {
				setSearchString('');
				setSuggestedTerms([]);
			}
		}
	}, [])

	useEffect(() => {
		if (searchString.trim().length > 2 && !isClickedSuggested) {
			const getSuggestionTerms = async () => {
				const response = await axios({
					url: `http://localhost:5035/products/auto-complete/${searchString.trim().toLowerCase()}`,
					method: 'GET',
				})
				const data = await response.data;
				setSuggestedTerms(data.terms);
			}
			getSuggestionTerms();
		} else {
			setSuggestedTerms([]);
		}
	}, [searchString])

	const removeItem = (SID_PRODUCT: string) => {
		removeItemFromCart(SID_PRODUCT);
	}

	const getCategoriesBySegment = async (name: string) => {
		if (currentSegment !== name) {
			setCurrentSegment(name);
			const response = await axios({
				url: `http://localhost:5035/categories/segment/${name}`,
				method: 'GET',
				withCredentials: true,
			})
			const data = response.data;
			const categories = data.categories;
			setCategoriesBySegment(categories);
			setOpenSubMenu(false);
			setOpenSubMenu(true);
		} else {
			setCurrentSegment('')
			setCategoriesBySegment([]);
			setOpenSubMenu(false);
		}
	}

	useEffect(() => {
		if (cartInfo) {
			if (!initialLoad) {
				if (cartInfo.TOTAL_ITEMS > oldTotalCartItems) {
					window.scrollTo({ behavior: 'smooth', left: 0, top: 0 });
					setOpenAddToCartSuccessModal(true);
				} else {
					setOpenAddToCartSuccessModal(false);
				}
				setOldTotalCartItems(cartInfo.TOTAL_ITEMS)
			} else {
				setInitialLoad(false);
			}
		}
	}, [cartInfo?.TOTAL_ITEMS])

	const changeLanguage = (language: string) => {
		window.localStorage.setItem('i18nextLng', language);
		window.location.reload();
	}

	const handleCheckOrder =  async (email: string, orderID: string) => {
		if (email !== "" && orderID !== "") {
			const response = await axios({
				method: "POST",
				url: 'http://localhost:5035/orders/check-order',
				data: {
					EMAIL: email,
					ID: orderID 
				}
			})
			if (response.status === 200) {
				console.log(response.data);
				setOrderDetailHeader(response.data);
				setOpenOrderModal(true);
			}
		}
		
	}

	useEffect(() => {
		const languageName = getLanguageName();
		setLanguageName(languageName);
	}, [])

	const getLanguageName = () => {
		let languageName = "English";
		const languageCode = window.localStorage.getItem('i18nextLng');
		switch (languageCode) {
			case 'en':
				languageName = 'English';
				break;
			case 'vi':
				languageName = 'Vietnamese';
				break;
			default:
				languageName = 'English';
				break;
		}
		return languageName;
	}

	return (
		<div>
			<div
				className="top-notice bg-dark text-white"
			>
				<Carousel className="container text-center pl-6 pr-6" indicators={false} navButtonsAlwaysInvisible={true}>
					{
						description.map((desc) => (
							<div>
								<h5 className="d-inline-block mb-0 m-r-1">{desc}</h5>
								<a href="category.html" className="category">MEN</a>
								<a href="category.html" className="category m-l-1 m-r-2">WOMEN</a>
								<button title="Close (Esc)" type="button" className="mfp-close">×</button>
							</div>
						))
					}
					{/* <h5 className="d-inline-block mb-0 m-r-1">Get Up to <b>40% OFF</b> New-Season Styles</h5>
					<a href="category.html" className="category">MEN</a>
					<a href="category.html" className="category m-l-1 m-r-2">WOMEN</a>
					<small>* Limited time only.</small>
					<button title="Close (Esc)" type="button" className="mfp-close">×</button> */}
				</Carousel>
			</div>
			<div className="header-wrapper">
				<div className="header">
					<div className="header-top">
						<div className="container d-flex">
							<div className="header-left">
								<div className="header-dropdown">
									<a
										style={{ color: 'black' }}
										href="#" className="pl-0">
										{languageName}
									</a>
									<div className="header-menu">
										<ul>
											<li
												onClick={() => { changeLanguage('en') }}
												style={{ cursor: 'pointer' }}
											><a>English</a></li>
											<li
												onClick={() => { changeLanguage('vi') }}
												style={{ cursor: 'pointer' }}
											><a>Vietnamese</a></li>
										</ul>
									</div>
								</div>
							</div>
							<div className="header-right header-dropdowns ml-0 ml-sm-auto">
								<div className="header-dropdown dropdown-expanded">
									<div className="header-menu">
										<ul>
											<li className="check-modal-menu">
												<a
													style={{ cursor: 'pointer' }}
													onClick={() => {
														setOpenCheckOrderModal(!openCheckOrderModal);
													}}
												>{t('header.checkOrder')}</a>
												{
													openCheckOrderModal ?
														<div className="check-order-modal">
															<div className="check-order-modal-title">
																<p>{t('header.checkOrderModal.checkOrder')}</p>
															</div>
															<div className="check-order-modal-field">
																<div className="check-order-modal-field-title">
																	<p>{t('header.checkOrderModal.field.title1')}</p>
																</div>
																<div className="check-order-modal-field-input">
																	<input type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
																</div>
															</div>
															<div className="check-order-modal-field">
																<div className="check-order-modal-field-title">
																	<p>{t('header.checkOrderModal.field.title2')}</p>
																</div>
																<div className="check-order-modal-field-input">
																	<input type="text" value={orderID} onChange={(e) => setOrderID(e.target.value)}/>
																</div>
															</div>
															<button onClick={() => handleCheckOrder(email, orderID)}>
																<i className="fas fa-search" ></i>
															</button>
														</div>
														: null
												}
											</li>
											{
												customer_info ?
													< li ><a href="my-account.html">{t('header.myAccount')}</a></li>
													: null
											}
											{
												customer_info ?
													<li><a href="/customer/wishlist">{t('header.myWishlist')}</a></li>
													: null
											}
											{
												!customer_info ?
													<li><a href="/login" className="login-link">{t('header.login')}</a></li>
													:
													<li><a href="/logout" className="login-link">{t('header.logout')}</a></li>
											}
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="header-middle sticky-header">
						<div className="container d-flex">
							<div className="header-left">
								<button className="mobile-menu-toggler" type="button">
									<i className="icon-menu"></i>
								</button>

								<a href="/" className="logo">
									<img src="/logo.png" alt="Logo" />
								</a>

								<nav className="main-nav font2">
									<ul className="menu">
										<li>
											<a href="/">{t('menu.home')}</a>
										</li>
										<li style={{
											borderBottom: currentSegment === "WOM" ? '3px solid black' : 'none'
										}}>
											<a onClick={() => {
												getCategoriesBySegment('WOM');
											}}
											>{t('menu.women')}</a>
										</li>
										<li style={{
											borderBottom: currentSegment === "MEN" ? '3px solid black' : 'none'
										}}
										>
											<a
												onClick={() => {
													getCategoriesBySegment('MEN');
												}}
											>{t('menu.men')}</a>
										</li>
										<li>
											<a href="#">{t('menu.kids')}</a>
										</li>
									</ul>
								</nav>
								<div className="search-container">
									<div className="search-bar-modal">
										<div className="search-bar-modal__left">
											<input
												ref={inputRef}
												onClick={() => { setIsClickedSuggested(false) }}
												autoComplete="off"
												value={searchString}
												name="searchString"
												onChange={(e) => {
													setSearchString(e.target.value);
												}}
												placeholder={t('searchBar.placeholder')}
											/>
										</div>

										{/* <div className="search-bar-modal__center">
												<select name="category-search">
													<option className="search-option">All Categories</option>
													{categories.map(category =>
														<option key={category.SID}
														>{category.CATEGORY_NAME}</option>
													)}
												</select>
											</div> */}
										<div className="search-bar-modal__right">
											<i
												onClick={() => { searchProducts() }}
												className="icon-search-3"></i>
										</div>
									</div>
									<div className="suggested-terms-container">
										{suggestedTerms.length > 0 ?
											suggestedTerms.map(term =>
												<div
													key={term.SEARCH_TERM}
													onClick={() => {
														setSearchString(term.SEARCH_TERM);
														setIsClickedSuggested(true);
													}}
													className="suggested-term-container">
													<h1>{term.SEARCH_TERM}</h1>
												</div>
											)
											: null}
									</div>
								</div>
							</div>

							<div className="header-right">
								{customer_info ?
									<a href="/customer-info" className="header-icon login-link"><i className="icon-user-2"></i></a>
									:
									<a
										onClick={() => {
											setOpenLoginModal(!openLoginModal);
										}}
										href="#" className="header-icon login-link"><i className="icon-user-2"></i></a>
								}
								<a href="#" className="header-icon position-relative header-wishlist">
									<i className="icon-wishlist-2"></i>
									<span className="cart-count badge-circle bg-secondary">{wishListNumber}</span>
								</a>

								<div className="dropdown cart-dropdown">
									<a
										onMouseOver={() => {
											setOpenAddToCartSuccessModal(false);
										}}
										href="#" className="dropdown-toggle dropdown-arrow" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-display="static">
										<i className="icon-shopping-cart"></i>
										<span className="cart-count badge-circle bg-secondary">
											{cartInfo && cartInfo.TOTAL_ITEMS > 0 ? cartInfo.TOTAL_ITEMS : 0}
										</span>
									</a>
									{cartInfo && cartInfo.TOTAL_ITEMS > 0 ?
										<div className="dropdown-menu" >
											<div className="dropdownmenu-wrapper">
												<div className="dropdown-cart-header">
													<span>
														{cartInfo.TOTAL_ITEMS} {t('header.cart.items')}
													</span>

													<a href="/cart" className="float-right">
														{t('header.cart.viewCart')}
													</a>
												</div>

												<div className="dropdown-cart-products">
													{cartInfo.items.map(item =>
														<div className="product" >
															<div className="product-details">
																<h4 className="product-title">
																	<a href="product.html">{item.product.PRODUCT_NAME}</a>
																</h4>

																<span className="cart-product-info">
																	<span className="cart-product-qty">{item.QUANTITY}</span>
																	x {formatter(item.product.PRICE)}
																</span>
															</div>

															<figure className="product-image-container">
																<a href="product.html" className="product-image">
																	<img src={
																		item.product.images.filter(image => image.IMAGE_TYPE === 1)[0].PRISM_URL ?
																			`http://d71e-58-186-85-28.ap.ngrok.io/images/${item.product.images.filter(image => image.IMAGE_TYPE === 1)[0].PRISM_URL}` :
																			`http://localhost:5035/products/image/${item.product.images.filter(image => image.IMAGE_TYPE === 1)[0].IMAGE_NAME}`
																	} />
																</a>
																<a
																	style={{ cursor: 'pointer' }}
																	onClick={() => {
																		removeItem(item.SID_PRODUCT)
																	}}
																	id="remove-item-btn"
																	className="btn-remove icon-cancel" title="Remove Product"></a>
															</figure>
														</div>
													)}
												</div>


												<div className="dropdown-cart-total">
													<span>{t('header.cart.total')}</span>

													<span className="cart-total-price float-right">{formatter(cartInfo.SUB_TOTAL)}</span>
												</div>

												<div className="dropdown-cart-action">
													<a href="/cart"
														style={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', color: 'white' }}
														className="btn btn-primary btn-block">
														{t('header.cart.checkout')}
													</a>
												</div>
											</div>
										</div>
										:
										<div className="dropdown-menu" >
											<div className="dropdownmenu-wrapper">
												<div className="dropdown-cart-header">
													<span>
														{t('header.cart.cartEmpty')}
													</span>
												</div>
											</div>
										</div>}
								</div>
							</div>
						</div>
					</div>

					{isOpenSubMenu ?
						categoriesBySegment.length > 0 ?
							< div className="sub-menu">
								<div className="sub-menu-right-block">
									{categoriesBySegment.map(category =>
										<div
											onClick={() => {
												window.location.href = `/products?q=*&page=1&category_sid=${category.SID}`;
											}}
										>
											<h1>{category.CATEGORY_NAME}</h1>
										</div>
									)}
								</div>
							</div>
							: null
						: null
					}

					{
						openAddToCartSuccessModal ?
							<div className="add-to-cart-success-modal">
								<div>
									<i className="fas fa-check-circle"></i>&nbsp;t('addToCart.sucess')
								</div>
								<button
									onClick={() => {
										window.location.href = "/cart";
									}}
								>t('addToCart.view')</button>
							</div>
							: null
					}

					{
						openLoginModal ?
							<div className="login-modal-container">
								<div className="login-modal">
									<div className="login-modal-top">
										<i
											onClick={() => {
												setOpenLoginModal(false);
											}}
											className="fas fa-times"></i>
									</div>
									<div className="login-modal-bottom">
										<Login />
									</div>
								</div>
							</div>
							:
							null
					}
					{
						openOrderModal ? 
						<div className="order-modal-container">
								<div className="order-modal">
									<div className="order-modal-top">
										<i
											onClick={() => {
												setOpenOrderModal(false);
											}}
											className="fas fa-times"></i>
									</div>
									<div className="order-modal-bottom">
										<OrderDetail type={"header"} orderFromHeader={orderDetailHeader} />
									</div>
								</div>
							</div>
						: null
					}
				</div>
			</div>
		</div >
	)
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
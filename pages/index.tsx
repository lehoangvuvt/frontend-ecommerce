import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { formatter } from "../utils/currency.formatter";
import Carousel from 'react-material-ui-carousel'
import Rating from "@material-ui/lab/Rating";
import { useTranslation } from 'react-i18next';
import { PRISM_URL } from '../contants/url.constants';

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

interface PromotionImagesListType {
	IMAGE_NAME: string;
}
export default function Home() {
	const [list, setList] = useState<Array<arrType>>([]);
	const { t } = useTranslation();
	const [listPrommo, setListPrommo] = useState<Array<arrType>>([]);
	const [listBestseller, setListBestseller] = useState<Array<arrType>>([]);
	const [promotionImages, setPromotionImages] = useState<PromotionImagesListType[]>([]);
	const viewDetails = (name: string, sid: string) => {
		console.log(name);
		console.log(sid);
		window.location.href = `/products/detail/${name}?psid=${sid}`;
	};
	useEffect(() => {
		async function getPromotionImages() {
			const response = await axios({
				method: 'GET',
				url: 'http://localhost:5035/promotion/images'
			})
			if (response.status === 200) {
				setPromotionImages(response.data);
			}
		}

		const getProducts = async () => {
			try {

				let url = `http://localhost:5035/products/getProductIndex`;
				const response = await axios({
					url,
					method: 'GET',
				});
				const dtproduct = await response.data;
				setList(dtproduct.details.product);
				setListPrommo(dtproduct.details.productPromo);
				setListBestseller(dtproduct.details.productBestseller);


				console.log(list);
			}
			catch (ex) {
			}

		}
		getProducts();
		getPromotionImages();

	}, [])

	return (
		<div className='homepage-container'>
			<div className='homepage-container__top-banner'>
				<Carousel className="homepage-container__carousel">
					{
						promotionImages.map(item => (
							<img src={`http://localhost:5035/promotion/image/${item.IMAGE_NAME}`} />
						))

					}
				</Carousel>
			</div>
			<h2 className="homepage-container__Slide-product" style={{ marginBottom: '10px', fontWeight: 700 }}>{t('home.recommended.newestProducts')}</h2>
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
			<h2 className="homepage-container__Slide-product" style={{ marginBottom: '10px', fontWeight: 700 }}>
				{t('home.recommended.saleOff')}
			</h2>
			<div className="homepage-container__products-container">
				<div style={{ display: 'flex', flexFlow: 'row wrap', width: '85%', }} >
					{listPrommo && listPrommo.length > 0 ? listPrommo.map(product =>

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
			<h2 className="homepage-container__Slide-product" style={{ marginBottom: '10px', fontWeight: 700 }}>
				{t('home.recommended.bestSelling')}
			</h2>
			<div className="homepage-container__products-container">
				<div style={{ display: 'flex', flexFlow: 'row wrap', width: '85%', }} >
					{listBestseller && listBestseller.length > 0 ? listBestseller.map(product =>

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
	)
}


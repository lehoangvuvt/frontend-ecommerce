import { Typography, IconButton } from '@material-ui/core'
import { Clear } from '@material-ui/icons'
import styles from './style.module.css'
import { formatter } from "../../utils/currency.formatter"
import { ProductInformationType } from '../../redux/types'
import { WishList } from '../../redux/action_reducer_saga/customer/wishlist/interface'

type ProductItemType = {
    custWl: WishList,
    fnDelete: (SID: string) => void
}

const ProductItem: React.FC<ProductItemType> = ({ custWl, fnDelete }) => {
    const item: ProductInformationType = custWl.productInformation;
    return (
        <div className={styles.itemProduct}>
            <img
                alt="product-image"
                className={styles.showImage}
                src={
                    item.products[0].images[0].PRISM_URL ?
                        `http://d71e-58-186-85-28.ap.ngrok.io/images/${item.products[0].images[0].PRISM_URL}` :
                        `http://localhost:5035/products/image/${item.products[0].images[0].IMAGE_NAME}`
                } />
            <div className={`${styles.body} ${styles.flexBody}`}>
                <a
                    className={styles.productName}
                    href={`/products/detail/${item.PRODUCT_NAME}?psid=${item.SID}`}
                >
                    {item.PRODUCT_NAME}
                </a>
                <Typography variant="body1">{item.SHORT_DESCRIPTION}</Typography>
            </div>
            <div className={styles.body}>
                {/* <span className={(item.QUANTITY > 0) ? styles.stocking : styles.outOfStock}>
                    {item.QUANTITY > 0 ? 'Còn hàng' : 'Hết hàng'}
                </span> */}
            </div>
            <div className={`${styles.body} ${styles.priceText}`}>
                {formatter(item.productPrices[0].UNIT_PRICE)}
            </div>
            <div onClick={() => fnDelete(custWl.SID)}>
                <IconButton>
                    <Clear />
                </IconButton>
            </div>
        </div>
    )
}

export default ProductItem
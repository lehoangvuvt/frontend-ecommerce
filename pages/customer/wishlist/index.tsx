import MenuAdmin from '../../../component/MenuAdmin'
import { connect } from 'react-redux'
import { RootReducerType } from '../../../redux/rootReducer'
import { actions as wishListAction } from '../../../redux/action_reducer_saga/customer/wishlist/action'
import { Typography } from '@material-ui/core'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { WishList as WishListType } from '../../../redux/action_reducer_saga/customer/wishlist/interface'
import ProductItem from '../../../component/ProductItem'
import { ProductInformationType } from '../../../redux/types'

const mapStateToProps = (state: RootReducerType) => {
    return {
        wishListAll: state.wishList.wishListAll,
        deleteWishListInListResult: state.wishList.wishListDeletedSID
    }
}

const mapDispatchToProps = {
    getWishListAll: wishListAction.getWishListAll,
    deleteWishListInList: wishListAction.deleteWishListInList,
    getWishListNumber: wishListAction.getWishListNumber
}

type IndexType = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const WishList: React.FC<IndexType> = ({ getWishListAll, wishListAll, getWishListNumber, deleteWishListInList, deleteWishListInListResult }) => {
    const router = useRouter();
    const [wishList, setWishList] = useState<WishListType[]>([]);
    useEffect(() => {
        if (!router.isReady) return;
        getWishListAll();
    }, [router.isReady])

    useEffect(() => {
        // console.log(wishListAll)
        if (wishListAll.error === 0 && wishListAll.msg === '' && wishListAll.data.length > 0)
            setWishList(wishListAll.data);
    }, [wishListAll])

    useEffect(() => {
        console.log(deleteWishListInListResult)
        if (deleteWishListInListResult === undefined || deleteWishListInListResult === null || deleteWishListInListResult === "")
            return;
        setWishList(wishList.filter(wl => wl.SID !== deleteWishListInListResult))
        getWishListNumber();
    }, [deleteWishListInListResult])

    function deleteOneProductInList(SID: string): void {
        if (SID.length > 0)
            deleteWishListInList(SID);
    }

    return (
        <MenuAdmin>
            <div style={{ width: '70%' }}>
                <Typography variant="h3" className="widget-title">My wishlist</Typography>
                <div className="wishlist-container">
                    {
                        (wishList.length > 0) ? wishList.map((item) => (
                            <ProductItem custWl={item} fnDelete={deleteOneProductInList}/>
                        ))
                            : null
                    }
                </div>
            </div>
        </MenuAdmin>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(WishList);
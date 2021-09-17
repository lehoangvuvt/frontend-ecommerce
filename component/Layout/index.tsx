import { useEffect } from 'react';
import { FC } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import Header from '../Header'
import Footer from '../Footer'
import Breadcrumb from '../Breadcrumb'
import { actions as loginActions } from '../../redux/action_reducer_saga/login/action';
import { actions as cartActions } from '../../redux/action_reducer_saga/cart/action';
import { actions as checkoutActions } from '../../redux/action_reducer_saga/checkout/action';
import { RootReducerType } from '../../redux/rootReducer';
import { CustomerAddressType } from '../../redux/types';

const mapStateToProps = (state: RootReducerType) => {
    return {
        cartInfo: state.global.cartInfo,
    }
}

const mapDispatchToProps = {
    loginSuccess: loginActions.loginSuccess,
    getCartInfo: cartActions.getCartInfo,
    setSelectedAddress: checkoutActions.setSelectedAddress,
}

type LayoutPropsTypes = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const Layout: FC<LayoutPropsTypes> = ({ children, loginSuccess, getCartInfo, cartInfo, setSelectedAddress }) => {
    useEffect(() => {
        const checkIfCustomerLoggedIn = async () => {
            try {
                const response = await axios({
                    url: 'http://localhost:5035/customers/check',
                    method: 'GET',
                    withCredentials: true,
                });
                const data = await response.data;
                loginSuccess(data.customer_info);
                if (data.customer_info.addresses.length > 0) {
                    const addresses: Array<CustomerAddressType> = data.customer_info.addresses;
                    setSelectedAddress(addresses.filter(address => address.IS_DEFAULT_ADDRESS === 1)[0]);
                }
            } catch (error) {
                loginSuccess(null);
                setSelectedAddress(null);
            }
        }
        checkIfCustomerLoggedIn();
    }, [])

    useEffect(() => {
        getCartInfo();
    }, [])

    return (
        <div id="layout">
            <Header />
            <Breadcrumb />
            {children}
            <Footer />
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
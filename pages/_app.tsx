import { Provider } from 'react-redux';
import { AppProps } from 'next/app'

import '../styles/globals.css'
import '../styles/style.css'
import '../styles/bootstrap.min.css'
import '../styles/Header.css';
import '../styles/all.css';
import '../styles/home.scss';
import '../styles/_layout.scss'

import '../component/Filter/style.scss';
import '../component/Breadcrumb/style.scss';
import '../component/MenuAdmin/style.scss';

import '../pages/login/style.scss'
import '../pages/products/style.scss'
import '../pages/cart/style.scss'
import '../pages/logout/style.scss'
import '../pages/checkout/style.scss'
import '../pages/checkout/checkout-review/style.scss'
import '../pages/checkout/shipping/style.scss'
import '../pages/order-successful/style.scss'
import '../pages/products/detail/style.scss'
import '../pages/active-account/style.scss'
import '../pages/resend-activation/style.scss'
import './pickup-option/style.scss'
import '../pages/customer/wishlist/style.scss'
import '../pages/customer/point/style.scss'
import '../pages/customer/orders/style.scss'
import '../pages/customer/address/style.scss'
import '../pages/customer/address/create/style.scss'

import Layout from '../component/Layout'
import { store } from '../redux/store'

import { useEffect } from 'react';
import '../data/i18n';

function MyApp({ Component, pageProps }: AppProps) {

  useEffect(() => {
    const language = window.localStorage.getItem('i18nextLng');
    if (!language) {
      window.localStorage.setItem('i18nextLng', 'en');
    }
  }, []);

  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  )
}

export default MyApp

import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer className="footer bg-dark">
            <div className="footer-middle">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-sm-6">
                            <div className="widget">
                                <h4 className="widget-title">{t('footer.contactInfo')}</h4>
                                <ul className="contact-info">
                                    <li>
                                        <span className="contact-info-label">{t('footer.address')}:</span>Level 2, 145 Nguyen Co Thach, District 2, HCMC
                                    </li>
                                    <li>
                                        <span className="contact-info-label">{t('footer.phone')}:</span><a href="tel:">+84 915 133 733</a>
                                    </li>
                                    <li>
                                        <span className="contact-info-label">{t('footer.email')}:</span> <a href="mailto:mail@example.com">
                                            infor@lbcint.com</a>
                                    </li>
                                    <li>
                                        <span className="contact-info-label">{t('footer.working')}:</span>
                                        Mon - Sun / 9:00 AM - 8:00 PM
                                    </li>
                                </ul>
                                <div className="social-icons">
                                    <a href="#" className="social-icon social-facebook icon-facebook" target="_blank" title="Facebook"></a>
                                    <a href="#" className="social-icon social-twitter icon-twitter" target="_blank" title="Twitter"></a>
                                    <a href="#" className="social-icon social-instagram icon-instagram" target="_blank" title="Instagram"></a>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-sm-6">
                            <div className="widget">
                                <h4 className="widget-title">{t('footer.customerService')}</h4>

                                <ul className="links">
                                    <li><a href="#">{'Help & FAQs'}</a></li>
                                    <li><a href="#">{'Order Tracking'}</a></li>
                                    <li><a href="#">{'Shipping & Delivery'}</a></li>
                                    <li><a href="#">{'Orders History'}</a></li>
                                    <li><a href="#">{'Advanced Search'}</a></li>
                                    <li><a href="my-account.html">{'My Account'}</a></li>
                                    <li><a href="#">{'Careers'}</a></li>
                                    <li><a href="about.html">{'About Us'}</a></li>
                                    <li><a href="#">{'Corporate Sales'}</a></li>
                                    <li><a href="#">Privacy</a></li>
                                </ul>
                            </div>
                        </div>

                        {/* <div className="col-lg-3 col-sm-6">
                            <div className="widget">
                                <h4 className="widget-title tag-widget-title">Popular Tags</h4>

                                <div className="tagcloud">
                                    <a href="#">Clothes</a>
                                    <a href="#">Fashion</a>
                                    <a href="#">Hub</a>
                                    <a href="#">Shirt</a>
                                    <a href="#">Skirt</a>
                                    <a href="#">Sports</a>
                                    <a href="#">Sweater</a>
                                </div>
                            </div>
                        </div> */}

                        <div className="col-lg-3 col-sm-6">
                            <div className="widget widget-newsletter">
                                <h4 className="widget-title newsletter-title">{t('footer.subscribe')}</h4>
                                <p>{t('footer.subscribe.description1')}<br />{t('footer.subscribe.description2')}</p>
                                <form action="#" className="mb-0">
                                    <input type="email" className="form-control m-b-3" placeholder={t('footer.subscribe.placeholder')} required />

                                    <input type="submit" className="btn shadow-none" value={t('footer.subscribe.button').toString()} />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="footer-bottom d-flex justify-content-between align-items-center flex-wrap">
                    <p className="footer-copyright py-3 pr-4 mb-0">&copy; copyright 2020. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
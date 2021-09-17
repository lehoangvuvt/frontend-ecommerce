import { connect } from 'react-redux';
import { RootReducerType } from "../../redux/rootReducer";
import { FC } from "react";
import Deliver from './Deliver';
import PickupStore from './PickupStore';
import PickUpOption from '../pickup-option/index';
import { useTranslation } from 'react-i18next';

const mapStateToProps = (state: RootReducerType) => {
    return {
        pickupOption: state.checkout.pickUpOption,
    }
}

type CheckoutPropsType = ReturnType<typeof mapStateToProps>;

const Checkout: FC<CheckoutPropsType> = ({ pickupOption }) => {
    const { t } = useTranslation();
    return (
        pickupOption === 1 ?
            <>
                <div className="container mb-6">
                    <ul className="checkout-progress-bar">
                        <li className="active">
                            <span>{t('inStore.options')}</span>
                        </li>
                        <li className="active">
                            <span> {t('inStore.store')}</span>
                        </li>
                        <li className="active">
                            <span> {t('inStore.promotion')}</span>
                        </li>
                        <li className="active">
                            <span>{t('inStore.payment')}</span>
                        </li>
                    </ul>
                    <PickUpOption />
                </div>
                <PickupStore />
            </>
            :
            pickupOption === 2 ?
                <>
                    <div className="container mb-6">
                        <ul className="checkout-progress-bar">
                            <li className="active">
                                <span>{t('inStore.options')}</span>
                            </li>
                            <li className="active">
                                <span>{t('inStore.deliver')}</span>
                            </li>
                            <li className="active">
                                <span> {t('inStore.promotion')}</span>
                            </li>
                            <li className="active">
                                <span>{t('inStore.payment')}</span>
                            </li>
                        </ul>
                        <PickUpOption />
                    </div>
                    <Deliver />
                </>
                :
                null
    )
}

export default connect(mapStateToProps)(Checkout);

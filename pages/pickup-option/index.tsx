import { FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import { useRouter } from "next/router";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { connect } from 'react-redux';
import { actions } from "../../redux/action_reducer_saga/checkout/action";
import { RootReducerType } from "../../redux/rootReducer";

const mapDispatchToProps = {
    choosePickupOption: actions.choosePickupOption,
}

const mapStateToProps = (state: RootReducerType) => {
    return {
        pickupOption: state.checkout.pickUpOption,
    }
}

type CheckoutPropsType = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

const PickUpOption: FC<CheckoutPropsType> = ({ choosePickupOption, pickupOption }) => {
    const router = useRouter();
    const { t } = useTranslation();

    const choosePickup = (option: number) => {
        choosePickupOption(option);
        router.push('/checkout');
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        choosePickup(parseInt((event.target as HTMLInputElement).value));
    };

    return (
        <div className="checkout-options-container">
            <main className="main">
                <div className="container mb-6">
                    <div className="row">
                        <div className="col-lg-8">
                            <ul className="checkout-steps">
                                <li>
                                    <h2
                                        style={{ border: 'none' }}
                                        className="step-title">
                                        1. {t('inStore.options')}
                                    </h2>
                                    <RadioGroup aria-label="gender" name="gender1" value={pickupOption.toString()} onChange={handleChange}>
                                        <FormControlLabel value="1" control={<Radio color="primary" />} label={t('order.instore')} />
                                        <FormControlLabel value="2" control={<Radio color="primary" />} label={t('order.deliver')}  />
                                    </RadioGroup>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(PickUpOption);
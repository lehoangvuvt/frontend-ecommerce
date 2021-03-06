import { createRef, FC, useEffect, useState } from "react";
import { connect } from "react-redux";
import { RootReducerType } from "../../../redux/rootReducer";
import { actions as checkoutActions } from "../../../redux/action_reducer_saga/checkout/action";
import { useRouter } from "next/router";
import { CustomerAddressType, DistrictOfCityType } from "../../../redux/types";
import cities_data from '../../../data/vietnam.json';
import axios from "axios";

const mapStateToProps = (state: RootReducerType) => {
    return {
        customerInfo: state.global.customer_info,
        selectedAddress: state.checkout.selectedAddress,
    }
}

const mapDispatchToProps = {
    setSelectedAddress: checkoutActions.setSelectedAddress,
}

type PropTypes = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const Shipping: FC<PropTypes> = ({
    customerInfo,
    setSelectedAddress,
    selectedAddress
}) => {
    const router = useRouter();
    const [addresses, setAddresses] = useState<Array<CustomerAddressType>>([]);
    const [isOpenAddAddress, setOpenAddAddress] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [isDefault, setDefault] = useState(false);
    const [address, setAddress] = useState("");
    const [cities, setCities] = useState([]);
    const [allDistricts, setAllDistricts] = useState<DistrictOfCityType[]>([]);
    const [chosenCity, setChosenCity] = useState('');
    const [chosenCityDistricts, setChosenCityDistricts] = useState<string[]>([]);
    const [chosenDistrict, setChosenDistric] = useState('');
    let firstNameRef: React.RefObject<HTMLInputElement>;
    let lastNameRef: React.RefObject<HTMLInputElement>;
    let phoneRef: React.RefObject<HTMLInputElement>;
    let addressRef: React.RefObject<HTMLInputElement>;
    firstNameRef = createRef();
    lastNameRef = createRef();
    phoneRef = createRef();
    addressRef = createRef();

    useEffect(() => {
        let citiesToSet: any
        let districtsToSet: DistrictOfCityType[];
        citiesToSet = [];
        districtsToSet = [];

        const datas = Object.entries(cities_data);

        datas.forEach(data => {
            const city = { name: data[1].name, city: data[1] }
            citiesToSet.push(city);
        })

        setCities(citiesToSet);

        datas.forEach(data => {
            let districts: string[];
            districts = [];
            const cityDistricts = Object.entries(data[1].cities);
            cityDistricts.forEach(district => {
                districts.push(district[1]);
            })
            districtsToSet.push({ name: data[1].name, districts });
        })
        setAllDistricts(districtsToSet);
        setChosenCity('H\u00e0 N\u1ed9i');
        const chosenCityDistricts = districtsToSet.filter((d: DistrictOfCityType) => d.name === 'H\u00e0 N\u1ed9i')[0];
        setChosenCityDistricts(chosenCityDistricts.districts);
        setChosenDistric(chosenCityDistricts.districts[1]);
    }, [])

    const getAddresses = async () => {
        const response = await axios({
            url: "http://localhost:5035/customers/customer-address",
            withCredentials: true,
            method: "GET"
        })
        const data = response.data;
        setAddresses(data.addresses);
    }

    useEffect(() => {
        getAddresses();
    }, [])

    const chooseCity = (name: string) => {
        setChosenCity(name);
        let chosenCityDistricts: any;
        chosenCityDistricts = allDistricts.filter((d: any) => d.name === name)[0];
        setChosenCityDistricts(chosenCityDistricts.districts);
        setChosenDistric(chosenCityDistricts.districts[1]);
    }

    const handleFocus = (ref: React.RefObject<any>) => {
        if (ref && ref.current) ref.current.style.border = "1px solid #3f51b5";
    };

    const handleBlur = (ref: React.RefObject<any>) => {
        if (ref && ref.current)
            ref.current.style.border = "1px solid rgba(0, 0, 0, 0.5)";
    };

    const create = async () => {
        let body: any = {
            STREET_ADDRESS: address,
            COUNTRY: "Vietnam",
            CITY: chosenCity,
            DISTRICT: chosenDistrict,
            PHONE: phone,
            FIRST_NAME: firstName,
            LAST_NAME: lastName,
        };
        if (addresses.length > 0) {
            body.IS_DEFAULT_ADDRESS = isDefault;
        } else {
            body.IS_DEFAULT_ADDRESS = true;
        }
        const response = await axios({
            url: "http://localhost:5035/customers/customer-address/create",
            method: "POST",
            withCredentials: true,
            data: body,
        })
        const data = response.data;
        if (data.newCustomerAddress) {
            setSelectedAddress(data.newCustomerAddress);
            alert('Create new address successfully!');
            router.push('/checkout');
        } else {
            alert('Cannot create new address');
        }
    }

    useEffect(() => {
        if (addresses.length === 0) {
            setOpenAddAddress(true);
        } else {
            setOpenAddAddress(false);
        }
    }, [addresses])

    return (
        <div className="select-address-container">
            <h1>?????a ch??? giao h??ng</h1>
            {
                addresses.length > 0 ?
                    <>
                        <h5>Ch???n ?????a ch??? giao h??ng c?? s???n b??n d?????i:</h5>
                        {
                            addresses.map(address =>
                                <div className="select-address-container__address">
                                    <div className="select-address-container__address__name">
                                        {address.FIRST_NAME} {address.LAST_NAME}
                                    </div>
                                    <div className="select-address-container__address__address">
                                        ?????a ch???: {address.STREET_ADDRESS}, {address.DISTRICT}, {address.CITY}
                                    </div>
                                    <div className="select-address-container__address__phone">
                                        ??i???n tho???i: {address.PHONE}
                                    </div>
                                    <div className="select-address-container__address__bottom">
                                        <button
                                            onClick={() => {
                                                setSelectedAddress(address);
                                                router.push('/checkout');
                                            }}
                                        >Giao t???i ?????a ch??? n??y</button>
                                    </div>
                                </div>
                            )
                        }
                    </>
                    :
                    null
            }

            {
                addresses.length > 0 ?
                    <p>B???n mu???n giao t???i ?????a ch??? kh??c? <span
                        onClick={() => {
                            setOpenAddAddress(true);
                        }}
                        style={{
                            cursor: 'pointer',
                            color: 'blue',
                        }}>Th??m ?????a ch??? giao h??ng m???i</span></p>
                    :
                    null
            }

            {
                isOpenAddAddress ?
                    <>
                        <p>Nh???p th??ng tin b??n d?????i ????? t???o ?????a ch??? giao h??ng m???i:</p>
                        <div className="select-address-container__add-new-address-container">
                            <div className="select-address-container__add-new-address-container__field-container">
                                <div className="select-address-container__add-new-address-container__field-container__label">
                                    First name:
                                </div>
                                <div className="select-address-container__add-new-address-container__field-container__input">
                                    <input
                                        type="text"
                                        value={firstName}
                                        ref={firstNameRef}
                                        placeholder="Enter first name"
                                        onBlur={() => {
                                            handleBlur(firstNameRef)
                                        }}
                                        onFocus={() => {
                                            handleFocus(firstNameRef);
                                        }}
                                        onChange={(e) => {
                                            setFirstName(e.target.value);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="select-address-container__add-new-address-container__field-container">
                                <div className="select-address-container__add-new-address-container__field-container__label">
                                    Last name:
                                </div>
                                <div className="select-address-container__add-new-address-container__field-container__input">
                                    <input
                                        type="text"
                                        value={lastName}
                                        placeholder="Enter last name"
                                        onChange={(e) => {
                                            setLastName(e.target.value);
                                        }}
                                        ref={lastNameRef}
                                        onBlur={() => {
                                            handleBlur(lastNameRef)
                                        }}
                                        onFocus={() => {
                                            handleFocus(lastNameRef);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="select-address-container__add-new-address-container__field-container">
                                <div className="select-address-container__add-new-address-container__field-container__label">
                                    Phone number:
                                </div>
                                <div className="select-address-container__add-new-address-container__field-container__input">
                                    <input
                                        type="text"
                                        value={phone}
                                        placeholder="Enter phone number"
                                        onChange={(e) => {
                                            setPhone(e.target.value);
                                        }}
                                        ref={phoneRef}
                                        onBlur={() => {
                                            handleBlur(phoneRef)
                                        }}
                                        onFocus={() => {
                                            handleFocus(phoneRef);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="select-address-container__add-new-address-container__field-container">
                                <div className="select-address-container__add-new-address-container__field-container__label">
                                    City:
                                </div>
                                <div className="select-address-container__add-new-address-container__field-container__input">
                                    <select
                                        onChange={(e) => {
                                            chooseCity(e.target.value);
                                        }}
                                        value={chosenCity}
                                        defaultValue={chosenCity}
                                        className="form-control">
                                        {cities.map((city: any) =>
                                            city.name === chosenCity ?
                                                <option
                                                    key={city.name}
                                                    value={city.name}>{city.city.name}</option>
                                                :
                                                <option
                                                    key={city.name}
                                                    value={city.name}>{city.city.name}</option>
                                        )}
                                    </select>
                                </div>
                            </div>

                            <div className="select-address-container__add-new-address-container__field-container">
                                <div className="select-address-container__add-new-address-container__field-container__label">
                                    District:
                                </div>
                                <div className="select-address-container__add-new-address-container__field-container__input">
                                    <select
                                        defaultValue={chosenDistrict}
                                        onChange={(e) => { setChosenDistric(e.target.value) }}
                                        value={chosenDistrict}
                                        className="form-control">
                                        {
                                            chosenCityDistricts.length > 0 ?
                                                chosenCityDistricts.map(district =>
                                                    district === chosenDistrict ?
                                                        <option
                                                            key={district}
                                                            value={district}>{district}</option>
                                                        :
                                                        <option
                                                            key={district}
                                                            value={district}>{district}</option>
                                                )
                                                : null
                                        }
                                    </select>
                                </div>
                            </div>

                            <div className="select-address-container__add-new-address-container__field-container">
                                <div className="select-address-container__add-new-address-container__field-container__label">
                                    Address:
                                </div>
                                <div className="select-address-container__add-new-address-container__field-container__input">
                                    <input
                                        type="text"
                                        value={address}
                                        placeholder="Enter address"
                                        onChange={(e) => {
                                            setAddress(e.target.value);
                                        }}
                                        ref={addressRef}
                                        onBlur={() => {
                                            handleBlur(addressRef)
                                        }}
                                        onFocus={() => {
                                            handleFocus(addressRef);
                                        }}
                                    />
                                </div>
                            </div>

                            {
                                addresses.length > 0 ?
                                    <div className="select-address-container__add-new-address-container__field-container">
                                        <div className="select-address-container__add-new-address-container__field-container__label">

                                        </div>
                                        <div className="select-address-container__add-new-address-container__field-container__input">
                                            <input
                                                checked={isDefault}
                                                className="select-address-container__add-new-address-container__field-container__input__checkbox"
                                                type="checkbox"
                                                onChange={() => {
                                                    setDefault(!isDefault);
                                                }}
                                            />
                                            &nbsp;&nbsp;&nbsp;
                                            <span
                                                style={{
                                                    fontSize: '1.45rem',
                                                }}
                                            >Set as default address</span>

                                        </div>
                                    </div>
                                    :
                                    null
                            }

                            <div className="select-address-container__add-new-address-container__field-container">
                                <div className="select-address-container__add-new-address-container__field-container__label">

                                </div>
                                <div className="select-address-container__add-new-address-container__field-container__input">
                                    <button
                                        onClick={() => {
                                            if (addresses.length > 0) {
                                                setOpenAddAddress(false);
                                            } else {
                                                router.push('/checkout');
                                            }
                                        }
                                        }
                                    >
                                        {addresses.length > 0 ? "H???y b???" : "Quay l???i"}
                                    </button>

                                    <button
                                        onClick={() => {
                                            create()
                                        }}
                                    >Giao ?????n ?????a ch??? n??y</button>
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    null
            }
        </div >
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(Shipping);
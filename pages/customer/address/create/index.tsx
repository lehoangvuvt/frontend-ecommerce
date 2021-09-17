import { Typography } from "@material-ui/core";
import axios from "axios";
import { useRouter } from "next/router";
import React, { createRef, FC, useEffect, useState } from "react";
import MenuAdmin from '../../../../component/MenuAdmin';
import { CustomerAddressType, DistrictOfCityType } from "../../../../redux/types";
import cities_data from '../../../../data/vietnam.json';

const Create: FC = () => {
    const router = useRouter();
    const [addresses, setAddresses] = useState<Array<CustomerAddressType>>([]);
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
            alert('Create new address successfully!');
        } else {
            alert('Cannot create new address');
        }
    }

    return (
        <MenuAdmin>
            <div style={{ width: '70%' }}>
                <Typography variant="h3" className="widget-title">Create new address</Typography>
                <div className="create-new-address-container">
                    <div className="create-new-address-container__field-container">
                        <div className="create-new-address-container__field-container__label">
                            First name:
                        </div>
                        <div className="create-new-address-container__field-container__input">
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

                    <div className="create-new-address-container__field-container">
                        <div className="create-new-address-container__field-container__label">
                            Last name:
                        </div>
                        <div className="create-new-address-container__field-container__input">
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

                    <div className="create-new-address-container__field-container">
                        <div className="create-new-address-container__field-container__label">
                            Phone number:
                        </div>
                        <div className="create-new-address-container__field-container__input">
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

                    <div className="create-new-address-container__field-container">
                        <div className="create-new-address-container__field-container__label">
                            City:
                        </div>
                        <div className="create-new-address-container__field-container__input">
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

                    <div className="create-new-address-container__field-container">
                        <div className="create-new-address-container__field-container__label">
                            District:
                        </div>
                        <div className="create-new-address-container__field-container__input">
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

                    <div className="create-new-address-container__field-container">
                        <div className="create-new-address-container__field-container__label">
                            Address:
                        </div>
                        <div className="create-new-address-container__field-container__input">
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
                            <div className="create-new-address-container__field-container">
                                <div className="create-new-address-container__field-container__label">

                                </div>
                                <div className="create-new-address-container__field-container__input">
                                    <input
                                        checked={isDefault}
                                        className="create-new-address-container__field-container__input__checkbox"
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
                            : null
                    }

                    <div className="create-new-address-container__field-container">
                        <div className="create-new-address-container__field-container__label">

                        </div>
                        <div className="create-new-address-container__field-container__input">
                            <button
                                onClick={() => {
                                    create()
                                }}
                            >Create</button>
                        </div>
                    </div>
                </div>
            </div>
        </MenuAdmin>
    )
}

export default Create;
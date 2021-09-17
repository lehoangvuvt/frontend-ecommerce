import { useEffect, useState } from 'react'
import MenuAdmin from '../../../component/MenuAdmin'
import { Typography } from '@material-ui/core'
import { useRouter } from 'next/router'
import axios from 'axios'
import { CustomerAddressType } from '../../../redux/types'

const Address = () => {
    const router = useRouter();
    const [addresses, setAddresses] = useState<Array<CustomerAddressType>>([]);

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

    return (
        <MenuAdmin>
            <div style={{ width: '70%' }}>
                <Typography variant="h3" className="widget-title">Address book</Typography>
                <div className="addresses-container">
                    <div
                        onClick={() => {
                            window.location.href = "/customer/address/create";
                        }}
                        className="addresses-container__add-new-btn">
                        <i className="fas fa-plus"></i>Add new address
                    </div>
                    {
                        addresses.length > 0 ?
                            addresses.map(address =>
                                <div className="addresses-container__address">
                                    <div className="addresses-container__address__left">
                                        <div className="addresses-container__address__left__top">
                                            {address.FIRST_NAME} {address.LAST_NAME}
                                            {
                                                address.IS_DEFAULT_ADDRESS ?
                                                    <div className="addresses-container__address__left__top__badge">
                                                        <i className="far fa-check-circle"></i>
                                                        Default address
                                                    </div>
                                                    :
                                                    null
                                            }
                                        </div>
                                        <div className="addresses-container__address__left__middle">
                                            <span
                                                style={{
                                                    color: 'rgba(0,0,0,0.7)',
                                                }}
                                            >Address: </span>{address.STREET_ADDRESS}, Disctrict {address.DISTRICT}, {address.CITY}
                                        </div>
                                        <div className="addresses-container__address__left__bottom">
                                            <span
                                                style={{
                                                    color: 'rgba(0,0,0,0.7)',
                                                }}
                                            >Phone: </span>{address.PHONE}
                                        </div>
                                    </div>
                                    <div className="addresses-container__address__right">
                                        <p>Edit</p>
                                    </div>
                                </div>
                            )
                            :
                            <p
                                style={{
                                    fontSize: '1.5rem'
                                }}
                            >You don't have any address</p>
                    }
                </div>
            </div>
        </MenuAdmin>
    )
}

export default Address;
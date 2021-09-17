import axios from "axios";

export const addToCartApi = async (SID_PRODUCT: string) => {
    try {
        const url = 'http://localhost:5035/customers/add-to-cart';
        const data = { SID_PRODUCT };
        const response = await axios({
            url,
            data,
            method: 'POST',
            withCredentials: true,
        })
        return response.data;
    } catch (error) {
        return error;
    }
}
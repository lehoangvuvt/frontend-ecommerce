import axios from "axios";

export const findProductsApi = async (query: string) => {
    try {
        const url = `http://localhost:5035/products?${query}`;
        const response = await axios({
            url,
            method: 'GET',
        });
        return response.data;
    } catch (error) {
        return error;
    }
}
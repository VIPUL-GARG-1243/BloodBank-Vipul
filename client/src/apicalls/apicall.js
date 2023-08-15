import axios from "axios";

export const axiosInstance = async (method, endPoint, payLoad) => {
    try {
        const response = await axios({
            method: method,
            url: endPoint,
            data: payLoad,
            headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        return response.data;
    } catch (error) {
        return error;
    }
}
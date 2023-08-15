import { axiosInstance } from "./apicall";

export const AddInventory = async (data) => {
    const response = await axiosInstance("post", "/api/inventory/add", data);
    return response;
}

export const GetInventory = async () => {
    const response = await axiosInstance("get", "/api/inventory/get");
    return response;
}

export const GetInventoryWithFilters = async (data) => {
    const response = await axiosInstance("get", "/api/inventory/filter", data);
    return response;
}

export const GetInventoryForSpecificOrganization = async (data) => {
    const response = await axiosInstance("post", "/api/inventory/history", data);
    return response;
}
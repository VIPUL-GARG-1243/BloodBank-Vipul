import { axiosInstance } from "./apicall";

export const GetAllBloodGroupsDataFromInventory = async () => {
    const response = await axiosInstance("get", "/api/dashBoard/blood-groups-data");
    return response;
}
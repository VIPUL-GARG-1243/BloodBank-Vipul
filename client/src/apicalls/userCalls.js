import { axiosInstance } from "./apicall";

export const LoginUser = async (payLoad) => {
    const response = await axiosInstance("post", "/api/users/login", payLoad);
    return response;
}

export const RegisterUser = async (payLoad) => {
    const response = await axiosInstance("post", "/api/users/register", payLoad);
    return response;
}

export const GetCurrentUser = async () => {
    const response = await axiosInstance("get", "/api/users/get-current-user");
    return response;
}

export const GetAllDonarsOfAnOrganization = async () => {
    const response = await axiosInstance("get", "api/users/get-all-donars");
    return response;
}

export const GetAllHospitalsOfAnOrganization = async () => {
    const response = await axiosInstance("get", "api/users/get-all-hospitals");
    return response;
}

export const GetAllOrganizationsForDonar = async () => {
    const response = await axiosInstance("get", "api/users/get-all-organizations-for-donar");
    return response;
}

export const GetAllOrganizationsForHospital = async () => {
    const response = await axiosInstance("get", "api/users/get-all-organizations-for-hospital");
    return response;
}
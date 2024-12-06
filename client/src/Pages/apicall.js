import { myendpoints } from "../endpoint/endpoint"
import axiosInstance from '../api/api'
import { toast } from "react-toastify";

// Fetching dashboard 
export const fetchDashboard = async () => {
    try {
        const apiurl = myendpoints[2];
        const response = await axiosInstance.get(apiurl);
        console.log("Fetching dashboard data...", response);
        return response?.data?.user
    } catch (error) {
        console.log("Error fetching dashboard data...", error);

    }
}

// Fetching Add data 
export const addproduct = async (data) => {
    try {
        const apiurl = myendpoints[3];
        const response = await axiosInstance.post(apiurl, data);
        console.log("Fetching add data...", response);
        toast.success(response?.data?.message);
        return response
    } catch (error) {
        console.log("Error fetching add data", error);
        toast.error(error?.response?.data?.errors[0]);
    }
}

// Fetching read data 
export const productlist = async () => {
    try {
        const apiurl = myendpoints[4];
        const response = await axiosInstance.get(apiurl);
        console.log("Fetching get data...", response);
        return response?.data?.products
    } catch (error) {
        console.log("Error fetching add data", error);
    }
}

// Single product
export const singleproduct = async (id) => {
    try {
        const apiurl = `${myendpoints[5]}/${id}`
        const response = await axiosInstance.get(apiurl)
        console.log("Fetching Single product  data...", response);
        return response?.data
    } catch (error) {
        console.log("Error Fetching single product...", error);

    }
}

export const updateproduct = async ({ formdata, id }) => {
    try {
        const apiurl = `${myendpoints[6]}/${id}`
        const response = await axiosInstance.put(apiurl, formdata)
        console.log("Fetching Update product  data...", response);
        toast.success(response?.data?.message);
        return response
    } catch (error) {
        console.log("Error Fetching update product...", error);
        toast.error(error?.response?.data?.errors[0]);
    }
}

// Delete Function 
export const deleteproduct = async (id) => {
    try {
        const apiurl = `${myendpoints[7]}/${id}`
        const response = await axiosInstance.delete(apiurl)
        console.log("Fetching Delete data...", response);
        toast.warn(response?.data?.message);
        return response
    } catch (error) {
        console.log("Error fetching Delete data...", error);
    }
}

// Update Password 
export const updatepassword = async (data) => {
    try {
        const apiurl = myendpoints[9];
        const response = await axiosInstance.post(apiurl, data);
        console.log("Fetching update data...", response);
        toast.success(response?.data?.message);
        return response
    } catch (error) {
        console.log("Error fetching update data", error);
        toast.error(error?.response?.data?.message);
    }
}

// Verify OTP 
export const verifyotp = async (data) => {
    try {
        const apiurl = myendpoints[8];
        const response = await axiosInstance.post(apiurl, data);
        console.log("Fetching verify data...", response);
        toast.success(response?.data?.message);
        return response
    } catch (error) {
        console.log("Error fetching verify data", error);
        toast.error(error?.response?.data?.message);
    }
}

// Reset link for forget password 
export const resetpasswordlink = async (data) => {
    try {
        const apiurl = myendpoints[10];
        const response = await axiosInstance.post(apiurl, data);
        console.log("Fetching email verify data...", response);
        toast.success(response?.data?.message);
        return response
    } catch (error) {
        console.log("Error fetching email verify data", error);
        toast.error(error?.response?.data?.message);
    }
}

// Forget Password 
export const forgetpassword = async (data, id, token) => {
    try {
        const apiurl = `${myendpoints[11]}/${id}/${token}`;
        const response = await axiosInstance.post(apiurl, data);
        console.log("Fetching forget data...", response);
        toast.success(response?.data?.message);
        return response
    } catch (error) {
        console.log("Error fetching forget data", error);
        toast.error(error?.response?.data?.message); 
    }
}
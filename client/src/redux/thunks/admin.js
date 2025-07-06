import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../constants/config"; 


const adminLogin = createAsyncThunk("admin/verify" , async(secretKey) => {

    try {
        const config = {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            }
        };

        const {data} = await axios.post(`${server}/api/v1/admin/verify` , {secretKey} , config);
        
        return data.message ;
    } catch (error) {
        console.error("Admin login error:", error);
        
        // Check if error has response (API error)
        if (error.response) {
            // Server responded with error status
            const errorMessage = error.response.data?.message || "Server error occurred";
            throw errorMessage;
        } else if (error.request) {
            // Request was made but no response received
            throw "No response from server. Please check your connection.";
        } else {
            // Something else happened
            throw error.message || "An unexpected error occurred";
        }
    }

});


const getAdmin = createAsyncThunk("admin/getAdmin" , async() => {

    try {
        const config = {
            withCredentials: true,
        };

        const {data} = await axios.post(`${server}/api/v1/admin/` , config);
        
        return data.admin ;
    } catch (error) {
       throw error.response?.data?.message;
    }

});

const adminLogout = createAsyncThunk("admin/logout" , async() => {

    try {
        const config = {
            withCredentials: true,
        };

        const {data} = await axios.post(`${server}/api/v1/admin/logout` , config);
        
        return data.message ;
    } catch (error) {
       throw error.response?.data?.message;
    }

});



export {
    adminLogin,
    getAdmin,
    adminLogout
}
import axios from 'axios';

export const API_URL = "http://10.0.2.2:8080/";

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const loginUser = async (login: string, password: string) => {
    try {
        const response = await axiosInstance.post('auth/login', { login, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const registerUser = async (fullName: string, username: string, email: string, password: string) => {
    try {
        const response = await axiosInstance.post('auth/register', { fullName, username, email, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default axiosInstance;
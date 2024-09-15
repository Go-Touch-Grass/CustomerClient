import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export const storeToken = async (token: string) => {
    try {
        await AsyncStorage.setItem('userToken', token);
    } catch (error) {
        console.error('Error storing token:', error);
    }
};

export const getToken = async () => {
    try {
        return await AsyncStorage.getItem('userToken');
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

export const removeToken = async () => {
    try {
        await AsyncStorage.removeItem('userToken');
    } catch (error) {
        console.error('Error removing token:', error);
    }
};

export const getUserInfo = async () => {
    const token = await getToken();
    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await axiosInstance.get('auth/user', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default axiosInstance;

import axios from 'axios';
import { API_URL } from '@env';

const axiosInstance = axios.create({

    // baseURL: API_URL
    //baseURL: 'http://192.168.10.146:8080/',
    // JY URL
    baseURL: 'http://192.168.1.115:8080/',
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

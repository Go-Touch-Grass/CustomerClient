import axios from 'axios';
import { IP_ADDRESS } from '@env';

const axiosInstance = axios.create({
  // baseURL: CommonBackend URL
  baseURL: `http://192.168.18.67:8080/`,
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

import axios from 'axios';
import { IP_ADDRESS } from '@env';

const axiosInstance = axios.create({

  // baseURL: CommonBackend URL
  // Please do configuration on .env file instead of hardcoding the value here
  baseURL: `http://${IP_ADDRESS}:8080/`,
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

export const registerUser = async (fullName: string, username: string, email: string, password: string, referralCode: string) => {
  try {
    const response = await axiosInstance.post('auth/register', { fullName, username, email, password, referral_code: referralCode });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default axiosInstance;

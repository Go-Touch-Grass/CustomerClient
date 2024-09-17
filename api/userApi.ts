import axiosInstance from './authApi';
import { getToken } from '../utils/asyncStorage';

interface UserInfo {
    id: string;
    fullName: string;
    email: string;
    username: string;
    exp: number;
    currentLevel: number;
    xpForNextLevel: number;
    xpProgress: number;
}

export const getUserInfo = async (): Promise<UserInfo> => {
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

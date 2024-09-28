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

interface Avatarinfo {
    avtarUrl: string;
}

export const getUserInfo = async (): Promise<UserInfo> => {
    const token = await getToken();
    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await axiosInstance.get('auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const editProfile = async (updatedInfo: Partial<UserInfo>): Promise<UserInfo> => {
    const token = await getToken();
    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await axiosInstance.put('auth/profile/edit', updatedInfo, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.customer_account;
    } catch (error) {
        throw error;
    }
};

export const deleteAccount = async (): Promise<void> => {
    const token = await getToken();
    if (!token) {
        throw new Error('No token found');
    }

    try {
        await axiosInstance.delete('auth/profile/delete', {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        throw error;
    }
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    const token = await getToken();
    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await axiosInstance.post('auth/change-password', 
            { currentPassword, newPassword },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getUserId = async (): Promise<string> => {
    const token = await getToken();
    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await axiosInstance.get('auth/getUserId', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAvatarUrl = async (): Promise<Avatarinfo> => {
    const token = await getToken();
    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await axiosInstance.get('auth/getAvatarUrl', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateAvatarUrl = async (userId: string, avatarUrl: string) => {
    const token = await getToken();
    if (!token) {
      throw new Error('No token found');
    }
  
    try {
      const response = await axiosInstance.put('auth/avatar', { userId, avatarUrl }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  

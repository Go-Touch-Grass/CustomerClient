import axiosInstance from './authApi';
import { getToken } from '../utils/asyncStorage';

interface AvatarInfo {
    avatar: string;
    customization: Record<string, any>;
}

export const getAvatarDetails = async (): Promise<AvatarInfo> => {
    const token = await getToken();
    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await axiosInstance.get('auth/avatar', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createAvatar = async (avatar: string, customization: Record<string, any>) => {
    const token = await getToken();
    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await axiosInstance.post('auth/avatar', { avatar, customization }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateAvatar = async (updatedInfo: Partial<AvatarInfo>): Promise<AvatarInfo> => {
    const token = await getToken();
    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await axiosInstance.put('auth/avatar/update', updatedInfo, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.customer_account;
    } catch (error) {
        throw error;
    }
};
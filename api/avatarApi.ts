import axiosInstance from './authApi';
import { getToken } from '../utils/asyncStorage';

// Add this enum to match the backend ItemType
export enum ItemType {
  HAT = 'hat',
  SHIRT = 'shirt',
  BOTTOMS = 'bottoms'
}

// Update the Item interface to match the backend entity
export interface Item {
  id: number;
  name: string;
  type: ItemType;
  filepath: string;
}

interface AvatarInfo {
  avatar: string;
  customization: Record<string, any>;
}

export enum AvatarType {
  BUSINESS = 'business',
  TOURIST = 'tourist',
}

export const getAvatarDetails = async (): Promise<AvatarInfo> => {
  const token = await getToken();
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await axiosInstance.get('/auth/avatar', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status !== 200) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      throw new Error(`Server error: ${error.response.data.message || 'Unknown error'}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      throw new Error('No response from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error', error.message);
      throw error;
    }
  }
};

// Update the getItems function to use the new Item interface
export const getItems = async (): Promise<Item[]> => {
  const token = await getToken();
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await axiosInstance.get('/api/items', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!Array.isArray(response.data)) {
      throw new Error('Invalid response format');
    }
    return response.data;
  } catch (error: any) {
    console.error('Error fetching items:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    }
    throw error;
  }
};

export const createAvatar = async (
  avatarType: AvatarType,
  hatId: number | null,
  shirtId: number | null,
  bottomId: number | null,
) => {
  const token = await getToken();
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await axiosInstance.post(
      '/api/avatars',
      {
        avatarType,
        hatId,
        shirtId,
        bottomId,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error creating avatar:', error);
    throw error;
  }
};

export const updateAvatar = async (avatarId: number, updatedInfo: Partial<AvatarInfo>): Promise<AvatarInfo> => {
  const token = await getToken();
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await axiosInstance.put(`/api/avatars/${avatarId}`, updatedInfo, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

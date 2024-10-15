import axiosInstance from './authApi';
import { getToken } from '../utils/asyncStorage';

// Add this enum to match the backend ItemType
export enum ItemType {
  BASE = 'base',
  HAT = 'hat',
  SHIRT = 'shirt',
  BOTTOM = 'bottom'
}

// Update the Item interface to match the backend response
export interface Item {
  id: number;
  name: string;
  type: ItemType;
  filepath: string;
  scale: number;
  xOffset: number;
  yOffset: number;
  isOwned: boolean;
}

// Update the AvatarInfo interface to match the backend response
export interface AvatarInfo {
  id: number;
  avatarType: AvatarType;
  customer?: { id: number };
  business_register_business?: { registration_id: number };
  outlet?: {outlet_id: number};
  base?: Item | null;
  hat?: Item | null;
  shirt?: Item | null;
  bottom?: Item | null;
}

export enum AvatarType {
  BUSINESS_REGISTER_BUSINESS = 'business_register_business',
  OUTLET = 'outlet',
  TOURIST = 'tourist'
}

export const getAvatarById = async (id: number): Promise<AvatarInfo> => {
  const token = await getToken();
  if (!token) {
    throw new Error('No token found');
  }
  try {
    const response = await axiosInstance.get(`/api/avatars/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching avatar:', error);
    throw handleApiError(error);
  }
};

export const getAvatarByBusinessRegistrationId = async (registrationId: number): Promise<AvatarInfo> => {
  const token = await getToken();
  if (!token) {
    throw new Error('No token found');
  }
	try {
	  const response = await axiosInstance.get(`/api/avatars/business/${registrationId}`, {
      headers: { Authorization: `Bearer ${token}` },
	  });
	  return response.data;
	} catch (error) {
	  console.error('Error fetching avatar by Business Registration ID:', error);
	  throw handleApiError(error);
	}
  };

export const getAvatarByOutletId = async (outletId: number): Promise<AvatarInfo> => {
  const token = await getToken();
  if (!token) {
    throw new Error('No token found');
  }
	try {
	  const response = await axiosInstance.get(`/api/avatars/outlet/${outletId}`, {
      headers: { Authorization: `Bearer ${token}` },
	  });
	  return response.data;
	} catch (error) {
	  console.error('Error fetching avatar by Outlet ID:', error);
	  throw handleApiError(error);
	}
  };

export const updateAvatar = async (
  avatarId: number,
  updatedInfo: { hatId?: number | null; shirtId?: number | null; bottomId?: number | null }
): Promise<AvatarInfo> => {
  const token = await getToken();
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await axiosInstance.put(`/api/avatars/${avatarId}`, updatedInfo, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error updating avatar:', error);
    throw handleApiError(error);
  }
};

export const getAvatarByCustomerId = async (customerId: number): Promise<AvatarInfo> => {
  const token = await getToken();
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await axiosInstance.get(`/api/avatars/customer/${customerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching avatar by customer ID:', error);
    throw handleApiError(error);
  }
};

// Update the getItems function to match the new backend response
export const getItems = async (): Promise<Record<ItemType, Item[]>> => {
  const token = await getToken();
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await axiosInstance.get('/api/inventory/items', {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (!response.data || !response.data.items) {
      throw new Error('Invalid response format');
    }
    
    return response.data.items;
  } catch (error: any) {
    console.error('Error fetching items:', error);
    throw handleApiError(error);
  }
};

export const createAvatar = async (
  avatarType: AvatarType,
  baseId: 1 | null,
  hatId: number | null,
  shirtId: number | null,
  bottomId: number | null,
): Promise<{ avatar: AvatarInfo; avatarId: number }> => {
  const token = await getToken();
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await axiosInstance.post(
      '/api/avatars',
      {
        avatarType,
        baseId,
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
    throw handleApiError(error);
  }
};

function handleApiError(error: any): Error {
  if (error.response) {
    console.error('Error response:', error.response.data);
    console.error('Error status:', error.response.status);
    return new Error(`Server error: ${error.response.data.message || 'Unknown error'}`);
  } else if (error.request) {
    console.error('No response received:', error.request);
    return new Error('No response from server');
  } else {
    console.error('Error', error.message);
    return error;
  }
}

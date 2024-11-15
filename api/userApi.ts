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
  referral_code: string;
	code_used: number;
}

export interface XPUpdateResponse {
  previousLevel: number;
  currentLevel: number;
  totalXP: number;
  xpForNextLevel: number;
  xpProgress: number;
  leveledUp: boolean;
}

interface RepairStreakResponse {
  gem_balance: number;
  streakCount: number;
  gemsRequired: number; // Amount of gems required for the repair
}

export const repairStreak = async (customerId: string): Promise<RepairStreakResponse> => {
  const token = await getToken();
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await axiosInstance.post(
      `auth/customers/${customerId}/repair-streak`,
      {}, // Empty body since gemsRequired is calculated server-side
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};




export const getUserInfo = async (): Promise<UserInfo> => {
  const token = await getToken();
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await axiosInstance.get('auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
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
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.customer_account;
  } catch (error) {
    throw error;
  }
};


export const deleteAccount = async (password: string): Promise<void> => {
  const token = await getToken();
  if (!token) {
    throw new Error('No token found');
  }

  try {
    await axiosInstance.delete('auth/profile/delete', {
      headers: { Authorization: `Bearer ${token}` },
      data: { password }
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
    const response = await axiosInstance.post(
      'auth/change-password',
      { currentPassword, newPassword },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCustomerAvatar = async (avatarId: number): Promise<void> => {
  const token = await getToken();
  if (!token) {
    throw new Error('No token found');
  }

  try {
    await axiosInstance.post('auth/update-avatar', { avatarId }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    throw error;
  }
};

export const updateXP = async (xpAmount: number): Promise<XPUpdateResponse> => {
  const token = await getToken();
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await axiosInstance.post(
      'auth/update-xp',
      { xpAmount },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const customerCashback = async(quantity : number): Promise<void> => {
  const token = await getToken();
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await axiosInstance.post('/auth/customers/customercashback', 
      {quantity}, 
    {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
import axiosInstance from './authApi';
import { getToken } from '../utils/asyncStorage';

// Define the structure for avatar info
export enum ItemType {
  BASE = 'base',
  HAT = 'hat',
  SHIRT = 'shirt',
  BOTTOM = 'bottom'
}

export enum AvatarType {
  BUSINESS_REGISTER_BUSINESS = 'business_register_business',
  OUTLET = 'outlet',
  TOURIST = 'tourist'
}

// Update the Item interface to match the backend entity
export interface Item {
  id: number;
  name: string;
  type: ItemType;
  filepath: string;
}
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

// Define the structure for entity (which can be a Business or Outlet)
export interface BranchInfo {
  entityType: 'Business_register_business' | 'Outlet';
  registrationId?: number; // for Business
  entityName?: string; // for Business
  outletId?: number; // for Outlet
  outletName?: string; // for Outlet
  location: string;
  avatar: AvatarInfo | null;
  coordinates: {
    latitude: number;
    longitude: number;
  } | null;
}

// Define the structure for the subscription information
export interface SubscriptionInfo {
  subscriptionId: number;
  title: string;
  description: string;
  status: string;
  expirationDate: string;
  distanceCoverage: number;
  branch: BranchInfo;
}

export const getAllSubscription = async (): Promise<SubscriptionInfo[]> => {
  const token = await getToken();
  if (!token) {
    throw new Error('No token found');
  }
  try {
    const response = await axiosInstance.get('/auth/subscription', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // Now this data should match the SubscriptionInfo structure
  } catch (error: any) {
    console.error('Error fetching subscription:', error);
    throw error;
  }
};



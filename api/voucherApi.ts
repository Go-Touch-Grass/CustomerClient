import axiosInstance from './authApi';
import { getToken } from '../utils/asyncStorage';

// Define the Voucher interface based on what the API returns
// Define the Voucher interface based on what the API returns
export interface Voucher {
    listing_id: number;
    name: string;
    description: string;
    price: number;
    discount: number;
    voucherImage?: string;
    created_at: Date;
    updated_at: Date;
    redeemed: boolean;
    expirationDate?: string;
    voucher_transaction_id: number;
    used: boolean; // Add the used attribute
    rewardItem?: {
        id: number;
        name: string;
        type: string;
        filepath: string;
    };
}

// Define the response interface
interface VoucherResponse {
    status: number;
    vouchers: Voucher[];
}

// types.ts or wherever you define your types
export interface VoucherPurchaseResponse {
    message: string;
    voucher: {
        listing_id: number; 
        name: string;
        description: string;
        original_price: number;
        discount: number;
        discounted_price: number;
        discounted_price_in_gems: number;
        duration: number;
        voucher_transaction_id: string; // or number
        rewardItem?: {
            id: number;
            name: string;
            type: string;
            filepath: string;
        };
    };
}

export const purchaseVouchers = async (voucherId: string): Promise<VoucherPurchaseResponse> => {
    const token = await getToken();
    if (!token) {
        throw new Error('No token found');
    }
    try {
        const response = await axiosInstance.post<VoucherPurchaseResponse>('/api/inventory/vouchers/purchase', { voucherId },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error purchasing voucher:', error);
        throw error;
    }
};

export const redeemVoucher = async (transactionId: number) => {
    const token = await getToken();
    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await axiosInstance.put<VoucherResponse>(
            `/api/inventory/vouchers/redeem/${transactionId}`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error redeeming voucher:', error);
        throw error;
    }
};

export const getCustomerVouchers = async (): Promise<VoucherResponse> => {
    const token = await getToken();
    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await axiosInstance.get<VoucherResponse>('/api/inventory/vouchers', {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching customer vouchers:', error);
        throw error;
    }
};

export const getAllVouchers = async (registration_id?: number, outlet_id?: number, searchTerm?: string): Promise<VoucherResponse> => {
    
    const token = await getToken();
    if (!token) {
      throw new Error('No token found');
    }
  
    try {
      const params: any = {};
      if (registration_id) params.registration_id = registration_id;
      if (outlet_id) params.outlet_id = outlet_id;
      if (searchTerm) params.searchTerm = searchTerm;
  
      const response = await axiosInstance.get<VoucherResponse>('/api/business/vouchers', {
        headers: { Authorization: `Bearer ${token}` },
        params, // Pass query parameters to the request
      });
  
      return response.data; // Return the entire response
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      throw error;
    }
  };

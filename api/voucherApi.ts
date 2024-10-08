import axiosInstance from './authApi';
import { getToken } from '../utils/asyncStorage';

// Define the Voucher interface based on what the API returns
// Define the Voucher interface based on what the API returns
interface Voucher {
    listing_id: number;
    name: string;
    description: string;
    price: number;
    discount: number;
    voucherImage?: string;
    created_at: Date;
    updated_at: Date;
    redeemed: boolean;
    expirationDate: string; // Added expiry date
}


// Define the response interface
interface VoucherResponse {
    status: number;
    vouchers: Voucher[];
}


// Fetch all vouchers the customer has purchased
export const getCustomerVouchers = async (): Promise<VoucherResponse> => { // Change return type here
    const token = await getToken();
    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await axiosInstance.get<VoucherResponse>('/auth/view_voucher_inventory', {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data; // Return the entire response
    } catch (error) {
        console.error('Error fetching customer vouchers:', error);
        throw error;
    }
};

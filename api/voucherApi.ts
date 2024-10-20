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
    redeemed: "yes" | "pending" | "no";
    expirationDate?: string;
    voucher_transaction_id: number;
    used: boolean; // Add the used attribute
    rewardItem?: {
        id: number;
        name: string;
        type: string;
        filepath: string;
    };
    groupPurchaseEnabled: boolean;
    groupSize: number;
    groupDiscount: number;
    quantity: number;
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

export const redeemVoucher = async (voucherId: number) => {
    const token = await getToken();
    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await axiosInstance.put<VoucherResponse>(
            `/api/inventory/vouchers/redeem/${voucherId}`,
            { voucherId },
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

// Testing method: Fetch all vouchers for the customer to purchase no matter the branch or outlet
export const viewAllAvailableVouchers = async (): Promise<VoucherResponse> => { // Change return type here
    const token = await getToken();
    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await axiosInstance.get<VoucherResponse>('/auth/vouchers/getAllVouchers', {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data; // Return the entire response
    } catch (error) {
        console.error('Error fetching customer vouchers:', error);
        throw error;
    }
};


export const startGroupPurchase = async (voucher: Voucher): Promise<any> => {
    const token = await getToken();
    if (!token) {
        throw new Error('No token found');
    }
    //console.log("voucher in StartGroupPurchase", voucher);
    try {
        const response = await axiosInstance.post('/auth/group-purchase/start', {
            voucher_id: voucher.listing_id,
            group_size: voucher.groupSize,
            expires_at: new Date(new Date().getTime() + 30 * 60 * 1000) // Set expiry time, e.g., 30 minutes from now
        }, {
            headers: { Authorization: `Bearer ${token}` },
        },
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const joinGroupPurchase = async (groupPurchaseId: String): Promise<any> => {
    const token = await getToken();
    if (!token) {
        throw new Error('No token found');
    }
    //console.log("voucher in StartGroupPurchase", voucher);
    try {
        const response = await axiosInstance.post('/auth/group-purchase/join', {
            group_purchase_id: groupPurchaseId
        }, {
            headers: { Authorization: `Bearer ${token}` },
        },
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const GroupPurchaseStatus = async (groupPurchaseId: String): Promise<any> => {
    const token = await getToken();
    if (!token) {
        throw new Error('No token found');
    }
    //console.log("voucher in StartGroupPurchase", voucher);
    try {
        const response = await axiosInstance.get(`/auth/group-purchase/status/${groupPurchaseId}`, {
            headers: { Authorization: `Bearer ${token}` },
        },
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};




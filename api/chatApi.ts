import axiosInstance from './authApi';
import { getToken } from '../utils/asyncStorage';

export interface ChatMessage {
    role: string;
    content: string;
}

export interface ChatResponse {
    message: string;
    role: string;
    content?: string;
}

export interface ChatCompletionParams {
    messages: ChatMessage[];
    locationDescription: string;
}

export interface AvatarPrompt {
    id?: number;
    prompt: string;
    avatar?: any;
}

export interface CreatePromptParams {
    avatarId: number | string;
    prompt: string;
}

export const createChatCompletion = async (params: ChatCompletionParams): Promise<ChatResponse> => {
    const token = await getToken();
    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await axiosInstance.post('/api/chat', params, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error: any) {
        console.error('Error creating chat completion:', error);
        throw handleApiError(error);
    }
};

export const getAvatarPrompt = async (avatarId: number | string): Promise<AvatarPrompt> => {
    const token = await getToken();
    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await axiosInstance.get(`/api/avatars/business/prompt/${avatarId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error: any) {
        console.error('Error fetching avatar prompt:', error);
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
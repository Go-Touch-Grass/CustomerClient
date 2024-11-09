import axiosInstance from '../api/authApi';
import { getToken } from '../utils/asyncStorage';
import { DialogueTree, DialogueNode } from '../utils/dialogue';

export const generateDialogueResponse = async (
    context: string,
    previousMessages: string[],
    selectedOption: string
): Promise<DialogueNode> => {
    const token = await getToken();
    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await axiosInstance.post(
            '/api/dialogue/generate',
            {
                context,
                previousMessages,
                selectedOption,
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error generating dialogue:', error);
        throw error;
    }
};
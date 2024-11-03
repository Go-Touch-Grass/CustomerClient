import { updateXP } from '../api/userApi';

export const XP_REWARDS = {
    SIGN_UP: 100,
    ADD_FRIEND: 50,
    ACCEPT_FRIEND: 30,
    PURCHASE_VOUCHER: 20,
    CREATE_AVATAR: 80,
    UPDATE_AVATAR: 10,
    GROUP_PURCHASE_CREATE: 30,
    GROUP_PURCHASE_JOIN: 20,
};

export const awardXP = async (amount: number): Promise<void> => {
    try {
        await updateXP(amount);
    } catch (error) {
        console.error('Error awarding XP:', error);
    }
};
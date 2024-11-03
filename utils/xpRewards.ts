import { updateXP } from '../api/userApi';
import { Alert } from 'react-native';

export const XP_REWARDS = {
    ADD_FRIEND: 30,
    ACCEPT_FRIEND: 30,
    PURCHASE_VOUCHER: 100,
    CREATE_AVATAR: 30,
    UPDATE_AVATAR: 5,
    GROUP_PURCHASE_CREATE: 30,
    GROUP_PURCHASE_JOIN: 20,
};

interface XPUpdateResult {
    currentLevel: number;
    previousLevel: number;
    xpGained: number;
    totalXP: number;
    xpForNextLevel: number;
    xpProgress: number;
    leveledUp: boolean;
}

export const awardXP = async (amount: number): Promise<XPUpdateResult> => {
    try {
        const result = await updateXP(amount);
        return {
            currentLevel: result.currentLevel,
            previousLevel: result.previousLevel,
            xpGained: amount,
            totalXP: result.totalXP,
            xpForNextLevel: result.xpForNextLevel,
            xpProgress: result.xpProgress,
            leveledUp: result.leveledUp
        };
    } catch (error) {
        console.error('Error awarding XP:', error);
        throw error;
    }
};

export const showXPAlert = (xpResult: XPUpdateResult) => {
    if (xpResult.leveledUp) {
        Alert.alert(
            '⬆️ Level Up!',
            `🎉 Congratulations!\nYou've reached level ${xpResult.currentLevel}! 🌟`,
            [{ text: 'Awesome!' }]
        );
    } else {
        Alert.alert(
            '🎉 XP Earned!',
            `✨ You earned ${xpResult.xpGained} XP!`,
            [{ text: 'Cool!' }]
        );
    }
};
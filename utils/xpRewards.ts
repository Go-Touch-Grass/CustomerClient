import { customerCashback, updateXP } from '../api/userApi';
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

let isXpDoublerActive = false;
let xpDoublerTimeout: NodeJS.Timeout | null = null;

export const activateXpDoubler = () => {
    isXpDoublerActive = true;
    if (xpDoublerTimeout) {
        clearTimeout(xpDoublerTimeout);
    }
    xpDoublerTimeout = setTimeout(() => {
        isXpDoublerActive = false;
        xpDoublerTimeout = null;
        console.log('XP Doubler has expired.');
    }, 15 * 60 * 1000); 
};

export const awardXP = async (amount: number): Promise<XPUpdateResult> => {
    try {
        const effectiveAmount = isXpDoublerActive ? amount * 2 : amount;
        const result = await updateXP(effectiveAmount);
        return {
            currentLevel: result.currentLevel,
            previousLevel: result.previousLevel,
            xpGained: effectiveAmount,
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
        customerCashback(3);
        Alert.alert(
            '⬆️ Level Up!',
            `🎉 Congratulations!\nYou've reached level ${xpResult.currentLevel}! 🌟\n💎 You earned 3 Gems as a reward for levelling up! 💎`,
            
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
import { StyleSheet } from 'react-native';

export const HomeScreenAvatarStyles =(avatarSize: number) => 

    StyleSheet.create({
        avatarContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        },

        avatar: {
        width: avatarSize, 
        height: avatarSize,
        },

        hat: {
        position: 'absolute',
        top: avatarSize * -0.22,
        width: avatarSize * 0.6, 
        height: avatarSize * 0.4, 
        },

        upperWear: {
        position: 'absolute',
        top: avatarSize * 0.23,
        width: avatarSize * 0.58, 
        height: avatarSize * 0.58,
        },

        lowerWear: {
        position: 'absolute',
        top: avatarSize * 0.7, 
        width: avatarSize * 0.9, 
        height: avatarSize * 0.5, 
        },

    });
  
// HomeStyles.ts

import { StyleSheet } from 'react-native';
import { Colors } from './commonStyles';

export const CreateAvatarStyles = StyleSheet.create({
    
    avatarImage: {
        width: 80, // Set desired width
        height: 80, // Set desired height
        borderRadius: 40, // For circular avatar
        marginBottom: 5, // Space between image and text
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    avatarContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginVertical: 80,
    },
    avatar: {
        width: 150, // Set the size you want for the base avatar
        height: 150,
    },
    hat: {
        position: 'absolute',
        top: -45,
        width: 80, // Adjust based on the hat's size
        height: 90,
    },
    upperWear: {
        position: 'absolute',
        top: 42,
        width: 100, // Adjust based on the upper wear's size
        height: 80,
    },
    lowerWear: {
        position: 'absolute',
        top: 120,
        width: 150, // Adjust based on the lower wear's size
        height: 70,
    },
    categorySelection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginVertical: 10,
    },
    categoryButton: {
        backgroundColor: Colors.green,
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    categoryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    wearItemContainer: {
        margin: 10,
        alignItems: 'center', // Center the item icon vertically
    },
    wearItem: {
        width: 50,
        height: 50,
    },
    equippedItem: {
        borderWidth: 2,
        borderColor: Colors.green,
        borderRadius: 5,
        width: 54, // Slightly larger than the wearItem to account for the border
        height: 54, // Slightly larger than the wearItem to account for the border
    },
    finishButton: {
        backgroundColor: Colors.tertiary,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        width: '80%',
        marginBottom: 100,
    },
    finishButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

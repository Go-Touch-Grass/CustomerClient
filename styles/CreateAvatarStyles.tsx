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
        /*
        Original - BUT dynamic sizing not working with share
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginVertical: 80,
        */
        width: 150, // Set explicit width
        height: 220, // Adjust height to fit avatar, hat, and other items
        padding: 20, // Add padding to center the avatar
        marginVertical: 80,
        paddingVertical: 20,
        //backgroundColor: 'lightgray', // Temporary background color for testing
        position: 'relative',
        alignItems: 'center',
        backgroundColor: 'transparent', // For capturing without background
    },
    backgroundTextContainer: {
        position: 'absolute',
        bottom: 35,
        right: -30,
        transform: [{ rotate: '-90deg' }], // Rotate vertically
        flexDirection: 'row', // Align flower and text horizontally in the rotated container
        alignItems: 'center',
    },
    flowerIcon: {
        fontSize: 20, // Adjust the size of the flower icon
        color: 'green', // Match color to text
        marginLeft: 4, // Space between icon and text
        marginTop: 10, // Adjust vertical alignment of icon
    },
    backgroundText: {
        fontSize: 16,
        color: 'green', // Text color
        textAlign: 'right',
        writingDirection: 'ltr',
    },
    avatar: {
        position: 'absolute',
        width: 150, // Set the size you want for the base avatar
        height: 150,
        top: 30,
    },
    hat: {
        position: 'absolute',
        top: -10,
        left: 31, // added to move hat to right
        width: 80, // Adjust based on the hat's size
        height: 90,
    },
    upperWear: {
        position: 'absolute',
        top: 70,
        left: 25, // added to move upper wear to right
        width: 100, // Adjust based on the upper wear's size
        height: 80,
    },
    lowerWear: {
        position: 'absolute',
        top: 145,
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
    shareButton: {
        backgroundColor: Colors.green,
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
        alignItems: 'center',
        width: '40%',
    },
    shareButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

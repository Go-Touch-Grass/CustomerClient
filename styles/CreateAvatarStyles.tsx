import { StyleSheet } from 'react-native';

export const createAvatarStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        padding: 20,
        backgroundColor: '#f5f5f5', // Light gray background
    },
    avatarContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff', // White background for the avatar viewer
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5, // Android shadow
        marginRight: 20,
    },
    inventoryContainer: {
        flex: 1,
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#007BFF', // Blue color for the button
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
        width: '80%',
    },
    buttonText: {
        color: '#fff', // White text for the button
        fontWeight: 'bold',
        fontSize: 16,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 15,
    },
    inventoryItem: {
        width: 50,
        height: 50,
        margin: 5,
        borderWidth: 1,
        borderColor: '#ddd', // Light border around inventory items
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

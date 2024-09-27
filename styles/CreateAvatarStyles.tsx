import { StyleSheet } from 'react-native';
// Styles for the component
export const CreateAvatarStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarContainer: {
        position: 'relative',
        width: 100, // Width of the avatar
        height: 150, // Height of the avatar
    },
    sprite: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    collectableContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginVertical: 20,
    },
    collectable: {
        width: 50, // Size of the collectable images
        height: 50,
        margin: 5,
    },
    createAvatarButton: {
        backgroundColor: '#6200ee',
        padding: 10,
        borderRadius: 5,
    },
    createAvatarText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
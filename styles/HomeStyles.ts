import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from './commonStyles';

const { width } = Dimensions.get('window');

export const homeStyles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
    },
    menuContainer: {
        position: 'absolute',
        top: 60,
        left: 35,
        zIndex: 1000,
    },
    menuButton: {
        padding: 20,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    menuButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    menu: {
        position: 'absolute',
        top: 135,
        left: 35,
        backgroundColor: Colors.primary,
        borderRadius: 5,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: width * 0.6,
        minWidth: 200,
        zIndex: 1000,
    },
    menuItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.secondary,
    },
    menuItemText: {
        fontSize: 18,
        color: Colors.brand,
    },
    mapContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
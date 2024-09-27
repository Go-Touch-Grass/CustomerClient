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
    centerButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: 'white',
        color: 'black',
        borderRadius: 30,
        padding: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    markerContainer: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    markerBackground: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(0, 122, 255, 0.2)',
        position: 'absolute',
    },
    markerDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'rgb(0, 122, 255)',
        borderWidth: 3,
        borderColor: 'white',
    },
    editAvatarButton: {
        position: 'absolute', // Keep the button positioned absolutely
        left: 20, // Position it 20 units from the left edge of the screen
        top: '50%', // Center it vertically
        transform: [{ translateY: -25 }], // Adjust to vertically center the button (half of the button's height)
        backgroundColor: Colors.primary, // Use your primary color
        borderRadius: 30, // Rounded corners
        paddingVertical: 10, // Vertical padding
        paddingHorizontal: 15, // Horizontal padding
        elevation: 5, // Shadow for Android
        shadowColor: '#000', // Shadow color for iOS
        shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
        shadowOpacity: 0.3, // Shadow opacity for iOS
        shadowRadius: 4, // Shadow radius for iOS
        alignItems: 'center', // Center text horizontally
      },
    
      editAvatarButtonText: {
        color: '#fff', // White text color
        fontSize: 16, // Font size
        fontWeight: 'bold', // Bold text
      },
});
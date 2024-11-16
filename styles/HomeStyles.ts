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
        backgroundColor: Colors.green,
        borderRadius: 5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginLeft: -10,
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
        backgroundColor: Colors.white,
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
        color: Colors.black,
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
    avatarImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    avatarOverlay: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 40,
        padding: 5,
        zIndex: 1000,
    },
    noAvatarText: {
        fontSize: 16,
        color: Colors.white,
        textAlign: 'center',
        padding: 10,
    },
    entityNameText: {
        marginTop: 15, 
        color: 'black', 
        fontSize: 12, 
        textAlign: 'center',
        fontWeight: 'bold',
        maxWidth: 150,
      },
    labelText: {
        color: '#e01414',
        fontSize: 35,
        top: 0,
        left: 10,
        transform: [{ translateX: -10 }],
    },
    messageContainer: {
        position: 'absolute',
        top: '40%', // adjust this value to move it upwards or downwards
        left: '27%',
        transform: [{ translateX: -50 }], // center horizontally
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // semi-transparent background
        padding: 10,
        borderRadius: 5,
    },
    messageText: {
        color: '#90EE90',
        fontSize: 16,
      },
    timer: {
        position: 'absolute', // Adjust position as needed
        top: 140, // You can change this value to position the timer where you want
        right: 305, // Positioning to the right side, adjust if necessary
        zIndex: 1000,
    },
    timerMessageContainer: {
        position: 'absolute',
        top: '20%', // adjust this value to move it upwards or downwards
        left: '15%',
        transform: [{ translateX: -50 }], // center horizontally
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // semi-transparent background
        padding: 10,
        borderRadius: 5,
    },
    timerMessageText: {
        color: '#90EE90',
        fontSize: 16,
    },
    searchContainer: {
        flexDirection: 'row', // Align horizontally
        alignItems: 'center',  // Vertically center the input
        paddingHorizontal: 10, // Space around the container
        width: '100%',  // Ensure it takes up full width
      },
      searchInput: {
        flex: 1,  // Ensure it takes up all available space
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
      },
    listItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#eee',
      },
      branchName: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      branchDetails: {
        fontSize: 14,
        color: '#888',
      },
      noResultsText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        color: '#888',
      },
});
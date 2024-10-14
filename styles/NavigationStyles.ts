import { StyleSheet } from 'react-native';
import { Colors } from './commonStyles';

export const NavigationStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    map: {
      flex: 1,
    },
    popupBox: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 15,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5, // For Android shadow
      alignItems: 'center', // Center the content inside the box
    },
    popupText: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center', // Center the text
    },
    exitButton: {
      backgroundColor: 'red', // Change the color as needed
      borderRadius: 5,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    exitButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
  });
  
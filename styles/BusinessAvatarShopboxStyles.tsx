import { StyleSheet } from 'react-native';
import { Colors } from './commonStyles';


export const BusinessAvatarShopboxStyles = StyleSheet.create({
    // ... other styles
    shopBox: {
      position: 'absolute',
      bottom: 50, // Adjust as needed
      left: 20,
      right: 20,
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
    },
    shopTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    backButton: {
      marginTop: 20,
      padding: 10,
      backgroundColor: '#ddd',
      alignItems: 'center',
      borderRadius: 5,
    },
    entityName: {
        fontSize: 16,  
        fontWeight: 'bold',  
        color: '#333',  
        textAlign: 'center',
        marginBottom: 8,  
      },
  });
  
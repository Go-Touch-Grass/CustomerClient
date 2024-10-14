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
      backgroundColor: '#f59f9f',
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
      vouchersList: {
        marginTop: 20,
        paddingHorizontal: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        paddingVertical: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5, // for Android shadow
      },
      voucherItem: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
        flexDirection: 'row', // Keep the direction horizontal
        justifyContent: 'flex-start', // Align items to the left
        alignItems: 'flex-start', // Align items to the top
        borderWidth: 1,
        borderColor: '#eee',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      voucherDetails: {
        flex: 1, // Allow the details to take available space
        paddingLeft: 10, // Add some space between image and text
      },
      voucherName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5, // Space between name and price
      },
      originalPrice: {
        fontWeight: 'bold',
        marginBottom: 5, // Space between price and discount
      },
      voucherDiscount: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ff4d4d', // Highlight the discount with red
      },
      voucherImage: {
        width: 50, // Adjust width as necessary
        height: 50, // Adjust height as necessary
        borderRadius: 8,
        marginBottom: 8,
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#696969', // Semi-transparent background
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 20,
        color: '#fff', // Adjust text color as needed
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    quantityInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        width: 60,
        textAlign: 'center',
        marginHorizontal: 10,
        padding: 5,
        borderRadius: 5,
        backgroundColor: '#fff', // Adjust background color as needed
    },
    totalCost: {
        fontSize: 16,
        marginBottom: 20,
        color: '#fff', // Adjust text color as needed
    },
    confirmButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    confirmButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    cancelButton: {
        color: '#fff',
        textAlign: 'center',
    },
    successMessage: {
      marginTop: 20,
      fontSize: 16,
      color: 'green',
      textAlign: 'center',
  }
  });
  
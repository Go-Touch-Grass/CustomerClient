import React, { useState, useEffect } from 'react';
import { StyledContainer, InnerContainer, PageTitle } from '../styles/commonStyles';
import { Text, TouchableOpacity, View } from 'react-native';
import ProtectedRoute from '../components/ProtectedRoute';
import { StyleSheet } from 'react-native';
import { DataTable } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Ionicons } from '@expo/vector-icons';
import { useStripe } from '@stripe/stripe-react-native';
import axiosInstance from '../api/authApi';
import { getToken } from '../utils/asyncStorage';

const options = [
  { id: 0, title: '50', price: 5, bonus: 0, total: 50 },
  { id: 1, title: '100', price: 10, bonus: 1, total: 101 },
  { id: 2, title: '250', price: 25, bonus: 10, total: 260 },
  { id: 3, title: '500', price: 50, bonus: 45, total: 545 },
  { id: 4, title: '1000', price: 100, bonus: 150, total: 1150 },
];

const Store: React.FC = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [itemIndex, setItemIndex] = useState<number | null>(null);
  const [paymentSheetInitialized, setPaymentSheetInitialized] = useState(false);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null); // State to store the payment intent ID

  const handleBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (itemIndex !== null) {
      initializePaymentSheet();
    }
  }, [itemIndex]);

  const initializePaymentSheet = async () => {
    if (itemIndex !== null) {
      try {
        console.log('Creating payment intent for item:', options[itemIndex]);
        const token = await getToken();
        console.log('Token retrieved:', token ? 'Yes' : 'No');

        const response = await axiosInstance.post('/api/payment/create-payment-intent', {
          amount: options[itemIndex].price * 100, // in cents
          currency: 'sgd',
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('API response:', response.data);

        const { clientSecret, paymentIntentId: id } = response.data;

        if (!clientSecret) {
          console.error('Failed to get client secret. API response:', response.data);
          return;
        }

        const { error } = await initPaymentSheet({
          paymentIntentClientSecret: clientSecret,
          customFlow: true,
          merchantDisplayName: 'Go Touch Grass',
        });

        if (error) {
          console.error('Error initializing payment sheet:', error);
        } else {
          console.log('Payment sheet initialized successfully');
          setPaymentSheetInitialized(true);
          setPaymentIntentId(id); // Store the payment intent ID for later verification
        }
      } catch (error: any) {
        console.error('Error creating payment intent:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
          console.error('Error status:', error.response.status);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error setting up request:', error.message);
        }
      }
    }
  };

  const handleSelectItem = (selectedItem: any) => {
    setItemIndex(selectedItem.id);
    setPaymentSheetInitialized(false);
    setPaymentIntentId(null); // Reset payment intent ID when selecting a new item
  };

  const viewPaymentSheet = async () => {
    if (itemIndex === null) {
      console.error('No item selected');
      return;
    }

    if (!paymentSheetInitialized) {
      console.error('Payment sheet not initialized');
      return;
    }

    const { error } = await presentPaymentSheet();

    if (error) {
      console.error('Error presenting payment sheet:', error);
    } else {
      console.log('Payment sheet for itemIndex', itemIndex, 'submitted');
      
      try {
        const token = await getToken();
        const gemsAdded = options[itemIndex].total;

        // Verify payment and top up gems
        const response = await axiosInstance.post(
          '/auth/verify-topUp',
          {
            paymentIntentId: paymentIntentId, // Send the payment intent ID
            gemsAdded: gemsAdded, // Send the number of gems added
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          console.log('Gems topped up successfully:', response.data.balance);
          setDisableButton(true); // Disable the button after successful payment
        } else {
          console.error('Failed to top up gems:', response.data.message);
        }
      } catch (error: any) {
        console.error('Error verifying payment and updating gem balance:', error.response ? error.response.data : error.message);
      }
    }
  };

  return (
    <StyledContainer>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" style={styles.backIcon} />
      </TouchableOpacity>
      <InnerContainer>
        <PageTitle>Store</PageTitle>
        <Text>Purchase Gems Here!</Text>
        <DataTable style={styles.container}>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title style={styles.textCenter}>Price (SGD)</DataTable.Title>
            <DataTable.Title style={styles.textCenter}>Gems</DataTable.Title>
            <DataTable.Title style={styles.textCenter}>Bonus</DataTable.Title>
            <DataTable.Title style={styles.textCenter}>Total Gems</DataTable.Title>
          </DataTable.Header>
          {options.map((option) => (
            <DataTable.Row key={option.id}>
              <DataTable.Cell style={styles.textCenter}>${option.price}</DataTable.Cell>
              <DataTable.Cell style={styles.textCenter}>{option.total}</DataTable.Cell>
              <DataTable.Cell style={styles.textCenter}>{option.bonus ? option.bonus : 'No Bonus'}</DataTable.Cell>
              <DataTable.Cell style={styles.textCenter}>{option.total}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </InnerContainer>
      <InnerContainer>
        <SelectDropdown
          data={options}
          onSelect={handleSelectItem}
          renderButton={(selectedItem, isOpened) => {
            return (
              <View style={styles.dropdownButtonStyle}>
                {selectedItem && <Icon name={selectedItem.icon} style={styles.dropdownButtonIconStyle} />}
                <Text style={{ marginRight: 100 }}>Amount of Gems</Text>
                <Text style={styles.dropdownButtonTxtStyle}>{(selectedItem && selectedItem.title) || ''}</Text>
                <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
              </View>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                <Icon name={item.icon} style={styles.dropdownItemIconStyle} />
                <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />

        {itemIndex !== null && (
          <View style={{ marginTop: 30 }}>
            <Text>Payable Amount: ${options[itemIndex].price} </Text>
            <Text>Bonus Gems Earned: {options[itemIndex].bonus}</Text>
            <Text style={{ fontWeight: 'bold' }}>Total Gems Earned: {options[itemIndex].total}</Text>

            <TouchableOpacity
              disabled={disableButton || !paymentSheetInitialized}
              style={disableButton || !paymentSheetInitialized ? styles.disabledButton : styles.button}
              onPress={viewPaymentSheet}
            >
              <Text style={styles.buttonText}>Purchase</Text>
            </TouchableOpacity>
          </View>
        )}
      </InnerContainer>
    </StyledContainer>
  );
};

export default ProtectedRoute(Store);

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  tableHeader: {
    backgroundColor: '#DCDCDC',
  },
  textCenter: {
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#FFC0CB',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownButtonStyle: {
    width: 'auto',
    height: 50,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 5,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  backIcon: {
    color: '#4CAF50',
    fontSize: 24,
  },
});
import React, { useState } from 'react';
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
import { initStripe, useStripe } from '@stripe/stripe-react-native';
import axiosInstance from '../api/authApi';
import { getToken } from '../utils/asyncStorage';

const publishableKey =
  'pk_test_51Q4z0HQA4DV7K9th7CJIMBmLCVDZi7RH3B1TtjEWfehCb8Ik5xM2j0zj0W1XaS837K47brkxSDLSUnc3zOOLzS2s00F3or1KLh';

const options = [
  { id: 0, title: '50', price: 5, bonus: 0, total: 50 },
  { id: 1, title: '100', price: 10, bonus: 1, total: 101 },
  { id: 2, title: '250', price: 25, bonus: 10, total: 260 },
  { id: 3, title: '500', price: 50, bonus: 45, total: 545 },
  { id: 4, title: '1000', price: 100, bonus: 150, total: 1150 },
];

const Store: React.FC = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [itemIndex, setItemIndex] = useState<number>();
  const navigation = useNavigation<StackNavigationProp<any>>();
  //const [message, setMessage] = useState<string>('Buy Now');
  const [disableButton, setDisableButton] = useState<boolean>(false);

  const handleBack = () => {
    navigation.goBack();
  };

  React.useEffect(() => {
    (async () => {
      await initStripe({
        publishableKey,

        merchantIdentifier: 'yourMerchantIdentifier',
      });

      await initializePaymentSheet();
    })();
  }, []);

  const initializePaymentSheet = async () => {
    if (itemIndex) {
      const { clientSecret } = await axiosInstance
        .post('/api/payment/create-payment-intent', {
          amount: options[itemIndex].price * 100, //in cents
          currency: 'sgd',
        })
        .then((response) => {
          console.log(response.data);
          return response.data;
        })
        .catch((error) => {
          //setMessage('Error creating payment intent');
          // setPaymentProcessing(false);
          return { clientSecret: null };
        });

      if (!clientSecret) return;

      const { error, paymentOption } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        customFlow: true,
        merchantDisplayName: 'Go Touch Grass',
      });

      console.log(paymentOption);
      if (error) {
        console.log(error);
      }
    }
  };

  const viewPaymentSheet = async () => {
    const token = await getToken();
    const { error } = await presentPaymentSheet();
    if (error) {
      console.error(error);
    } else {
      console.log('payment went through', itemIndex);

      if (itemIndex) {
        // Call your backend API to update the gem balance after successful payment
        await axiosInstance
          .post(
            'auth/top_up_gems',
            {
              currency_cents: options[itemIndex].price * 100, // Amount paid in cents
              gems_added: options[itemIndex].total, // Add gems to the tourist account
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          )
          .then((res) => setDisableButton(true))
          .catch((error) => {
            console.log(error.message);
          });
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
          <DataTable.Row>
            <DataTable.Cell style={styles.textCenter}>$5</DataTable.Cell>
            <DataTable.Cell style={styles.textCenter}>50</DataTable.Cell>
            <DataTable.Cell style={styles.textCenter}>No Bonus</DataTable.Cell>
            <DataTable.Cell style={styles.textCenter}>50</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell style={styles.textCenter}>$10</DataTable.Cell>
            <DataTable.Cell style={styles.textCenter}>100</DataTable.Cell>
            <DataTable.Cell style={styles.textCenter}>1</DataTable.Cell>
            <DataTable.Cell style={styles.textCenter}>101</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell style={styles.textCenter}>$25</DataTable.Cell>
            <DataTable.Cell style={styles.textCenter}>250</DataTable.Cell>
            <DataTable.Cell style={styles.textCenter}>10 </DataTable.Cell>
            <DataTable.Cell style={styles.textCenter}>260</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell style={styles.textCenter}>$50</DataTable.Cell>
            <DataTable.Cell style={styles.textCenter}>500</DataTable.Cell>
            <DataTable.Cell style={styles.textCenter}>45 </DataTable.Cell>
            <DataTable.Cell style={styles.textCenter}>545</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell style={styles.textCenter}>$100</DataTable.Cell>
            <DataTable.Cell style={styles.textCenter}>1000</DataTable.Cell>
            <DataTable.Cell style={styles.textCenter}>150 </DataTable.Cell>
            <DataTable.Cell style={styles.textCenter}>1150</DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </InnerContainer>
      <InnerContainer>
        <SelectDropdown
          data={options}
          onSelect={(selectedItem) => {
            setItemIndex(selectedItem.id);
          }}
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

        {itemIndex && (
          <View style={{ marginTop: 30 }}>
            <Text>Payable Amount: ${options[itemIndex].price} </Text>
            <Text>Bonus Gems Earned: {options[itemIndex].bonus}</Text>
            <Text style={{ fontWeight: 'bold' }}>Total Gems Earned: {options[itemIndex].total}</Text>

            <TouchableOpacity
              disabled={disableButton}
              style={disableButton ? styles.disabledButton : styles.button}
              onPress={viewPaymentSheet}
            >
              <Text style={styles.buttonText}>{disableButton ? 'Payment Successful!' : 'Buy Now'}</Text>
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

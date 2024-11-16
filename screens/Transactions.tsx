import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axiosInstance from '../api/authApi';
import { getToken } from '../utils/asyncStorage';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyledContainer, InnerContainer, PageTitle } from '../styles/commonStyles';

interface Transaction {
  transaction_id: number;
  currency_amount: string | null;
  gems_added: number | null;
  gems_deducted: number | null;
  transaction_date: string;
}

const Transactions: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch transactions from the API
  const fetchTransactions = async () => {
    try {
      const token = await getToken();
      const response = await axiosInstance.get('/auth/customer-transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionText}>Transaction ID: {item.transaction_id}</Text>
      <Text style={styles.transactionText}>
        {item.gems_added ? `Gems Added: ${item.gems_added}` : `Gems Deducted: ${item.gems_deducted}`}
      </Text>
      {item.currency_amount && (
        <Text style={styles.transactionText}>Amount: ${item.currency_amount}</Text>
      )}
      <Text style={styles.transactionText}>
        Date: {new Date(item.transaction_date).toLocaleDateString()}
      </Text>
    </View>
  );

  const handleBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  return (
    <StyledContainer>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" style={styles.backIcon} />
      </TouchableOpacity>
      <InnerContainer>
        <PageTitle>Transactions</PageTitle>
        {transactions.length > 0 ? (
          <FlatList
            data={transactions}
            renderItem={renderTransactionItem}
            keyExtractor={(item) => item.transaction_id.toString()}
          />
        ) : (
          <Text style={styles.noDataText}>No transactions found.</Text>
        )}
      </InnerContainer>
    </StyledContainer>
  );
};

const styles = StyleSheet.create({
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
  transactionItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  transactionText: {
    fontSize: 16,
    marginBottom: 5,
  },
  loader: {
    marginTop: 50,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
    marginTop: 20,
  },
});

export default Transactions;
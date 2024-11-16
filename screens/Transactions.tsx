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
    <View style={styles.row}>
      <View style={styles.idCell}>
        <Text style={styles.cellText}>{item.transaction_id}</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>
          {item.gems_added ? `${item.gems_added}` : `-${item.gems_deducted}`}
        </Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>
          {item.currency_amount ? `$${item.currency_amount}` : '-'}
        </Text>
      </View>
      <View style={styles.dateCell}>
        <Text style={styles.cellText}>{new Date(item.transaction_date).toLocaleDateString()}</Text>
      </View>
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
        {/* Table Wrapper that takes the full width */}
        <View style={styles.tableWrapper}>
          <View style={styles.tableHeader}>
            <View style={styles.idHeaderCell}><Text style={styles.headerText}>ID</Text></View> {/* Reduced space for ID */}
            <View style={styles.headerCell}><Text style={styles.headerText}>Gems</Text></View>
            <View style={styles.headerCell}><Text style={styles.headerText}>Amount</Text></View>
            <View style={styles.dateHeaderCell}><Text style={styles.headerText}>Date</Text></View> {/* More space for Date */}
          </View>
          {transactions.length > 0 ? (
            <FlatList
              data={transactions}
              renderItem={renderTransactionItem}
              keyExtractor={(item) => item.transaction_id.toString()}
            />
          ) : (
            <Text style={styles.noDataText}>No transactions found.</Text>
          )}
        </View>
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
  tableWrapper: {
    width: '100%',  // Ensure the table takes the full width
    marginTop: 20,  // Add some spacing above the table
  },
  tableHeader: {
    flexDirection: 'row',  // Ensure table header is in a row layout
    backgroundColor: '#f2f2f2',  // Light background for header
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  idHeaderCell: {
    flex: 0.5,  // Reduce the space for the ID column
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerCell: {
    flex: 1,  // Ensure other columns take equal space
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  dateHeaderCell: {
    flex: 2,  // Make the Date column take more space
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  row: {
    flexDirection: 'row',  // Make the row horizontal
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  idCell: {
    flex: 0.5,  // Reduce space for the ID column in the row
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  cell: {
    flex: 1,  // Ensure other cells take equal space
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  dateCell: {
    flex: 2,  // Make the Date cell take more space
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  cellText: {
    fontSize: 14,
    color: '#333',
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
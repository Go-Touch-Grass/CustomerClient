import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getCustomerVouchers, redeemVoucher } from '../api/voucherApi'; // Ensure this path is correct
import { useNavigation } from '@react-navigation/native'; // Import for navigation
import { Ionicons } from '@expo/vector-icons';
import { StyledContainer, InnerContainer, PageTitle } from '../styles/commonStyles';
import { Colors } from '../styles/commonStyles';
import { StyleSheet } from 'react-native';
import { IP_ADDRESS } from '@env';

interface Voucher {
    listing_id: number;
    name: string;
    description: string;
    price: number;
    discount: number;
    voucherImage?: string;
    created_at: Date;
    updated_at: Date;
    redeemed: boolean;
    expirationDate?: string;
    voucher_transaction_id: number;
}

interface VoucherResponse {
    status: number;
    vouchers: Voucher[];
}

const ViewVoucherInventory: React.FC = () => {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedVoucher, setExpandedVoucher] = useState<number | null>(null); // Track which voucher is expanded
    const navigation = useNavigation(); // Use navigation hook

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const fetchedVouchersResponse: VoucherResponse = await getCustomerVouchers();
                console.log('Fetched vouchers:', fetchedVouchersResponse); // Log the response
                setVouchers(fetchedVouchersResponse.vouchers);
            } catch (error) {
                console.error('Error fetching customer vouchers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVouchers();
    }, []);

    const handleVoucherClick = (listing_id: number) => {
        setExpandedVoucher(expandedVoucher === listing_id ? null : listing_id);
    };

    const handleRedeem = async (voucher: Voucher) => {
        try {
            const transactionId = voucher.voucher_transaction_id;
            if (!transactionId) {
                console.error('Voucher transaction ID is missing');
                return;
            }

            await redeemVoucher(transactionId);

            setVouchers(prevVouchers => prevVouchers.map(v =>
                v.voucher_transaction_id === transactionId ? { ...v, redeemed: true } : v
            ));

            console.log(`Voucher transaction redeemed: ${transactionId}`);
        } catch (error) {
            console.error('Failed to redeem voucher transaction:', error);
        }
    };

    const renderVoucher = ({ item, index }: { item: Voucher; index: number }) => {
        const isExpanded = expandedVoucher === item.listing_id;
        const isExpired = item.expirationDate ? new Date(item.expirationDate) < new Date() : false;

        return (
            <TouchableOpacity onPress={() => handleVoucherClick(item.listing_id)} style={styles.voucherContainer}>
                {item.voucherImage && (
                    <Image source={{ uri: `http://${IP_ADDRESS}:8080/${item.voucherImage}` }} style={styles.voucherImage} />
                )}
                <Text style={styles.voucherName}>{`Voucher ${index + 1}: ${item.name || 'No Name'}`}</Text>
                {isExpanded && (
                    <View style={styles.detailsContainer}>
                        <Text style={styles.voucherDescription}>{item.description || 'No Description'}</Text>
                        <Text style={styles.voucherPrice}>Price: ${item.price}</Text>
                        <Text style={styles.voucherDiscount}>Discount: {item.discount}%</Text>
                        <Text style={styles.voucherDiscount}>Discounted price: ${(item.price * (100 - item.discount)) / 100}</Text>
                        {item.expirationDate && (
                            <Text style={styles.expirationDate}>Expiry Date: {new Date(item.expirationDate).toLocaleDateString()}</Text>
                        )}
                        {item.redeemed ? (
                            <Text style={styles.redeemedText}>Redeemed</Text>
                        ) : isExpired ? (
                            <Text style={styles.redeemedText}>Expired</Text>
                        ) : (
                            <TouchableOpacity
                                style={[styles.redeemButton, isExpired && styles.disabledButton]}
                                onPress={() => handleRedeem(item)}
                                disabled={isExpired}
                            >
                                <Text style={styles.redeemButtonText}>Redeem</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <StyledContainer>
                <ActivityIndicator size="large" color={Colors.green} />
            </StyledContainer>
        );
    }

    return (
        <StyledContainer>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" style={styles.backIcon} />
            </TouchableOpacity>
            <InnerContainer>
                <PageTitle>Voucher Inventory</PageTitle>
                {vouchers.length === 0 ? (
                    <Text style={styles.emptyInventoryText}>Nothing in inventory</Text>
                ) : (
                    <FlatList
                        data={vouchers}
                        renderItem={renderVoucher}
                        keyExtractor={item => item.listing_id.toString()}
                        contentContainerStyle={styles.listContainer}
                    />
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
        color: Colors.green,
        fontSize: 24,
    },
    emptyInventoryText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.tertiary,
        textAlign: 'center',
        marginTop: 20,
    },
    listContainer: {
        padding: 10,
        width: '100%', // Ensure the list takes full width
    },
    voucherContainer: {
        backgroundColor: Colors.white,
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.secondary,
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
        width: 300, // Increase the width of each voucher container
        alignSelf: 'center', // Center the voucher container
    },
    voucherImage: {
        width: '100%',
        height: 180, // Slightly increase the height for better proportion
        borderRadius: 10,
        marginBottom: 10,
    },
    voucherName: {
        fontSize: 20, // Slightly increase font size
        fontWeight: 'bold',
        color: Colors.tertiary,
        marginBottom: 8,
    },
    detailsContainer: {
        marginTop: 12,
    },
    voucherDescription: {
        fontSize: 16,
        marginBottom: 8,
        color: Colors.tertiary,
    },
    voucherPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.tertiary,
        marginBottom: 4,
    },
    voucherDiscount: {
        fontSize: 16,
        color: Colors.tertiary,
        marginBottom: 4,
    },
    expirationDate: {
        fontSize: 14,
        color: Colors.tertiary,
        marginTop: 8,
        marginBottom: 8,
    },
    redeemButton: {
        backgroundColor: Colors.green,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
    },
    redeemButtonText: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    redeemedText: {
        color: Colors.green,
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 8,
    },
    disabledButton: {
        backgroundColor: Colors.lightGray,
    },
});

export default ViewVoucherInventory;

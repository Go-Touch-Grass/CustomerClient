import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getCustomerVouchers, redeemVoucher } from '../api/voucherApi'; // Ensure this path is correct
import { useNavigation } from '@react-navigation/native'; // Import for navigation

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
        const price = typeof item.price === 'number' ? item.price : 0; // Default to 0 if undefined
        const discount = typeof item.discount === 'number' ? item.discount : 0; // Default to 0 if undefined
        const isExpanded = expandedVoucher === item.listing_id; // Check if this voucher is expanded

        // Check if the voucher is expired
        const isExpired = item.expirationDate ? new Date(item.expirationDate) < new Date() : false;

        return (
            <TouchableOpacity onPress={() => handleVoucherClick(item.listing_id)} style={styles.voucherContainer}>
                {item.voucherImage && (
                    <Image source={{ uri: `http://192.168.18.67:8080/${item.voucherImage}` }} style={styles.voucherImage} />
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
                            <Text style={styles.redeemedText}>Expired</Text> // Indicate that the voucher is expired
                        ) : (
                            <View style={styles.redeemContainer}>
                                <TouchableOpacity
                                    style={[styles.redeemButton, isExpired && { backgroundColor: '#ccc' }]} // Change button style if expired
                                    onPress={() => handleRedeem(item)}
                                    disabled={isExpired} // Disable button if expired
                                >
                                    <Text style={styles.redeemButtonText}>Redeem</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
            </TouchableOpacity>
        );
    };


    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (vouchers.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.emptyInventoryText}>Nothing in inventory</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Inventory of Purchased Vouchers</Text>
            </View>
            {vouchers.length === 0 ? (
                <View style={styles.noVouchersContainer}>
                    <Text style={styles.noVouchersText}>Nothing in inventory</Text>
                </View>
            ) : (
                <FlatList
                    data={vouchers}
                    renderItem={renderVoucher}
                    keyExtractor={item => item.listing_id.toString()}
                    contentContainerStyle={styles.listContainer}
                />
            )}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    emptyInventoryText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#555',
        textAlign: 'center',
        marginTop: 20,
    },
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        marginTop: 50,
    },
    header: {
        backgroundColor: '#4CAF50',
        padding: 15,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    noVouchersContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noVouchersText: {
        fontSize: 18,
        color: '#888',
    },
    redeemContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    redeemButton: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#FFD700',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    redeemButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 12,
    },
    backButton: {
        padding: 15,
        backgroundColor: '#4CAF50',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    listContainer: {
        padding: 10,
    },
    voucherContainer: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    voucherImage: {
        width: '100%',
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    voucherName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    detailsContainer: {
        marginTop: 10,
    },
    voucherDescription: {
        fontSize: 16,
        marginBottom: 5,
        color: '#555',
    },
    voucherPrice: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    voucherDiscount: {
        fontSize: 14,
        color: '#888',
    },
    expirationDate: {
        fontSize: 14,
        color: '#888',
    },
    redeemedText: {
        color: 'green',
        fontWeight: 'bold',
    },
});

export default ViewVoucherInventory;

import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { getCustomerVouchers, redeemVoucher } from '../api/voucherApi';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StyledContainer, InnerContainer, PageTitle, Colors } from '../styles/commonStyles';
import { IP_ADDRESS } from '@env';
// Import your update function
import { updateVoucherStatus } from '../api/voucherApi';

export interface Voucher {
    listing_id: number;
    name: string;
    description: string;
    price: number;
    discount: number;
    voucherImage?: string;
    created_at: Date;
    updated_at: Date;
    redeemed: "yes" | "pending" | "no";
    expirationDate?: string;
    voucher_transaction_id: number;
    used: boolean; // Add the used attribute
    rewardItem?: {
        id: number;
        name: string;
        type: string;
        filepath: string;
    };
    quantity: number;
    status: boolean;
}

interface VoucherResponse {
    status: number;
    vouchers: Voucher[];
}

const ViewVoucherInventory: React.FC = () => {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedVoucher, setExpandedVoucher] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigation = useNavigation();

    // Fetch Vouchers
    // Fetch Vouchers
    useEffect(() => {
        const fetchVouchers = async () => {
            setError(null); // Reset error state before fetching
            try {
                const response: VoucherResponse = await getCustomerVouchers();

                if (response.status !== 200) throw new Error('Failed to fetch vouchers');

                // Filter and map valid vouchers, excluding those with quantity 0
                const validVouchers = response.vouchers
                    .filter(voucher => voucher.listing_id !== undefined && voucher.quantity > 0 && voucher.status === true)
                    .map(voucher => {
                        console.log('Voucher before mapping:', voucher); // Debugging line
                        return {
                            ...voucher,
                            redeemed: voucher.redeemed || "yes", // Ensure there's a valid default
                            expirationDate: voucher.expirationDate || new Date().toISOString(),
                            voucher_transaction_id: voucher.voucher_transaction_id || 0,
                            quantity: voucher.quantity,
                        };
                    });

                console.log('Valid vouchers:', validVouchers); // Debugging line
                setVouchers(validVouchers);
            } catch (err) {
                console.error('Error fetching customer vouchers:', err);
                setError('Failed to fetch vouchers. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchVouchers();
    }, []);


    // Toggle voucher details
    const handleVoucherClick = (listing_id: number) => {
        setExpandedVoucher(expandedVoucher === listing_id ? null : listing_id);
    };



    // Update the handleClose function
    const handleCrossButtonClick = async (voucher: Voucher) => {
        try {
            // Update the voucher status to false
            await updateVoucherStatus(voucher.listing_id, false);

            // Update local state to reflect the change
            setVouchers(prevVouchers =>
                prevVouchers.map(v =>
                    v.listing_id === voucher.listing_id ? { ...v, redeemed: "no" } : v
                )
            );
            console.log(`Voucher status updated to false: ${voucher.listing_id}`);
        } catch (err) {
            console.error('Error updating voucher status:', err);
            setError('Failed to update voucher status. Please try again later.');
        }
    };



    // Redeem a voucher
    const handleRedeem = async (voucher: Voucher) => {
        try {
            // Ensure the voucher can be redeemed
            if (voucher.redeemed === "pending") {
                console.warn('This voucher redemption is pending.');
                return;
            }

            console.log(`Attempting to redeem voucher with ID: ${voucher.listing_id}`);

            // Redeem the voucher - Pass the correct voucher ID
            await redeemVoucher(voucher.listing_id);

            // Update local state to reflect redemption as pending
            setVouchers(prevVouchers =>
                prevVouchers.map(v =>
                    v.listing_id === voucher.listing_id ? { ...v, redeemed: "pending" } : v
                )
            );
            console.log(`Voucher redemption set to pending: ${voucher.listing_id}`);
        } catch (err) {
            console.error('Error redeeming voucher:', err);
            setError('Failed to redeem voucher. Please try again later.');
        }
    };

    // Render a single voucher
    // Render a single voucher
    const renderVoucher = ({ item }: { item: Voucher }) => {
        const isExpanded = expandedVoucher === item.listing_id;
        const isExpired = item.expirationDate ? new Date(item.expirationDate) < new Date() : false;

        return (
            <TouchableOpacity onPress={() => handleVoucherClick(item.listing_id)} style={styles.voucherContainer}>
                {item.voucherImage && (
                    <Image source={{ uri: `http://${IP_ADDRESS}:8080/${item.voucherImage}` }} style={styles.voucherImage} />
                )}
                <Text style={styles.voucherName}>{`Voucher ${item.listing_id}: ${item.name || 'No Name'}`}</Text>
                {isExpanded && (
                    <View style={styles.detailsContainer}>
                        <Text style={styles.voucherDescription}>{item.description || 'No Description'}</Text>
                        <Text style={styles.voucherQuantity}>{`Quantity: ${item.quantity}`}</Text>
                        <Text style={styles.voucherPrice}>{`Price: $${item.price}`}</Text>
                        <Text style={styles.voucherDiscount}>{`Discount: ${item.discount}%`}</Text>
                        <Text style={styles.voucherDiscount}>
                            {`Discounted price: $${((item.price * (100 - item.discount)) / 100).toFixed(2)}`}
                        </Text>
                        <Text style={styles.expirationDate}>
                            {`Expiry Date: ${item.expirationDate ? new Date(item.expirationDate).toLocaleDateString() : 'N/A'}`}
                        </Text>

                        {item.redeemed === "pending" ? (
                            <Text style={styles.redeemedText}>Pending</Text>
                        ) : item.redeemed === "yes" ? (
                            <TouchableOpacity
                                style={[styles.redeemButton]}
                                onPress={() => handleRedeem(item)}
                            >
                                <Text style={styles.redeemButtonText}>Redeem</Text>
                            </TouchableOpacity>
                        ) : item.redeemed === "no" ? (
                            <View style={styles.rejectedContainer}>
                                <Text style={styles.redeemedText}>Voucher Rejected</Text>
                                <View>
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => handleCrossButtonClick(item)}
                                    >
                                        <Text style={styles.closeButtonText}>X</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
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



    // Loading state
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
                {error && <Text style={styles.errorText}>{error}</Text>}
                {vouchers.length === 0 ? (
                    <Text style={styles.emptyInventoryText}>No vouchers in inventory</Text>
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

// Styles
const styles = StyleSheet.create({
    closeButton: {
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red', // or any color you prefer
        padding: 5,
        borderRadius: 5,
        width: 30, // Adjust as needed
        height: 30, // Adjust as needed
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    rejectedContainer: {
        marginTop: 10,
        alignItems: 'center', // Center the text and button
    },

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
    pendingText: {
        color: 'orange',
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
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
        width: '100%',
    },
    voucherContainer: {
        backgroundColor: Colors.white,
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.secondary,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
        width: 300,
        alignSelf: 'center',
    },
    voucherImage: {
        width: '100%',
        height: 180,
        borderRadius: 10,
        marginBottom: 10,
    },
    voucherName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    voucherDescription: {
        fontSize: 16,
        marginVertical: 5,
    },
    detailsContainer: {
        marginTop: 10,
    },
    voucherQuantity: {
        fontSize: 16,
        marginBottom: 5,
    },
    voucherPrice: {
        fontSize: 16,
        marginBottom: 5,
    },
    voucherDiscount: {
        fontSize: 16,
        marginBottom: 5,
    },
    expirationDate: {
        fontSize: 16,
        marginBottom: 5,
    },
    redeemButton: {
        backgroundColor: Colors.green,
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
        alignItems: 'center',
    },
    redeemButtonText: {
        color: Colors.white,
        fontWeight: 'bold',
    },
    redeemedText: {
        color: 'gray',
        fontStyle: 'italic',
        marginTop: 10,
    },
    disabledButton: {
        backgroundColor: 'lightgray',
    },
});

export default ViewVoucherInventory;

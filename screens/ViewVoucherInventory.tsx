import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getCustomerVouchers } from '../api/voucherApi'; // Ensure this path is correct
import { useNavigation } from '@react-navigation/native'; // Import for navigation
import { IP_ADDRESS } from '@env';
import Config from 'react-native-config';

// Define the Voucher interface based on what the API returns
interface Voucher {
    listing_id: number;
    name: string;
    description: string;
    price: number; // Change price to number
    discount: number;
    voucherImage?: string;
    created_at: Date;
    updated_at: Date;
    redeemed: boolean;
    expirationDate?: string; // Ensure this is present as a string
}

// Define the response interface
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
        // Toggle the expanded state of the clicked voucher
        setExpandedVoucher(expandedVoucher === listing_id ? null : listing_id);
    };

    const handleRedeem = (voucher: Voucher) => {
        // Add your redeem logic here, e.g., API call to redeem the voucher
        console.log(`Redeeming voucher: ${voucher.listing_id}`);
    };


    const renderVoucher = ({ item, index }: { item: Voucher; index: number }) => {
        const price = typeof item.price === 'number' ? item.price : 0; // Default to 0 if undefined
        const discount = typeof item.discount === 'number' ? item.discount : 0; // Default to 0 if undefined
        const isExpanded = expandedVoucher === item.listing_id; // Check if this voucher is expanded
        console.log("config.api_url", Config.API_URL);
        console.log(item.voucherImage)
        return (
            <TouchableOpacity onPress={() => handleVoucherClick(item.listing_id)} style={styles.voucherContainer}>


                {item.voucherImage && (
                    <Image source={{ uri: `${IP_ADDRESS}${item.voucherImage}` }} style={styles.voucherImage} />
                    //<Image source={{ uri: `http://192.168.1.115:8080/${item.voucherImage}` }} style={styles.voucherImage} />
                )}
                <Text style={styles.voucherName}>{`Voucher ${index + 1}: ${item.name || 'No Name'}`}</Text>
                {isExpanded && (
                    <View style={styles.detailsContainer}>
                        <Text style={styles.voucherDescription}>{item.description || 'No Description'}</Text>
                        <Text style={styles.voucherPrice}>Price: ${price.toFixed(2)}</Text>
                        <Text style={styles.voucherDiscount}>Discount: {discount.toFixed(2)}%</Text>
                        {item.redeemed ? (
                            <Text style={styles.redeemedText}>Redeemed</Text>
                        ) : (
                            <View style={styles.redeemContainer}>
                                <TouchableOpacity style={styles.redeemButton} onPress={() => handleRedeem(item)}>
                                    <Text style={styles.redeemButtonText}>Redeem</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        {item.expirationDate && (
                            <Text style={styles.expirationDate}>Expiry Date: {new Date(item.expirationDate).toLocaleDateString()}</Text>
                        )}
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Inventory of Purchased Vouchers</Text>
            </View>
            <FlatList
                data={vouchers}
                renderItem={renderVoucher}
                keyExtractor={item => item.listing_id.toString()}
                contentContainerStyle={styles.listContainer}
            />
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9', // Light background for elegance
        marginTop: 50, // Add margin to the top to lower the container
    },
    header: {
        backgroundColor: '#4CAF50', // Header background color
        padding: 15,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff', // White text for contrast
    },

    redeemContainer: {
        flexDirection: 'row', // Align items in a row
        justifyContent: 'flex-end', // Push button to the right
        marginTop: 10, // Add some space above the button
    },
    redeemButton: {
        paddingVertical: 5, // Smaller vertical padding
        paddingHorizontal: 10, // Smaller horizontal padding
        backgroundColor: '#FFD700', // Yellow background
        borderRadius: 5, // Rounded corners
        alignItems: 'center', // Center text horizontally
        justifyContent: 'center', // Center text vertically
    },
    redeemButtonText: {
        color: '#000', // Black text for contrast
        fontWeight: 'bold',
        fontSize: 12, // Smaller font size
    },

    backButton: {
        padding: 15,
        backgroundColor: '#4CAF50', // Green background for the button
        borderRadius: 0, // No border radius for a straight edge
        width: '100%', // Full width to match the phone's width
        alignItems: 'center', // Center text horizontally
        justifyContent: 'center', // Center text vertically
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
        elevation: 3, // Elevation for Android
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
        color: '#555', // Slightly darker text for description
    },
    voucherPrice: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    voucherDiscount: {
        fontSize: 14,
        color: '#888', // Grey for discount
    },
    expirationDate: {
        fontSize: 14,
        color: '#888', // Grey for expiration date
    },
    redeemedText: {
        color: 'green',
        fontWeight: 'bold',
    },
});

export default ViewVoucherInventory;

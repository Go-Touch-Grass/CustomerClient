import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { finalizeGroupPurchase, GroupPurchaseStatus } from '../api/voucherApi';
import ProtectedRoute from '../components/ProtectedRoute';
import { socialStyles } from '../styles/SocialStyles';
import { Ionicons } from '@expo/vector-icons';

// Define the type for route params
interface GroupPurchaseRouteParams {
    groupPurchaseId: string; // Expect groupPurchaseId as a string
}

const GroupPurchase = () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<{ params: GroupPurchaseRouteParams }, 'params'>>(); // Access route params
    // Check if groupPurchaseId is passed from navigation
    const initialGroupPurchaseId = route.params?.groupPurchaseId || '';

    // State to store group purchase status, loading state, and group ID input
    const [groupStatus, setGroupStatus] = useState<any>(null);
    const [groupPurchaseId, setGroupPurchaseId] = useState<string>(initialGroupPurchaseId); // Add input field for group ID
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // If groupPurchaseId is passed directly, fetch status automatically
        // console.log("grouppurchaseId is", groupPurchaseId)
        if (groupPurchaseId) {
            fetchGroupStatus();
        }
    }, [groupPurchaseId]);

    // Function to fetch group purchase status by ID
    const fetchGroupStatus = async () => {
        setLoading(true);
        setError(null); // Clear any previous errors
        try {
            const response = await GroupPurchaseStatus(groupPurchaseId);
            // Ensure that the response contains text-friendly data
            setGroupStatus(response);
        } catch (err) {
            console.error("Error fetching group status:", err);
            setError('Error fetching group purchase status. Please check the ID.');
        } finally {
            setLoading(false);
        }
    };

    const handleCompletePurchase = async () => {

        try {
            const response = await finalizeGroupPurchase(groupPurchaseId);
            console.log("Purchase finalized:", response.data);
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error completing purchase:", error.message);
            } else {
                console.error("Error completing purchase:", error);
            }
        }

    };

    const isGroupComplete = groupStatus && groupStatus.current_size >= groupStatus.group_size;

    return (
        <View style={styles.container}>
            <TouchableOpacity style={socialStyles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" style={socialStyles.backIcon} />
            </TouchableOpacity>
            <Text style={styles.headerText}>Group Purchase Status</Text>

            {/* If no groupPurchaseId was passed, show the input field */}
            {!initialGroupPurchaseId && (
                <>
                    <Text style={styles.label}>Enter Group ID to Check Status:</Text>
                    <TextInput
                        value={groupPurchaseId}
                        onChangeText={setGroupPurchaseId}
                        style={styles.input}
                        placeholder="Enter Group ID"
                        keyboardType="numeric"
                    />
                    <TouchableOpacity onPress={fetchGroupStatus} style={styles.checkButton}>
                        <Text style={styles.buttonText}>Check Status</Text>
                    </TouchableOpacity>
                </>
            )}

            {loading && <ActivityIndicator size="large" color="#0000ff" />}

            {error && <Text style={styles.error}>{error}</Text>}

            {groupStatus && (
                <>
                    <Text style={styles.infoText}>
                        Group Progress: {groupStatus.current_size}/{groupStatus.group_size}
                    </Text>

                    {isGroupComplete ? (
                        <TouchableOpacity onPress={handleCompletePurchase} style={styles.completeButton}>
                            <Text style={styles.buttonText}>Complete Purchase</Text>
                        </TouchableOpacity>
                    ) : (
                        <>
                            <Text style={styles.infoText}>
                                Send this Group Purchase ID <Text style={styles.boldText}>"{groupPurchaseId}"</Text> to your friend.
                            </Text>
                            <Text style={styles.infoText}>Waiting for more people to join...</Text>
                        </>
                    )}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    infoText: {
        fontSize: 16,
        marginBottom: 10,
    },
    completeButton: {
        backgroundColor: 'green',
        padding: 15,
        borderRadius: 5,
    },
    checkButton: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20,
        width: '80%',
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    boldText: {
        fontWeight: 'bold',
    },
});

export default ProtectedRoute(GroupPurchase);

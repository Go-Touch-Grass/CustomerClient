import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { finalizeGroupPurchase, getAllCreatedGroups, getAllJoinedGroups, GroupPurchaseStatus } from '../api/voucherApi';
import ProtectedRoute from '../components/ProtectedRoute';
import { socialStyles } from '../styles/SocialStyles';
import { Ionicons } from '@expo/vector-icons';
import { awardXP, XP_REWARDS, showXPAlert } from '../utils/xpRewards';

// Define the type for route params
interface GroupPurchaseRouteParams {
    groupPurchaseId: string; // Expect groupPurchaseId as a string
}

interface GroupPurchase {
    id: string;
    voucher: {
        name: string;
    };
    groupStatus: string;
    current_size: number;
    group_size: number;
    paymentStatus: string;
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
    const [createdGroups, setCreatedGroups] = useState<GroupPurchase[]>([]);
    const [joinedGroups, setJoinedGroups] = useState<GroupPurchase[]>([]);

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
            setGroupStatus(response);

            const createdResponse = await getAllCreatedGroups();
            const joinedResponse = await getAllJoinedGroups();
            setCreatedGroups(createdResponse.groupPurchases);
            setJoinedGroups(joinedResponse.joinedGroupPurchases);

        } catch (err) {
            console.error("Error fetching group status:", err);
            setError('Error fetching group purchase status. Please check the ID.');
        } finally {
            setLoading(false);
        }
    };

    const handleCompletePurchase = async () => {
        setError(null);
        setLoading(true);

        try {
            const response = await finalizeGroupPurchase(groupPurchaseId);
            const xpResult = await awardXP(XP_REWARDS.GROUP_PURCHASE_CREATE);
            showXPAlert(xpResult);
            fetchGroupStatus();
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                if (error.response.data.insufficientParticipants) {
                    const insufficientParticipants = error.response.data.insufficientParticipants;
                    const participantsMessage = insufficientParticipants
                        .map((participant: { username: string; balance: number }) => 
                            `Username: ${participant.username}, Balance: ${participant.balance}`
                        )
                        .join("\n");
                    setError(`Some participants have insufficient gems. Please top up:\n${participantsMessage}`);
                } else {
                    setError(error.response.data.message || "Error completing purchase.");
                }
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleJoinPurchase = async () => {
        try {
            await joinGroupPurchase(groupPurchaseId);
            const xpResult = await awardXP(XP_REWARDS.GROUP_PURCHASE_JOIN);
            showXPAlert(xpResult);
            fetchGroupStatus();
        } catch (error) {
            // ... error handling ...
        }
    };

    const isGroupComplete = groupStatus && groupStatus.current_size >= groupStatus.group_size;
    // Check if all participants have paid
    const isPaymentCompleted = groupStatus && groupStatus.participants.every((participant: any) => participant.payment_status === 'paid');

    // Render a single group item
    const renderGroupItem = (group: GroupPurchase) => (
        <View style={styles.groupItem}>
            <Text style={styles.infoText}>Group ID: {group.id}</Text>
            <Text style={styles.infoText}>Voucher: {group.voucher.name}</Text>
            <Text style={styles.infoText}>Status: {group.groupStatus}</Text>
            <Text style={styles.infoText}>Participants: {group.current_size}/{group.group_size}</Text>
            <Text style={styles.infoText}>Payment Status: {group.paymentStatus}</Text>
        </View>
    );

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

                    {isPaymentCompleted ? (
                        <View>
                            <Text style={styles.infoText}>Payment has been completed!</Text>
                            <Text style={styles.infoText}>Voucher: {groupStatus.voucher.name}</Text>

                            {/* Add more details as needed */}
                        </View>
                    ) : (
                        <>
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
                </>
            )}

            <Text style={styles.sectionHeader}>Created Groups</Text>
            <FlatList
                data={createdGroups}
                renderItem={({ item }) => renderGroupItem(item)}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={<Text style={styles.infoText}>No created groups found.</Text>}
            />

            <Text style={styles.sectionHeader}>Joined Groups</Text>
            <FlatList
                data={joinedGroups}
                renderItem={({ item }) => renderGroupItem(item)}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={<Text style={styles.infoText}>No joined groups found.</Text>}
            />
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
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    groupItem: {
        padding: 15,
        backgroundColor: '#f0f0f0',
        marginBottom: 10,
        borderRadius: 5,
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

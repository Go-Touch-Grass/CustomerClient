import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, Alert, Share } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { finalizeGroupPurchase, getAllCreatedGroups, getAllJoinedGroups, GroupPurchaseStatus } from '../api/voucherApi';
import ProtectedRoute from '../components/ProtectedRoute';
import { socialStyles } from '../styles/SocialStyles';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { awardXP, XP_REWARDS, showXPAlert } from '../utils/xpRewards';
import { IP_ADDRESS } from '@env';

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
    const [viewMode, setViewMode] = useState<'created' | 'joined'>('created'); // State to toggle between views

    useEffect(() => {
        // If groupPurchaseId is passed directly, fetch status automatically
        // console.log("grouppurchaseId is", groupPurchaseId)
        if (groupPurchaseId) {
            fetchGroupStatus();
        }
        fetchCreatedAndJoinedGroups();

    }, [groupPurchaseId]);

    // Function to fetch group purchase status by ID
    const fetchGroupStatus = async () => {
        setLoading(true);
        setError(null); // Clear any previous errors
        try {
            const response = await GroupPurchaseStatus(groupPurchaseId);
            setGroupStatus(response);

            /*
            const createdResponse = await getAllCreatedGroups();
            const joinedResponse = await getAllJoinedGroups();
            setCreatedGroups(createdResponse.groupPurchases);
            setJoinedGroups(joinedResponse.joinedGroupPurchases);
            */

        } catch (err) {
            console.error("Error fetching group status:", err);
            setError('Error fetching group purchase status. Please check the ID.');
        } finally {
            setLoading(false);
        }
    };

    const fetchCreatedAndJoinedGroups = async () => {
        try {
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
            //await joinGroupPurchase(groupPurchaseId);
            // xp called in JoinGroupPurchase.tsx
            //const xpResult = await awardXP(XP_REWARDS.GROUP_PURCHASE_JOIN);
            //showXPAlert(xpResult);
            fetchGroupStatus();
        } catch (error) {
            // ... error handling ...
        }
    };

    const isGroupComplete = groupStatus && groupStatus.current_size >= groupStatus.group_size;
    // Check if all participants have paid
    const isPaymentCompleted = groupStatus && groupStatus.participants.every((participant: any) => participant.payment_status === 'paid');

    // Render a single group item
    const renderGroupItem = (group: GroupPurchase) => {
        const isGroupFull = group.current_size >= group.group_size; // Check if the group is full
        return (
            <View style={[styles.groupItem, styles.shadow]}>
                <View style={styles.groupHeader}>
                    <Text style={styles.groupTitle}>{group.voucher.name}</Text>
                    <MaterialIcons name="groups" size={24} color="#4caf50" />
                </View>
                <Text style={styles.infoText}>Group Number: {group.id}</Text>

                {/* Display group status with color and icon */}
                <View style={styles.statusContainer}>
                    <Text style={[styles.groupStatus, isGroupFull ? styles.fullStatus : styles.notFullStatus]}>
                        {isGroupFull ? 'Full' : 'Not Full'}
                    </Text>
                    <Ionicons
                        name={isGroupFull ? 'checkmark-circle' : 'ellipse-outline'}
                        size={18}
                        color={isGroupFull ? '#4caf50' : '#ff9800'}
                        style={{ marginLeft: 5 }}
                    />
                </View>

                <View style={styles.statusContainer}>
                    {/* 
                    <Text style={[styles.groupStatus, group.groupStatus === 'completed' ? styles.completedStatus : styles.pendingStatus]}>
                        {group.groupStatus.toUpperCase()}
                    </Text>
                    */}
                    <Text style={[styles.paymentStatus, group.paymentStatus === 'completed' ? styles.completedPayment : styles.pendingPayment]}>
                        Payment: {group.paymentStatus.toUpperCase()}
                    </Text>
                </View>
                <View style={styles.progressContainer}>
                    <Text style={styles.infoText}>{group.current_size}/{group.group_size} participants</Text>
                </View>
            </View>
        );
    };

    const handleShare = async (groupPurchaseID: String) => {
        const expoGoLink = `exp://${IP_ADDRESS}:8081`;

        try {
            const result = await Share.share({
                message: `Join my group purchase group with this number "${groupPurchaseID}". \nOpen the app here:${expoGoLink}`,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log('Shared with activity type: ', result.activityType);
                } else {
                    console.log('Shared');
                }
            } else if (result.action === Share.dismissedAction) {
                console.log('Dismissed');
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred.');
            }
        }
    };


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
                                        Send this Group Number <Text style={styles.boldText}>"{groupPurchaseId}"</Text> to your friend.
                                    </Text>
                                    <TouchableOpacity onPress={() => handleShare(groupPurchaseId)} style={styles.shareButton} >
                                        <View style={styles.shareContent}>
                                            <Text style={styles.shareText}>Share</Text>
                                            <Ionicons name="share-social" size={20} color="#000" />
                                        </View>
                                    </TouchableOpacity>

                                    <Text style={styles.infoText}>Waiting for more people to join...</Text>
                                </>
                            )}
                        </>
                    )}
                </>
            )}

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.toggleButton, viewMode === 'created' && styles.activeButton]}
                    onPress={() => setViewMode('created')}
                >
                    <Text style={[styles.buttonText, { color: viewMode === 'created' ? '#fff' : '#000' }]}>
                        Created Groups
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleButton, viewMode === 'joined' && styles.activeButton]}
                    onPress={() => setViewMode('joined')}
                >
                    <Text style={[styles.buttonText, { color: viewMode === 'joined' ? '#fff' : '#000' }]}>
                        Joined Groups
                    </Text>
                </TouchableOpacity>
            </View>

            {viewMode === 'created' && (
                <FlatList
                    data={createdGroups}
                    renderItem={({ item }) => renderGroupItem(item)}
                    keyExtractor={(item) => item.id.toString()}
                    ListEmptyComponent={<Text style={styles.infoText}>No created groups found.</Text>}
                />
            )}

            {viewMode === 'joined' && (
                <FlatList
                    data={joinedGroups}
                    renderItem={({ item }) => renderGroupItem(item)}
                    keyExtractor={(item) => item.id.toString()}
                    ListEmptyComponent={<Text style={styles.infoText}>No joined groups found.</Text>}
                />
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

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    toggleButton: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        marginHorizontal: 5,
        alignItems: 'center',
    },
    activeButton: {
        backgroundColor: '#007BFF',
    },

    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
    },
    groupHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    groupTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    groupStatus: {
        fontSize: 14,
        fontWeight: 'bold',
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    fullStatus: {
        //color: '#ffffff',
        //backgroundColor: '#4caf50', // Green background for "Full"
    },
    notFullStatus: {
        //color: '#ffffff',
        //backgroundColor: '#ff9800', // Orange background for "Not Full"
    },

    completedStatus: {
        color: '#ffffff',
        backgroundColor: '#4caf50',
    },
    pendingStatus: {
        color: '#ffffff',
        backgroundColor: '#ff9800',
    },
    paymentStatus: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    completedPayment: {
        color: '#4caf50',
    },
    pendingPayment: {
        color: '#ff9800',
    },
    progressContainer: {
        flexDirection: 'row',
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
    shareButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    shareContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    shareText: {
        textDecorationLine: 'underline',
        fontSize: 18,
        color: 'blue',
        marginLeft: 5, // space between icon and text

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

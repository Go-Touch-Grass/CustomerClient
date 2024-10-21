import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { GroupPurchaseStatus, joinGroupPurchase } from '../api/voucherApi';
import ProtectedRoute from '../components/ProtectedRoute';
import { socialStyles } from '../styles/SocialStyles';
import { getAllFriends } from '../api/socialApi';

interface GroupPurchaseRouteParams {
    groupPurchaseId: number;
}

const JoinGroupPurchase = () => {
    const navigation = useNavigation<StackNavigationProp<any>>();
    //const route = useRoute<RouteProp<{ params: GroupPurchaseRouteParams }, 'params'>>();
    //const { groupPurchaseId } = route.params;
    //const [groupPurchase, setGroupPurchase] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [groupPurchaseId, setGroupPurchaseId] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);


    /*
    // Fetch group purchase details by groupPurchaseId
    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                const response = await axios.get(`/auth/group-purchase/status/${groupPurchaseId}`);
                setGroupPurchase(response.data);
            } catch (error) {
                console.error("Error fetching group purchase details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGroupDetails();
    }, [groupPurchaseId]);
    */

    const handleJoinGroup = async () => {
        try {
            const friends = await getAllFriends();
            console.log("groupPurchaseId", groupPurchaseId);
            const grpPurchaseStatus = await GroupPurchaseStatus(groupPurchaseId.toString());
            // Ensure that the response contains text-friendly data
            //console.log("grpPurchaseStatus", grpPurchaseStatus);
            //console.log("groupStatus,creator", grpPurchaseStatus.creator_id);
            //console.log("friends", friends);
            //console.log("grpPurchaseStatus.customer.username", grpPurchaseStatus.username)
            const isFriend = friends.find((friend) => friend.username === grpPurchaseStatus.creator.username);
            if (!isFriend) {
                setError("You can only join the group purchase if you are a friend of the creator.");
                return;
            }

            console.log("Joining group purchase with ID:", groupPurchaseId);
            const response = await joinGroupPurchase(groupPurchaseId.toString());
            //const response = await axios.post(`/auth/group-purchase/join`, { group_purchase_id: groupPurchaseId });
            console.log("Successfully joined the group purchase:", response.data);
            // Redirect to group status page after joining
            navigation.navigate('GroupPurchase', { groupPurchase: response.data });
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error joining the group:", error.message);
            } else {
                console.error("Error joining the group:", String(error));
            }
            setError(error instanceof Error ? error.message : String(error));
            //alert(error.response?.data.message || "Error joining the group purchase.");
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={socialStyles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" style={socialStyles.backIcon} />
            </TouchableOpacity>
            <Text style={styles.headerText}>Join Group Purchase</Text>
            <Text style={styles.label}>Enter Group ID to Join:</Text>
            <TextInput
                value={groupPurchaseId.toString()}
                onChangeText={(text) => setGroupPurchaseId(Number(text))}
                style={styles.input}
                //placeholder="Enter Group ID"
                keyboardType="numeric"
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <Button title={loading ? 'Joining...' : 'Join Group'} onPress={handleJoinGroup} disabled={loading} />
            {/* Display group purchase details 
            {groupPurchase ? (
                <>
                    <Text style={styles.infoText}>Group Purchase for Voucher: {groupPurchase.voucher.name}</Text>
                    <Text style={styles.infoText}>
                        Progress: {groupPurchase.current_size}/{groupPurchase.group_size}
                    </Text>

                    <TouchableOpacity onPress={handleJoinGroup} style={styles.joinButton}>
                        <Text style={styles.buttonText}>Join Group</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <Text style={styles.infoText}>Group purchase not found.</Text>
            )}
             */}
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
    joinButton: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 5,
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
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
});

export default ProtectedRoute(JoinGroupPurchase);

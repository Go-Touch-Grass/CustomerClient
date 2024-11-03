import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { StyledContainer, InnerContainer, PageTitle, Colors } from '../styles/commonStyles';
import { socialStyles } from '../styles/SocialStyles';
import ProtectedRoute from '../components/ProtectedRoute';

import {
  getAllFriends,
  getAllFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  sendFriendRequest,
} from '../api/socialApi';

import { awardXP, XP_REWARDS, showXPAlert } from '../utils/xpRewards';

interface Friend {
  id: string;
  username: string;
  fullName: string;
}

const Friends: React.FC = () => {
  // const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<Friend[]>([]);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [showFriendRequestsModal, setShowFriendRequestsModal] = useState(false);
  const [friendUsername, setFriendUsername] = useState('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchFriendsData();
  }, []);

  const fetchFriendsData = async () => {
    try {
      const [friendsData, requestsData] = await Promise.all([getAllFriends(), getAllFriendRequests()]);
      setFriends(friendsData);
      setFriendRequests(requestsData);
      setError('');
    } catch (error) {
      console.error('Error fetching friends data:', error);
      setError('Failed to fetch friends data');
    }
  };

  const showSuccessAlert = (message: string) => {
    Alert.alert('Success', message);
  };

  const handleAddFriend = async () => {
    try {
      await sendFriendRequest(friendUsername);
      setFriendUsername('');
      setShowAddFriendModal(false);
      fetchFriendsData();
      setError('');
      showSuccessAlert('Friend request sent');
      const xpResult = await awardXP(XP_REWARDS.ADD_FRIEND);
      showXPAlert(xpResult);
    } catch (error) {
      console.error('Error sending friend request:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const handleAcceptFriendRequest = async (friendId: string) => {
    try {
      await acceptFriendRequest(friendId);
      const xpResult = await awardXP(XP_REWARDS.ACCEPT_FRIEND);
      showXPAlert(xpResult);
      setError('');
      await fetchFriendsData();
      if (friendRequests.length === 1) {
        setShowFriendRequestsModal(false);
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
      setError('Failed to accept friend request');
    }
  };

  const handleRejectFriendRequest = async (friendId: string) => {
    try {
      await rejectFriendRequest(friendId);
      setError('');
      await fetchFriendsData();
      if (friendRequests.length === 1) {
        setShowFriendRequestsModal(false);
      }
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      setError('Failed to reject friend request');
    }
  };

  const handleRemoveFriend = async (friendId: string, fullName: string, username: string) => {
    Alert.alert(
      'Remove Friend',
      `Are you sure you want to remove ${fullName} from your friends list?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeFriend(friendId);
              setError('');
              fetchFriendsData();
              showSuccessAlert(`${fullName} has been removed from your friends list`);
            } catch (error) {
              console.error('Error removing friend:', error);
              setError('Failed to remove friend');
            }
          }
        }
      ]
    );
  };

  const renderFriendItem = ({ item }: { item: Friend }) => (
    <View style={socialStyles.listItem}>
      <Text style={socialStyles.listItemText}>
        {item.fullName} (@{item.username})
      </Text>
      <TouchableOpacity
        style={socialStyles.removeButton}
        onPress={() => handleRemoveFriend(item.id, item.fullName, item.username)}
      >
        <Ionicons name="close" size={24} color={Colors.red} />
      </TouchableOpacity>
    </View>
  );

  const renderFriendRequestItem = ({ item }: { item: Friend }) => (
    <View style={socialStyles.listItem}>
      <Text style={socialStyles.listItemText}>
        {item.fullName} (@{item.username})
      </Text>
      <View style={socialStyles.iconButtonContainer}>
        <TouchableOpacity
          style={socialStyles.iconButton}
          onPress={() => handleAcceptFriendRequest(item.id)}
        >
          <Ionicons name="checkmark" size={24} color={Colors.green} />
        </TouchableOpacity>
        <TouchableOpacity
          style={socialStyles.iconButton}
          onPress={() => handleRejectFriendRequest(item.id)}
        >
          <Ionicons name="close" size={24} color={Colors.red} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <StyledContainer>
      <TouchableOpacity style={socialStyles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" style={socialStyles.backIcon} />
      </TouchableOpacity>
      <InnerContainer>
        <PageTitle>Friends</PageTitle>

        {error ? <Text style={socialStyles.errorText}>{error}</Text> : null}

        <View style={socialStyles.buttonRow}>
          <TouchableOpacity
            style={[socialStyles.button, socialStyles.primaryButton, socialStyles.addFriendButton]}
            onPress={() => setShowAddFriendModal(true)}
          >
            <Text style={[socialStyles.buttonText, socialStyles.primaryButtonText]}>Add Friend</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[socialStyles.button, socialStyles.friendRequestsButton]}
            onPress={() => setShowFriendRequestsModal(true)}
          >
            <Text style={socialStyles.buttonText}>Friend Requests</Text>
            {friendRequests.length > 0 && (
              <View style={socialStyles.badgeContainer}>
                <Text style={socialStyles.badgeText}>{friendRequests.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={socialStyles.section}>
          <Text style={socialStyles.sectionTitle}>Friends</Text>
          <FlatList
            data={friends}
            renderItem={renderFriendItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text style={socialStyles.emptyText}>You have no friends yet :( </Text>}
          />
        </View>

        <Modal
          visible={showAddFriendModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowAddFriendModal(false)}
        >
          <View style={socialStyles.modalContainer}>
            <View style={socialStyles.modalContent}>
              <Text style={socialStyles.modalTitle}>Add Friend</Text>
              <TextInput
                style={socialStyles.input}
                placeholder="Enter username"
                placeholderTextColor={Colors.tertiary + '80'}
                value={friendUsername}
                onChangeText={(text) => {
                  setFriendUsername(text);
                  setError('');
                }}
              />
              {error ? <Text style={socialStyles.errorText}>{error}</Text> : null}
              <TouchableOpacity
                style={[socialStyles.button, socialStyles.primaryButton, socialStyles.fullWidthButton, socialStyles.modalButton]}
                onPress={handleAddFriend}
              >
                <Text style={[socialStyles.buttonText, socialStyles.primaryButtonText]}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[socialStyles.button, socialStyles.fullWidthButton, socialStyles.modalButton]}
                onPress={() => {
                  setShowAddFriendModal(false);
                  setError('');
                }}
              >
                <Text style={socialStyles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showFriendRequestsModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowFriendRequestsModal(false)}
        >
          <View style={socialStyles.modalContainer}>
            <View style={socialStyles.modalContent}>
              <Text style={socialStyles.modalTitle}>Friend Requests</Text>
              <FlatList
                data={friendRequests}
                renderItem={renderFriendRequestItem}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text style={socialStyles.emptyText}>No friend requests :'( </Text>}
              />
              <TouchableOpacity
                style={[socialStyles.button, socialStyles.fullWidthButton, socialStyles.modalButton]}
                onPress={() => setShowFriendRequestsModal(false)}
              >
                <Text style={socialStyles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </InnerContainer>
    </StyledContainer>
  );
};

export default ProtectedRoute(Friends);

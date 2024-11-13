import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { StyledContainer, InnerContainer, PageTitle } from '../styles/commonStyles';
import { socialStyles } from '../styles/SocialStyles';
import ProtectedRoute from '../components/ProtectedRoute';
import { Colors } from '../styles/commonStyles';
import * as Clipboard from 'expo-clipboard';

import {
	getAllFriends,
	getLeaderboard,
} from '../api/socialApi';
import { getUserInfo } from '../api/userApi';
import { useFocusEffect } from '@react-navigation/native';

interface Friend {
	id: string;
	username: string;
	fullName: string;
}

interface LeaderboardEntry {
	id: string;
	username: string;
	exp: number;

}

const Social: React.FC = () => {
	const navigation = useNavigation<StackNavigationProp<any>>();
	const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
	const [showFriendsOnly, setShowFriendsOnly] = useState(true);
	const [friends, setFriends] = useState<Friend[]>([]);
	const [currentUser, setCurrentUser] = useState<{ id: string; username: string; referralCode: string; codeUsed: number } | null>(null);

	useFocusEffect(
		useCallback(() => {
			fetchSocialData();
		}, [])
	);

	const fetchSocialData = async () => {
		try {
			const [leaderboardData, friendsData, userInfo] = await Promise.all([
				getLeaderboard(),
				getAllFriends(),
				getUserInfo(),
			]);
			setLeaderboard(leaderboardData);
			setFriends(friendsData);
			setCurrentUser({ id: userInfo.id, username: userInfo.username, referralCode: userInfo.referral_code, codeUsed: userInfo.code_used });
		} catch (error) {
			console.error('Error fetching social data:', error);
			Alert.alert('Error', 'Failed to fetch social data');
		}
	};

	const filteredLeaderboard = showFriendsOnly
		? leaderboard.filter((entry) =>
			friends.some((friend) => friend.id === entry.id) || entry.id === currentUser?.id
		)
		: leaderboard;

	const renderLeaderboardItem = ({ item, index }: { item: LeaderboardEntry; index: number }) => (
		<View style={[
			socialStyles.listItem,
			socialStyles.leaderboardItem,
			item.id === currentUser?.id && socialStyles.currentUserItem
		]}>
			<Text style={socialStyles.listItemText}>
				{index + 1}. {item.username} {item.id === currentUser?.id ? '(You)' : ''}
			</Text>
			<Text style={socialStyles.listItemText}>{item.exp} XP</Text>
		</View>
	);

	const copyToClipboard = async () => {
		if(currentUser){
			await Clipboard.setStringAsync(currentUser.referralCode);
			Alert.alert('Copied!', 'Referral code copied to clipboard.');
		}
		
	  };

	return (
		<StyledContainer>
			<TouchableOpacity style={socialStyles.backButton} onPress={() => navigation.goBack()}>
				<Ionicons name="arrow-back" style={socialStyles.backIcon} />
			</TouchableOpacity>
			<InnerContainer>
				<PageTitle>Leaderboard</PageTitle>

				<TouchableOpacity style={socialStyles.friendsButton} onPress={() => navigation.navigate('Friends')}>
					<Text style={socialStyles.friendsButtonText}>Friends</Text>
				</TouchableOpacity>

				<View style={socialStyles.section}>
					<View style={socialStyles.referralCode}>
				<Text style={socialStyles.referralCodeTitle}>INVITE & EARN 🎉 </Text>
				<Text style={socialStyles.referralCodeText}>When your friend signs up using your code, you BOTH earn 50 gems!</Text>
				<Text style={socialStyles.referralCodeText}>Your referral code: {currentUser?.referralCode} 
					<TouchableOpacity onPress={copyToClipboard}>
						<Ionicons name="copy-outline" style={socialStyles.referralCodeIcon} />
      				</TouchableOpacity>
				</Text>
				<Text style={socialStyles.referralCodeText}>You have invited a total of: {currentUser?.codeUsed} friends 👭</Text>
				
				</View>
					<View style={socialStyles.leaderboardHeader}>
					
						<Text style={socialStyles.sectionTitle}>Leaderboard</Text>
						<View style={socialStyles.toggleContainer}>
							<Text style={socialStyles.toggleLabel}>Show Friends Only</Text>
							<Switch
								value={showFriendsOnly}
								onValueChange={setShowFriendsOnly}
								trackColor={{ false: Colors.lightGray, true: Colors.lightGreen }}
								thumbColor={showFriendsOnly ? Colors.green : Colors.gray}
							/>
						</View>
					</View>
					<FlatList
						data={filteredLeaderboard}
						renderItem={renderLeaderboardItem}
						keyExtractor={(item) => item.id}
						ListEmptyComponent={<Text style={socialStyles.emptyText}>No leaderboard data available</Text>}
						contentContainerStyle={{ width: '100%' }}
					/>
				</View>
			</InnerContainer>
		</StyledContainer>
	);
};

export default ProtectedRoute(Social);

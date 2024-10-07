import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { StyledContainer, InnerContainer, PageTitle } from '../styles/commonStyles';
import { socialStyles } from '../styles/SocialStyles';
import ProtectedRoute from '../components/ProtectedRoute';
import { useTranslation } from 'react-i18next';
import { Colors } from '../styles/commonStyles';

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
	const { t } = useTranslation();
	const navigation = useNavigation<StackNavigationProp<any>>();
	const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
	const [showFriendsOnly, setShowFriendsOnly] = useState(true);
	const [friends, setFriends] = useState<Friend[]>([]);
	const [currentUser, setCurrentUser] = useState<{ id: string; username: string } | null>(null);

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
			setCurrentUser({ id: userInfo.id, username: userInfo.username });
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

	return (
		<StyledContainer>
			<TouchableOpacity style={socialStyles.backButton} onPress={() => navigation.goBack()}>
				<Ionicons name="arrow-back" style={socialStyles.backIcon} />
			</TouchableOpacity>
			<InnerContainer>
				<PageTitle>{t('social')}</PageTitle>

				<TouchableOpacity style={socialStyles.friendsButton} onPress={() => navigation.navigate('Friends')}>
					<Text style={socialStyles.friendsButtonText}>{t('friends')}</Text>
				</TouchableOpacity>

				<View style={socialStyles.section}>
					<View style={socialStyles.leaderboardHeader}>
						<Text style={socialStyles.sectionTitle}>{t('leaderboard')}</Text>
						<View style={socialStyles.toggleContainer}>
							<Text style={socialStyles.toggleLabel}>{t('show-friends-only')}</Text>
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
						ListEmptyComponent={<Text style={socialStyles.emptyText}>{t('leaderboard-empty')}</Text>}
						contentContainerStyle={{ width: '100%' }} // Ensure the FlatList content is full width
					/>
				</View>
			</InnerContainer>
		</StyledContainer>
	);
};

export default ProtectedRoute(Social);

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons'; // Add this import
import { removeToken } from '../utils/asyncStorage';
import { getUserInfo, repairStreak } from '../api/userApi';
import { StyledContainer, InnerContainer, PageTitle } from '../styles/commonStyles';
import { profileStyles } from '../styles/ProfileStyles';
import ProtectedRoute from '../components/ProtectedRoute';
import { deleteAccount } from '../api/userApi';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome';

interface UserInfo {
  id: string;
  full_name: string;
  email: string;
  username: string;
  exp: number;
  current_level: number;
  xp_for_next_level: number;
  xp_progress: number;

  gem_balance: number;
  streakCount: number;  // Streak count
  lastCheckIn: Date | null; // Last check-in date
  streak: {
    maxStreakCount: number;
    // Add other streak-related properties if needed
  };
}

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [gemsRequired, setGemsRequired] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const info = await getUserInfo();
        console.log('Max Streak Count:', info); // Log the maxStreakCount
        setUserInfo(info);
      } catch (error) {
        console.error('Error fetching user info:', error);
        handleLogout();
      }
    };

    fetchUserInfo();

    const unsubscribe = navigation.addListener('focus', () => {
      fetchUserInfo();
    });

    return unsubscribe;
  }, [navigation]);

  const handleLogout = async () => {
    await removeToken();
    navigation.replace('Login');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { userInfo });
  };

  const handleDeleteAccount = async () => {
    Alert.alert('Delete Account', 'Are you sure you want to delete your account? This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteAccount();
            await removeToken();
            navigation.replace('Login');
          } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to delete account');
          }
        },
      },
    ]);
  };

  const navigateToStore = () => {
    navigation.navigate('Store');
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const handleRepairStreak = async () => {
    if (!userInfo) return;

    // Show confirmation prompt before attempting to repair streak
    Alert.alert(
      'Repair Streak',
      'Are you sure you want to use gems to restore your streak?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              const response = await repairStreak(userInfo.id); // Make sure this calls the right endpoint
              setUserInfo(prev => prev && { ...prev, gem_balance: response.gem_balance, streakCount: response.streakCount });
              setGemsRequired(response.gemsRequired);
              Alert.alert('Streak Restored', `Your streak has been restored (using ${response.gemsRequired} gems).`);
            } catch (error) {
              const errorMessage = error.response?.data?.error || 'Not enough gems to repair streak.';
              Alert.alert('Error', errorMessage);
            }
          },
        },
      ]
    );
  };



  // **Added**: Check if the streak is broken
  const isStreakBroken = userInfo && userInfo.streakCount <= 1;

  return (
    <StyledContainer>
      <TouchableOpacity style={profileStyles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" style={profileStyles.backIcon} />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <InnerContainer>
          <PageTitle>{t('profile')}</PageTitle>
          {userInfo && (
            <>
              <View style={profileStyles.infoContainer}>
                <Text style={profileStyles.infoText}>
                  <Text style={profileStyles.infoLabel}>{t('full-name')}: </Text>
                  {userInfo.fullName}
                </Text>
                <Text style={profileStyles.infoText}>
                  <Text style={profileStyles.infoLabel}>{t('email')}: </Text>
                  {userInfo.email}
                </Text>
                <Text style={profileStyles.infoText}>
                  <Text style={profileStyles.infoLabel}>{t('username')}: </Text>
                  {userInfo.username}
                </Text>
                {/* <Text style={profileStyles.infoText}>
                  <Text style={profileStyles.infoLabel}>{t('total-exp')}: </Text>
                  {userInfo.exp}
                </Text> */}
                <Text style={profileStyles.infoText}>
                  <Text style={profileStyles.infoLabel}>{t('level')}: </Text>
                  {userInfo.currentLevel}
                </Text>
                {/* <Text style={profileStyles.infoText}>
                  <Text style={profileStyles.infoLabel}>{t('exp-needed-for-next-level')}: </Text>
                  {userInfo.xpForNextLevel}
                </Text>
                <Text style={profileStyles.infoText}>
                  <Text style={profileStyles.infoLabel}>{t('exp-earned-in-current-level')}: </Text>
                  {userInfo.xpProgress}
                </Text> */}
                <Text style={profileStyles.infoText}>
                  <Text style={profileStyles.infoLabel}>Gem Balance: </Text>
                  {userInfo.gem_balance}
                </Text>

                {/* Streak Information */}
                <View style={profileStyles.streakContainer}>
                  <Text style={profileStyles.infoLabel}>{t('streak-count')}:</Text>
                  <View style={profileStyles.starsContainer}>
                    {[...Array(userInfo.streakCount)].map((_, index) => (
                      <Icon key={index} name="star" size={20} color="#FFD700" />
                    ))}
                  </View>
                </View>
                <Text style={profileStyles.infoText}>
                  <Text style={profileStyles.infoLabel}>{t('last-check-in')}: </Text>
                  {userInfo.lastCheckIn ? new Date(userInfo.lastCheckIn).toDateString() : t('never')}
                </Text>

                {/* Only show repair button if current streak is less than max streak */}
                {userInfo.streakCount < userInfo.streak.maxStreakCount && (
                  <TouchableOpacity
                    style={[
                      profileStyles.repairButton,
                      userInfo.streakCount >= userInfo.streak.maxStreakCount ? profileStyles.disabledButton : {}
                    ]}
                    onPress={handleRepairStreak}
                    disabled={userInfo.streakCount >= userInfo.streak.maxStreakCount}
                  >
                    <Text style={profileStyles.buttonText}>
                      Restore Streak to {userInfo.streak.maxStreakCount} Stars
                    </Text>
                  </TouchableOpacity>
                )}


              </View>
              <View style={profileStyles.progressContainer}>
                <Text style={profileStyles.progressText}>{t('level-progress')}</Text>
                <View style={profileStyles.progressBarContainer}>
                  <View
                    style={[
                      profileStyles.progressBar,
                      { width: `${(userInfo.xpProgress / userInfo.xpForNextLevel) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={profileStyles.progressText}>
                  {userInfo.xpProgress} / {userInfo.xpForNextLevel} XP
                </Text>
              </View>
            </>
          )}

          <TouchableOpacity style={profileStyles.button} onPress={navigateToStore}>
            <Text style={profileStyles.buttonText}>Store</Text>
          </TouchableOpacity>

          <TouchableOpacity style={profileStyles.button} onPress={handleEditProfile}>
            <Text style={profileStyles.buttonText}>{t('edit-profile')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={profileStyles.button} onPress={handleChangePassword}>
            <Text style={profileStyles.buttonText}>{t('change-password')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={profileStyles.logoutButton} onPress={handleLogout}>
            <Text style={profileStyles.buttonText}>{t('logout')}</Text>
          </TouchableOpacity>
        </InnerContainer>
      </ScrollView>
    </StyledContainer>
  );
};



export default ProtectedRoute(Profile);

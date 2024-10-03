import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons'; // Add this import
import { removeToken } from '../utils/asyncStorage';
import { getUserInfo } from '../api/userApi';
import { StyledContainer, InnerContainer, PageTitle } from '../styles/commonStyles';
import { profileStyles } from '../styles/ProfileStyles';
import ProtectedRoute from '../components/ProtectedRoute';
import { deleteAccount } from '../api/userApi';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

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
}

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const info = await getUserInfo();
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

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const navigateToStore = () => {
    navigation.navigate('Store');
  };

  console.log(userInfo);

  return (
    <StyledContainer>
      <TouchableOpacity style={profileStyles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" style={profileStyles.backIcon} />
      </TouchableOpacity>
      <InnerContainer>
        <PageTitle>{t('profile')}</PageTitle>
        {userInfo && (
          <>
            <View style={profileStyles.infoContainer}>
              <Text style={profileStyles.infoText}>
                {t('full-name')}: {userInfo.fullName}
              </Text>
              <Text style={profileStyles.infoText}>
                {t('email')}: {userInfo.email}
              </Text>
              <Text style={profileStyles.infoText}>
                {t('username')}: {userInfo.username}
              </Text>
              <Text style={profileStyles.infoText}>
                {t('total-exp')}: {userInfo.exp}
              </Text>
              <Text style={profileStyles.infoText}>
                {t('level')}: {userInfo.currentLevel}
              </Text>
              <Text style={profileStyles.infoText}>
                {t('exp-needed-for-next-level')}: {userInfo.xpForNextLevel}
              </Text>
              <Text style={profileStyles.infoText}>
                {t('exp-earned-in-current-level')} : {userInfo.xpProgress}
              </Text>
              <Text style={profileStyles.infoText}>Gem Balance : {userInfo.gem_balance}</Text>
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
    </StyledContainer>
  );
};

export default ProtectedRoute(Profile);

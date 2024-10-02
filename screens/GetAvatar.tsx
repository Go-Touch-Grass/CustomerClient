import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAvatarByCustomerId, AvatarInfo } from '../api/avatarApi';
import { getUserInfo } from '../api/userApi';
import { CreateAvatarStyles } from '../styles/CreateAvatarStyles';
import axiosInstance from '../api/authApi';
import { StackNavigationProp } from '@react-navigation/stack';
const GetAvatar = () => {
  const [avatar, setAvatar] = useState<AvatarInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [baseUrl, setBaseUrl] = useState('');
  const navigation = useNavigation<StackNavigationProp<any>>();

  useEffect(() => {
    fetchAvatarDetails();
    const url = axiosInstance.defaults.baseURL || '';
    setBaseUrl(url);
  }, []);

  const fetchAvatarDetails = async () => {
    try {
      const userInfo = await getUserInfo();
      const avatarDetails = await getAvatarByCustomerId(parseInt(userInfo.id));
      setAvatar(avatarDetails);
    } catch (error) {
      console.error('Error fetching avatar details:', error);
      Alert.alert('Error', 'Failed to fetch avatar details');
    } finally {
      setIsLoading(false);
    }
  };

  const renderAvatar = () => {
    if (!avatar) return null;

    return (
      <View style={CreateAvatarStyles.avatarContainer}>
        <Image source={require('../assets/sprites/avatar_base.png')} style={CreateAvatarStyles.avatar} />

        {avatar.hat && (
          <Image source={{ uri: avatar.hat.filepath}} style={CreateAvatarStyles.hat} />
        )}
        {avatar.shirt && (
          <Image source={{ uri: avatar.shirt.filepath }} style={CreateAvatarStyles.upperWear} />
        )}
        {avatar.bottom && (
          <Image source={{ uri: avatar.bottom.filepath} } style={CreateAvatarStyles.lowerWear} />
        )}
      </View>
    );
  };

  return (
    <View style={CreateAvatarStyles.container}>
      <Text style={CreateAvatarStyles.title}>Your Avatar</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#00AB41" />
      ) : (
        renderAvatar()
      )}

      <TouchableOpacity
        style={CreateAvatarStyles.finishButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={CreateAvatarStyles.finishButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GetAvatar;

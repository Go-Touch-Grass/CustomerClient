import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAvatarByCustomerId, AvatarInfo } from '../api/avatarApi';
import { getUserInfo } from '../api/userApi';
import { CreateAvatarStyles } from '../styles/CreateAvatarStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import AvatarRenderer from '../components/AvatarRenderer';

const GetAvatar = () => {
  const [avatar, setAvatar] = useState<AvatarInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation<StackNavigationProp<any>>();

  useEffect(() => {
    fetchAvatarDetails();
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

  return (
    <View style={CreateAvatarStyles.container}>
      <Text style={CreateAvatarStyles.title}>Your Avatar</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#00AB41" />
      ) : (
        <AvatarRenderer avatar={avatar} />
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

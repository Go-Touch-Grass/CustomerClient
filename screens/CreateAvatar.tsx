import React, { useEffect } from 'react';
import { View, Button, Text } from 'react-native';
import WebView from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { updateAvatarUrl, getUserId } from '../api/userApi';

const READY_PLAYER_ME_URL = 'https://readyplayer.me/avatar';

const CreateAvatar: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const handleAvatarUrl = async (url: string) => {
    const avatarUrl = url.split('?')[0];
    const userId = await getUserId();
  
    try {
      await updateAvatarUrl(userId, avatarUrl);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Failed to Create avatar:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: READY_PLAYER_ME_URL }}
        onNavigationStateChange={(navState) => {
          const { url } = navState;
          if (url.includes('https://readyplayer.me/avatar')) {
            handleAvatarUrl(url);
          }
        }}
      />
      <Button title="Finish" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

export default CreateAvatar;

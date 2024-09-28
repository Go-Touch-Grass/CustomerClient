import React from 'react';
import { View, Button } from 'react-native';
import WebView from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { updateAvatarUrl, getUserId } from '../api/userApi';

const EDIT_READY_PLAYER_ME_URL = 'https://readyplayer.me/avatar/editor';

const EditAvatar: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const handleAvatarUrl = async (url: string) => {
    const avatarUrl = url.split('?')[0];
    const userId = await getUserId(); 
  
    try {
      await updateAvatarUrl(userId, avatarUrl);
      navigation.navigate('Home');

    } catch (error) {
      console.error('Failed to update avatar:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: EDIT_READY_PLAYER_ME_URL }}
        onNavigationStateChange={(navState) => {
          const { url } = navState;
          if (url.includes('https://readyplayer.me/avatar')) {
            handleAvatarUrl(url);
          }
        }}
      />
      <Button title="Save Changes" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

export default EditAvatar;

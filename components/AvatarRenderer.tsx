import React from 'react';
import { View, Image } from 'react-native';
import { AvatarInfo } from '../api/avatarApi';
import { CreateAvatarStyles } from '../styles/CreateAvatarStyles';

interface AvatarRendererProps {
  avatar: AvatarInfo | null;
  style?: object;
}

const AvatarRenderer: React.FC<AvatarRendererProps> = ({ avatar, style }) => {
  if (!avatar) return null;

  return (
    <View style={[CreateAvatarStyles.avatarContainer, style]}>
      <Image source={require('../assets/sprites/avatar_base.png')} style={CreateAvatarStyles.avatar} />
      {avatar.hat && <Image source={{ uri: avatar.hat.filepath }} style={CreateAvatarStyles.hat} />}
      {avatar.shirt && <Image source={{ uri: avatar.shirt.filepath }} style={CreateAvatarStyles.upperWear} />}
      {avatar.bottom && <Image source={{ uri: avatar.bottom.filepath }} style={CreateAvatarStyles.lowerWear} />}
    </View>
  );
};

export default AvatarRenderer;

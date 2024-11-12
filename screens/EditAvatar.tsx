import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Text, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { PreventRemoveContext, useNavigation } from '@react-navigation/native';
import { getAvatarByCustomerId, getAvatarById, AvatarInfo, updateAvatar } from '../api/avatarApi'; // Adjust the import based on your project structure
import { CreateAvatarStyles } from '../styles/CreateAvatarStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import { getUserInfo } from '../api/userApi';
import { getItems, AvatarType, Item, ItemType } from '../api/avatarApi';
import { awardXP, XP_REWARDS, showXPAlert } from '../utils/xpRewards';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { Share } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const EditAvatar = () => {
  const avatarRef = useRef<View>(null); // ref for sharing of avatar image
  const [avatar, setAvatar] = useState<AvatarInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [items, setItems] = useState<Record<ItemType, Item[]>>({
    [ItemType.BASE]: [],
    [ItemType.HAT]: [],
    [ItemType.SHIRT]: [],
    [ItemType.BOTTOM]: [],
  });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customization, setCustomization] = useState<{
    [ItemType.HAT]: Item | null;
    [ItemType.SHIRT]: Item | null;
    [ItemType.BOTTOM]: Item | null;
  }>({
    [ItemType.HAT]: null,
    [ItemType.SHIRT]: null,
    [ItemType.BOTTOM]: null,
  });

  const navigation = useNavigation<StackNavigationProp<any>>();

  useEffect(() => {
    fetchAvatarDetails();
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const fetchedItems = await getItems();
      setItems(fetchedItems);
    } catch (error) {
      console.error('Error fetching items:', error);
      Alert.alert('Error', 'Failed to fetch items');
    }
  };

  const fetchAvatarDetails = async () => {
    const userInfo = await getUserInfo();
    const avatarDetails = await getAvatarByCustomerId(parseInt(userInfo.id)); // Get avatarId from route parameters
    if (avatarDetails === undefined) {
      Alert.alert('Error', 'Avatar ID is missing');
      setIsLoading(false);
      return;
    }
    try {
      setAvatar(avatarDetails);
    } catch (error) {
      console.error('Error fetching avatar details:', error);
      Alert.alert('Error', 'Failed to fetch avatar details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAvatar = async () => {
    if (!avatar) return;

    setIsSaving(true);
    try {
      const updatedInfo = {
        hatId: avatar.hat?.id ?? null,
        shirtId: avatar.shirt?.id ?? null,
        bottomId: avatar.bottom?.id ?? null,
      };

      await updateAvatar(avatar.id, updatedInfo);
      const xpResult = await awardXP(XP_REWARDS.UPDATE_AVATAR);
      showXPAlert(xpResult);
      navigation.replace('Home');
    } catch (error) {
      console.error('Error updating avatar:', error);
      Alert.alert('Error', 'Failed to update avatar');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectItem = (item: Item) => {
    setAvatar((prevAvatar) => {
      if (!prevAvatar) return null;

      // Check if the item is already equipped
      const isEquipped = prevAvatar[item.type]?.id === item.id;

      return {
        ...prevAvatar,
        [item.type]: isEquipped ? null : item, // Toggle between equipping and unequipping
      };
    });
  };

  const renderWardrobeItems = () => {
    const categoryItems = items[selectedCategory as ItemType] || [];

    return (
      <ScrollView horizontal>
        {categoryItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleSelectItem(item)}
            style={[
              CreateAvatarStyles.wearItemContainer,
              avatar?.[item.type]?.id === item.id && CreateAvatarStyles.equippedItem
            ]}
          >
            <Image
              source={{ uri: item.filepath }}
              style={CreateAvatarStyles.wearItem}
              onError={(error) => console.error(`Error loading item image (${item.type}):`, error.nativeEvent.error)}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderAvatar = () => {
    if (!avatar) return null;

    return (
      <View style={CreateAvatarStyles.avatarContainer}>
        <Image source={require('../assets/sprites/avatar_base.png')} style={CreateAvatarStyles.avatar} />

        {avatar.hat && <Image source={{ uri: avatar.hat.filepath }} style={CreateAvatarStyles.hat} />}
        {avatar.shirt && <Image source={{ uri: avatar.shirt.filepath }} style={CreateAvatarStyles.upperWear} />}
        {avatar.bottom && <Image source={{ uri: avatar.bottom.filepath }} style={CreateAvatarStyles.lowerWear} />}
      </View>
    );
  };

  const handleShareAvatar = async () => {
    if (!avatarRef.current) return;
    console.log('Sharing avatar...');
    try {
      // Delay to ensure the view is fully rendered
      //await new Promise((resolve) => setTimeout(resolve, 500));

      // Capture the avatar view and save it as a png file
      const result = await captureRef(avatarRef);
      console.log('Captured avatar:', result);
      // Share the captured image

      await Sharing.shareAsync(result, {
        mimeType: 'image/png',
        dialogTitle: 'Share Your Avatar',
        UTI: 'public.png',
      });

    } catch (error) {
      console.error('Error sharing avatar:', error);
      Alert.alert('Error', 'Failed to share avatar.');
    }
  };

  return (
    <View style={CreateAvatarStyles.container}>
      <Text style={CreateAvatarStyles.title}>Edit Your Avatar</Text>

      {/* TEST capture for sharing - works */}
      <View ref={avatarRef} style={CreateAvatarStyles.avatarContainer}>
        <View style={CreateAvatarStyles.backgroundTextContainer}>
          <Text style={CreateAvatarStyles.backgroundText}>
            Go-Touch-Grass
          </Text>
          <Ionicons name="rose" style={CreateAvatarStyles.flowerIcon} />
        </View>

        <Image source={require('../assets/sprites/avatar_base.png')} style={CreateAvatarStyles.avatar} />
        {avatar?.hat && <Image source={{ uri: avatar.hat.filepath }} style={CreateAvatarStyles.hat} />}
        {avatar?.shirt && <Image source={{ uri: avatar.shirt.filepath }} style={CreateAvatarStyles.upperWear} />}
        {avatar?.bottom && <Image source={{ uri: avatar.bottom.filepath }} style={CreateAvatarStyles.lowerWear} />}
      </View>


      {/* ORIGINAL METHOD 
      <View style={CreateAvatarStyles.avatarContainer}>
       {isLoading ? <ActivityIndicator size="large" color="#00AB41" /> : renderAvatar()} 
      </View>
*/}
      {/* Share Avatar Button */}
      <TouchableOpacity style={CreateAvatarStyles.shareButton} onPress={handleShareAvatar}>
        <Text style={CreateAvatarStyles.shareButtonText}>Share Avatar</Text>
      </TouchableOpacity>

      {/* Testing with direct view 
      <View ref={avatarRef} style={CreateAvatarStyles.avatarContainer}>
        <Image source={require('../assets/sprites/avatar_base.png')} style={CreateAvatarStyles.avatar} />
        {avatar?.hat && <Image source={{ uri: avatar.hat.filepath }} style={CreateAvatarStyles.hat} />}
        {avatar?.shirt && <Image source={{ uri: avatar.shirt.filepath }} style={CreateAvatarStyles.upperWear} />}
        {avatar?.bottom && <Image source={{ uri: avatar.bottom.filepath }} style={CreateAvatarStyles.lowerWear} />}
      </View>
*/}
      <View style={CreateAvatarStyles.categorySelection}>
        <TouchableOpacity style={CreateAvatarStyles.categoryButton} onPress={() => setSelectedCategory(ItemType.HAT)}>
          <Text style={CreateAvatarStyles.categoryButtonText}>Hat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={CreateAvatarStyles.categoryButton} onPress={() => setSelectedCategory(ItemType.SHIRT)}>
          <Text style={CreateAvatarStyles.categoryButtonText}>Upper Wear</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={CreateAvatarStyles.categoryButton}
          onPress={() => setSelectedCategory(ItemType.BOTTOM)}
        >
          <Text style={CreateAvatarStyles.categoryButtonText}>Lower Wear</Text>
        </TouchableOpacity>
      </View>

      {renderWardrobeItems()}

      <TouchableOpacity
        style={CreateAvatarStyles.finishButton}
        onPress={handleUpdateAvatar}
        disabled={isSaving} // Disable while saving
      >
        <Text style={CreateAvatarStyles.finishButtonText}>{isSaving ? 'Saving...' : 'Save Changes'}</Text>
      </TouchableOpacity>



    </View>
  );
};

export default EditAvatar;

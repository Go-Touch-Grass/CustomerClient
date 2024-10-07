import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { PreventRemoveContext, useNavigation } from '@react-navigation/native';
import { getAvatarByCustomerId, getAvatarById, AvatarInfo, updateAvatar } from '../api/avatarApi'; // Adjust the import based on your project structure
import { CreateAvatarStyles } from '../styles/CreateAvatarStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import { getUserInfo } from '../api/userApi';
import { getItems, AvatarType, Item, ItemType } from '../api/avatarApi';

const EditAvatar = () => {
  const [avatar, setAvatar] = useState<AvatarInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
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
      Alert.alert('Success', 'Avatar updated successfully');
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
    const categoryItems = items.filter((item) => item.type === selectedCategory);

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

  return (
    <View style={CreateAvatarStyles.container}>
      <Text style={CreateAvatarStyles.title}>Edit Your Avatar</Text>

      <View style={CreateAvatarStyles.avatarContainer}>
        {isLoading ? <ActivityIndicator size="large" color="#00AB41" /> : renderAvatar()}
      </View>

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


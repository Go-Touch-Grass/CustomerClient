import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { createAvatar, getItems, AvatarType, Item, ItemType, AvatarInfo } from '../api/avatarApi';
import { updateCustomerAvatar } from '../api/userApi';
import { useNavigation } from '@react-navigation/native';
import { CreateAvatarStyles } from '../styles/CreateAvatarStyles';
import axiosInstance from '../api/authApi'; // Import the axiosInstance
import AvatarRenderer from '../components/AvatarRenderer';

const CreateAvatar = ({ route, navigation }) => {
  const [avatar, setAvatar] = useState<AvatarInfo>({
    id: 0, // Temporary ID for creation
    avatarType: AvatarType.TOURIST,
    hat: null,
    shirt: null,
    bottom: null,
  });
  const [items, setItems] = useState<Record<ItemType, Item[]>>({
    [ItemType.BASE]: [],
    [ItemType.HAT]: [],
    [ItemType.SHIRT]: [],
    [ItemType.BOTTOM]: [],
  });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchItems();
    // const url = axiosInstance.defaults.baseURL || '';
    //setBaseUrl(url);
  }, []);

  useEffect(() => {
    if (items[ItemType.BASE].length > 0) {
      const baseItem = items[ItemType.BASE].find((item) => item.id === 1);
      if (baseItem) {
        // Set the base item, but don't include it in the customization state
        // as customers shouldn't be able to change it
      }
    }
  }, [items]);

  const fetchItems = async () => {
    try {
      const fetchedItems = await getItems();
      setItems(fetchedItems);
    } catch (error) {
      console.error('Error fetching items:', error);
      Alert.alert('Error', 'Failed to fetch items');
    }
  };

  const handleCreateAvatar = async () => {
    setIsLoading(true);
    try {
      const response = await createAvatar(
        AvatarType.TOURIST,
        1, // Always use base item with id 1 for customers
        avatar.hat?.id || null,
        avatar.shirt?.id || null,
        avatar.bottom?.id || null,
      );

      Alert.alert('Success', 'Avatar created successfully');
      if (route.params?.onAvatarCreated) {
        await route.params.onAvatarCreated();
      }
      navigation.replace('Home');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Alert.alert('Error', 'You are not authorized. Please log in again.');
      } else {
        Alert.alert('Error', error.message || 'Failed to create avatar');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectItem = (item: Item) => {
    setAvatar((prevAvatar) => {
      if (!prevAvatar) return prevAvatar;

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
              avatar[item.type]?.id === item.id && CreateAvatarStyles.equippedItem,
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

  return (
    <View style={CreateAvatarStyles.container}>
      <Text style={CreateAvatarStyles.title}>Create Your Avatar</Text>

      <AvatarRenderer avatar={avatar} />

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

      <TouchableOpacity style={CreateAvatarStyles.finishButton} onPress={handleCreateAvatar} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={CreateAvatarStyles.finishButtonText}>Finish Creating Avatar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CreateAvatar;

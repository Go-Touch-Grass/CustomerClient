import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { createAvatar, getItems, AvatarType, Item, ItemType } from '../api/avatarApi';
import { updateCustomerAvatar } from '../api/userApi';
import { useNavigation } from '@react-navigation/native';
import { CreateAvatarStyles } from '../styles/CreateAvatarStyles';
import axiosInstance from '../api/authApi'; // Import the axiosInstance
import AvatarRenderer from '../components/AvatarRenderer';

const CreateAvatar = ({ route, navigation }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [customization, setCustomization] = useState<{
    [ItemType.HAT]: Item | null;
    [ItemType.SHIRT]: Item | null;
    [ItemType.BOTTOM]: Item | null;
  }>({
    [ItemType.HAT]: null,
    [ItemType.SHIRT]: null,
    [ItemType.BOTTOM]: null,
  });

  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  //const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    fetchItems();
    // const url = axiosInstance.defaults.baseURL || '';
    //setBaseUrl(url);
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      const baseItem = items.find(item => item.type === ItemType.BASE && item.id === 1);
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
      const avatarType = AvatarType.TOURIST;
      const response = await createAvatar(
        avatarType,
        1, // Always use base item with id 1 for customers
        customization[ItemType.HAT]?.id || null,
        customization[ItemType.SHIRT]?.id || null,
        customization[ItemType.BOTTOM]?.id || null,
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
    setCustomization((prev) => {
      const newState = { ...prev, [item.type]: item };
      return newState;
    });
  };

  const renderWardrobeItems = () => {
    const categoryItems = items.filter((item) => item.type === selectedCategory);
    return (
      <ScrollView horizontal>
        {categoryItems.map((item) => (
          <TouchableOpacity key={item.id} onPress={() => handleSelectItem(item)}>
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

      <AvatarRenderer
        avatar={{
          id: 0, // Temporary ID for creation
          avatarType: AvatarType.TOURIST,
          hat: customization[ItemType.HAT],
          shirt: customization[ItemType.SHIRT],
          bottom: customization[ItemType.BOTTOM],
        }}
      />

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

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { createAvatar, getItems, AvatarType, Item, ItemType } from '../api/avatarApi';
import { updateCustomerAvatar } from '../api/userApi';
import { useNavigation } from '@react-navigation/native';
import { CreateAvatarStyles } from '../styles/CreateAvatarStyles';
import axiosInstance from '../api/authApi'; // Import the axiosInstance

const CreateAvatar = ({ route, navigation }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [customization, setCustomization] = useState<{
    [ItemType.HAT]: Item | null;
    [ItemType.SHIRT]: Item | null;
    [ItemType.BOTTOMS]: Item | null;
  }>({
    [ItemType.HAT]: null,
    [ItemType.SHIRT]: null,
    [ItemType.BOTTOMS]: null,
  });

  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    fetchItems();
    const url = axiosInstance.defaults.baseURL || '';
    setBaseUrl(url);
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

  const handleCreateAvatar = async () => {
    setIsLoading(true);
    try {
      const avatarType = AvatarType.TOURIST;
      const response = await createAvatar(
        avatarType,
        customization[ItemType.HAT]?.id || null,
        customization[ItemType.SHIRT]?.id || null,
        customization[ItemType.BOTTOMS]?.id || null,
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
    console.log('Selected item:', item);
    setCustomization((prev) => {
      const newState = { ...prev, [item.type]: item };
      console.log('New customization state:', newState);
      return newState;
    });
  };

  const renderWardrobeItems = () => {
    console.log('Selected category:', selectedCategory);
    console.log('All items:', items);
    const categoryItems = items.filter((item) => item.type === selectedCategory);
    console.log('Filtered items:', categoryItems);

    return (
      <ScrollView horizontal>
        {categoryItems.map((item) => (
          <TouchableOpacity key={item.id} onPress={() => handleSelectItem(item)}>
            <Image
              source={{ uri: `${baseUrl}${item.filepath}` }}
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

      <View style={CreateAvatarStyles.avatarContainer}>
        <Image source={require('../assets/sprites/avatar_base.png')} style={CreateAvatarStyles.avatar} />

        {customization[ItemType.HAT] && (
          <Image source={{ uri: `${baseUrl}${customization[ItemType.HAT].filepath}` }} style={CreateAvatarStyles.hat} />
        )}
        {customization[ItemType.SHIRT] && (
          <Image source={{ uri: `${baseUrl}${customization[ItemType.SHIRT].filepath}` }} style={CreateAvatarStyles.upperWear} />
        )}
        {customization[ItemType.BOTTOMS] && (
          <Image source={{ uri: `${baseUrl}${customization[ItemType.BOTTOMS].filepath}` }} style={CreateAvatarStyles.lowerWear} />
        )}
      </View>

      <View style={CreateAvatarStyles.categorySelection}>
        <TouchableOpacity style={CreateAvatarStyles.categoryButton} onPress={() => setSelectedCategory(ItemType.HAT)}>
          <Text style={CreateAvatarStyles.categoryButtonText}>Hat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={CreateAvatarStyles.categoryButton} onPress={() => setSelectedCategory(ItemType.SHIRT)}>
          <Text style={CreateAvatarStyles.categoryButtonText}>Upper Wear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={CreateAvatarStyles.categoryButton} onPress={() => setSelectedCategory(ItemType.BOTTOMS)}>
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

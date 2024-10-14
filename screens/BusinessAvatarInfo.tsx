import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { BusinessAvatarInfoStyles } from '../styles/BusinessAvatarInfoStyles';

const BusinessAvatarInfo: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { entityType, entityName, location, category, description, coordinates } = route.params as {
    entityType: string;
    entityName: string;
    location: string;
    category: string | null;
    description: string | null;
    coordinates: { latitude: number; longitude: number } | null;
  };


  const handleBack = () => {
    navigation.goBack();
  };

  const handleNavigate = () => {
    // Check if coordinates are defined and valid
    if (coordinates && coordinates.latitude && coordinates.longitude) {
      navigation.navigate('Navigation', { entityName, coordinates });
    } else {
      console.log('Entity Name:', entityName);
      console.log('Coordinates:', coordinates);
      alert('Coordinates are undefined. Please check the location data.');
    }
  };

  return (
    <View style={BusinessAvatarInfoStyles.container}>
      <TouchableOpacity style={BusinessAvatarInfoStyles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" style={BusinessAvatarInfoStyles.backIcon} />
      </TouchableOpacity>

      <View style={BusinessAvatarInfoStyles.content}>
        <Text style={BusinessAvatarInfoStyles.title}>{entityName}</Text>
        <Text style={BusinessAvatarInfoStyles.location}>Location: {location}</Text>
        {entityType === 'Business_register_business' && category && (
          <Text style={BusinessAvatarInfoStyles.category}>Category: {category}</Text>
        )}
        {entityType === 'Outlet' && description && (
          <Text style={BusinessAvatarInfoStyles.description}>Description: {description}</Text>
        )}
      </View>

      <TouchableOpacity style={BusinessAvatarInfoStyles.navigateButton} onPress={handleNavigate}>
        <Text style={BusinessAvatarInfoStyles.navigateButtonText}>Navigate</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BusinessAvatarInfo;

import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAvatarDetails } from '../api/avatarApi';
import { AvatarInfo } from '../types/avatar';

const TestAvatarScreen: React.FC = () => {
  const [avatarInfo, setAvatarInfo] = useState<AvatarInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchAvatarDetails();
  }, []);

  const fetchAvatarDetails = async () => {
    try {
      const details = await getAvatarDetails();
      setAvatarInfo(details);
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch avatar details';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  const renderImage = (source: string | null) => {
    if (!source) return null;
    return typeof source === 'string' ? (
      <Image source={{ uri: source }} style={styles.avatar} />
    ) : null;
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={handleGoHome}>
          <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Avatar Details</Text>
      {avatarInfo && (
        <View style={styles.avatarContainer}>
          {renderImage(avatarInfo.avatar)}
          <View style={styles.customizationContainer}>
            {renderImage(avatarInfo.customization?.hat)}
            {renderImage(avatarInfo.customization?.upperWear)}
            {renderImage(avatarInfo.customization?.lowerWear)}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    width: 200,
    height: 200,
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  customizationContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  hat: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    resizeMode: 'contain',
  },
  upperWear: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    height: 80,
    resizeMode: 'contain',
  },
  lowerWear: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    resizeMode: 'contain',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TestAvatarScreen;

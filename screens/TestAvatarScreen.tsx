import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { getAvatarDetails } from '../api/avatarApi';
import { AvatarInfo } from '../types/avatar';

const TestAvatarScreen: React.FC = () => {
  const [avatarInfo, setAvatarInfo] = useState<AvatarInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAvatarDetails();
  }, []);

  const fetchAvatarDetails = async () => {
    try {
      const details = await getAvatarDetails();
      setAvatarInfo(details);
    } catch (err) {
      setError('Failed to fetch avatar details');
      Alert.alert('Error', 'Failed to fetch avatar details');
    } finally {
      setIsLoading(false);
    }
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Avatar Details</Text>
      {avatarInfo && (
        <View style={styles.avatarContainer}>
          <Image source={{ uri: avatarInfo.avatar }} style={styles.avatar} />
          <View style={styles.customizationContainer}>
            {avatarInfo.customization.hat && (
              <Image source={{ uri: avatarInfo.customization.hat }} style={styles.hat} />
            )}
            {avatarInfo.customization.upperWear && (
              <Image source={{ uri: avatarInfo.customization.upperWear }} style={styles.upperWear} />
            )}
            {avatarInfo.customization.lowerWear && (
              <Image source={{ uri: avatarInfo.customization.lowerWear }} style={styles.lowerWear} />
            )}
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
  },
});

export default TestAvatarScreen;

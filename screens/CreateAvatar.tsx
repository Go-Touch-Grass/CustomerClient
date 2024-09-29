import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { createGuestAccount } from '../api/rpmAPI';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const CreateAvatar = () => {
  const [guestUserId, setGuestUserId] = useState(null);
  const navigation = useNavigation<StackNavigationProp<any>>();

  useEffect(() => {
    const initializeGuestAccount = async () => {
      try {
        const guestAccount = await createGuestAccount();
        setGuestUserId(guestAccount.data.id); // Save the guest user ID
        console.log('Guest account created:', guestAccount);
      } catch (error) {
        console.error('Error creating guest account:', error);
      }
    };

    initializeGuestAccount();
  }, []);

  const handleFinish = async () => {
    // You can add logic here to save relevant details if needed
    // For example, you might want to save the guestUserId and applicationId in your app state or AsyncStorage

    // Navigate to Home screen
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Avatar</Text>
      <WebView 
        source={{ uri: `https://avatar.readyplayer.me/?userId=${guestUserId}&applicationId=66f4fea70b01ac5ee87a4d79` }} 
        style={styles.webView} 
      />
      <View style={styles.finishButtonContainer}>
        <Button title="Finish Creating Avatar" onPress={handleFinish} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  webView: {
    flex: 1,
    borderRadius: 10,
  },
  finishButtonContainer: {
    marginTop: 20,
  },
});

export default CreateAvatar;

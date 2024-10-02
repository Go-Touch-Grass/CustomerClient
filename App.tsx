import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import { I18nextProvider } from 'react-i18next';
import '@formatjs/intl-pluralrules';

// Import screens
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import Home from './screens/Home';
import Profile from './screens/Profile';
import EditProfile from './screens/EditProfile';
import ChangeLanguage from './screens/ChangeLanguage';
import ChangePassword from './screens/ChangePassword';
import CreateAvatar from './screens/CreateAvatar';
import GetAvatar from './screens/GetAvatar';

// Import utilities and services
import { getToken } from './utils/asyncStorage';
import i18n from './services/i18next';

const Stack = createStackNavigator();

const App: React.FC = () => {
  
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await getToken();
        setUserToken(token);
      } catch (e) {
        // Restoring token failed
      }
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={userToken ? 'Home' : 'Login'}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="CreateAvatar" component={CreateAvatar} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Change Language" component={ChangeLanguage} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} />
          <Stack.Screen name="GetAvatar" component={GetAvatar} />
        </Stack.Navigator>
      </NavigationContainer>
    </I18nextProvider>
  );
};

export default App;

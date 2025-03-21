import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import { I18nextProvider } from 'react-i18next';
import '@formatjs/intl-pluralrules';

// Import screens
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import verifyOTP from './screens/verifyOTP';
import Home from './screens/Home';
import Profile from './screens/Profile';
import EditProfile from './screens/EditProfile';
import ChangeLanguage from './screens/ChangeLanguage';
import ChangePassword from './screens/ChangePassword';
import CreateAvatar from './screens/CreateAvatar';
import GetAvatar from './screens/GetAvatar';
import EditAvatar from './screens/EditAvatar';
import Social from './screens/Social';
import Friends from './screens/Friends';
import BusinessAvatarInfo from './screens/BusinessAvatarInfo'
import Navigation from './screens/Navigation'
import TempViewAllVouchers from './screens/TempViewAllVouchers';
import GroupPurchase from './screens/GroupPurchase';
import { viewAllAvailableVouchers } from './api/voucherApi';
import JoinGroupPurchase from './screens/JoinGroupPurchase';

// Import utilities and services
import { getToken } from './utils/asyncStorage';
import i18n from './services/i18next';
import { StripeProvider } from '@stripe/stripe-react-native';
import { STRIPE_PUBLISHABLE_KEY } from '@env';

const Stack = createStackNavigator();
import Store from './screens/Store';
import ViewVoucherInventory from './screens/ViewVoucherInventory';

import Transactions from './screens/Transactions';



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

    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
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
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Change Language" component={ChangeLanguage} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="Store" component={Store} />
            <Stack.Screen name="GetAvatar" component={GetAvatar} />
            <Stack.Screen name="EditAvatar" component={EditAvatar} />
            <Stack.Screen name="verifyOTP" component={verifyOTP} />
            <Stack.Screen name="CreateAvatar" component={CreateAvatar} />
            <Stack.Screen name="BusinessAvatarInfo" component={BusinessAvatarInfo} />
            <Stack.Screen name="Navigation" component={Navigation} />
            <Stack.Screen name="Social" component={Social} />
            <Stack.Screen name="Friends" component={Friends} />
            <React.Fragment>
              <Stack.Screen name="ViewVoucherInventory" component={ViewVoucherInventory} />
            </React.Fragment>
            <React.Fragment>
              <Stack.Screen name="TempViewAllVouchers" component={TempViewAllVouchers} />
            </React.Fragment>
            <React.Fragment>
              <Stack.Screen name="GroupPurchase" component={GroupPurchase} />
            </React.Fragment>
            <React.Fragment>
              <Stack.Screen name="JoinGroupPurchase" component={JoinGroupPurchase} />
            </React.Fragment>
            <Stack.Screen name="Transactions" component={Transactions} />
          </Stack.Navigator>
        </NavigationContainer>
      </I18nextProvider>
    </StripeProvider>
  );
};

export default App;

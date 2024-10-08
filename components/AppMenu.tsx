import React from 'react';
import { View, TouchableOpacity, Text, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { appMenuStyles } from '../styles/AppMenuStyles';
import { removeToken } from '../utils/asyncStorage';
import { useTranslation } from 'react-i18next';

const AppMenu: React.FC = () => {
  const { t } = useTranslation();

  const navigation = useNavigation<StackNavigationProp<any>>();

  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  const navigateToChangeLanguage = () => {
    navigation.navigate('Change Language');
  };

  const handleLogout = async () => {
    await removeToken();
    navigation.replace('Login');
  };

  const navigateToViewVouchers = () => {

    navigation.navigate('ViewVoucherInventory'); // Navigate to ViewVoucherInventory
  };

  return (
    <View style={appMenuStyles.drawerContent}>
      <TouchableOpacity style={appMenuStyles.drawerItem} onPress={navigateToProfile}>
        <Text style={appMenuStyles.drawerItemText}>{t('profile')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={appMenuStyles.drawerItem} onPress={navigateToChangeLanguage}>
        <Text style={appMenuStyles.drawerItemText}>{t('change-language')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={appMenuStyles.drawerItem} onPress={handleLogout}>
        <Text style={appMenuStyles.drawerItemText}>{t('logout')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={appMenuStyles.drawerItem} onPress={navigateToViewVouchers}>
        <Text style={appMenuStyles.drawerItemText}>{t('View Voucher Inventory')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AppMenu;

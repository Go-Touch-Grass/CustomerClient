import React from 'react';
import { View, TouchableOpacity, Text, Animated, TouchableWithoutFeedback } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { homeStyles } from '../styles/HomeStyles';
import { removeToken } from '../utils/asyncStorage';

interface AppMenuProps {
  visible: boolean;
  menuAnimation: Animated.Value;
  toggleMenu: (visible: boolean) => void;
  navigation: StackNavigationProp<any>;
}

const AppMenu: React.FC<AppMenuProps> = ({ visible, menuAnimation, toggleMenu, navigation }) => {
  const { t } = useTranslation();

  const navigateTo = (screen: string) => {
    toggleMenu(false);
    navigation.navigate(screen);
  };

  const handleLogout = async () => {
    toggleMenu(false);
    await removeToken();
    navigation.replace('Login');
  };

  const navigateToViewVouchers = () => {

    navigation.navigate('ViewVoucherInventory'); // Navigate to ViewVoucherInventory
  };

  const menuTranslateY = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 0],
  });

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
    <Animated.View
      style={[
        homeStyles.menu,
        {
          transform: [{ translateY: menuTranslateY }],
          opacity: menuAnimation,
          display: visible ? 'flex' : 'none',
        },
      ]}
    >
      <TouchableWithoutFeedback>
        <View>
          <TouchableOpacity style={homeStyles.menuItem} onPress={() => navigateTo('Profile')}>
            <Text style={homeStyles.menuItemText}>{t('profile')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={homeStyles.menuItem} onPress={() => navigateTo('GetAvatar')}>
            <Text style={homeStyles.menuItemText}>Get Avatar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={homeStyles.menuItem} onPress={() => navigateTo('EditAvatar')}>
            <Text style={homeStyles.menuItemText}>Edit Avatar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={homeStyles.menuItem} onPress={() => navigateTo('Store')}>
            <Text style={homeStyles.menuItemText}>Store</Text>
          </TouchableOpacity>
          <TouchableOpacity style={homeStyles.menuItem} onPress={() => navigateTo('Social')}>
            <Text style={homeStyles.menuItemText}>{t('social')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={homeStyles.menuItem} onPress={() => navigateTo('Change Language')}>
            <Text style={homeStyles.menuItemText}>{t('change-language')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={homeStyles.menuItem} onPress={handleLogout}>
            <Text style={homeStyles.menuItemText}>{t('logout')}</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

export default AppMenu;
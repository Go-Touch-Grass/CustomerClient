import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { appMenuStyles } from '../styles/AppMenuStyles';
import { removeToken } from '../utils/asyncStorage';

const AppMenu: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const navigateToProfile = () => {
        navigation.navigate('Profile');
    };

    const handleLogout = async () => {
        await removeToken();
        navigation.replace('Login');
    };

    return (
        <View style={appMenuStyles.drawerContent}>
            <TouchableOpacity style={appMenuStyles.drawerItem} onPress={navigateToProfile}>
                <Text style={appMenuStyles.drawerItemText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={appMenuStyles.drawerItem} onPress={handleLogout}>
                <Text style={appMenuStyles.drawerItemText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AppMenu;
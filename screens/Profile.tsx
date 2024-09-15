import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons'; // Add this import
import { removeToken } from '../utils/asyncStorage';
import { getUserInfo } from '../api/userApi';
import { StyledContainer, InnerContainer, PageTitle } from '../styles/commonStyles';
import { profileStyles } from '../styles/ProfileStyles';
import ProtectedRoute from '../components/ProtectedRoute';

interface UserInfo {
    fullName: string;
    email: string;
    username: string;
}

const Profile: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const info = await getUserInfo();
                setUserInfo(info);
            } catch (error) {
                console.error('Error fetching user info:', error);
                handleLogout();
            }
        };

        fetchUserInfo();
    }, []);

    const handleLogout = async () => {
        await removeToken();
        navigation.replace('Login');
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <StyledContainer>
            <TouchableOpacity style={profileStyles.backButton} onPress={handleBack}>
                <Ionicons name="arrow-back" style={profileStyles.backIcon} />
            </TouchableOpacity>
            <InnerContainer>
                <PageTitle>Profile</PageTitle>
                {userInfo && (
                    <View style={profileStyles.infoContainer}>
                        <Text style={profileStyles.infoText}>Full Name: {userInfo.fullName}</Text>
                        <Text style={profileStyles.infoText}>Email: {userInfo.email}</Text>
                        <Text style={profileStyles.infoText}>Username: {userInfo.username}</Text>
                    </View>
                )}
                <TouchableOpacity style={profileStyles.button} onPress={handleLogout}>
                    <Text style={profileStyles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </InnerContainer>
        </StyledContainer>
    );
};

export default ProtectedRoute(Profile);
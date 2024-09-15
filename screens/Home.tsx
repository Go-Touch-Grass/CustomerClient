import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { removeToken, getUserInfo } from '../api/auth';
import { StyledContainer, InnerContainer, PageTitle } from '../components/styles';
import { homeStyles } from '../components/HomeStyles';
import ProtectedRoute from '../components/ProtectedRoute';

interface UserInfo {
    fullName: string;
    email: string;
    username: string;
}

const Home: React.FC = () => {
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

    return (
        <StyledContainer>
            <InnerContainer>
                <PageTitle>Welcome Home</PageTitle>
                {userInfo && (
                    <View>
                        <Text>Full Name: {userInfo.fullName}</Text>
                        <Text>Email: {userInfo.email}</Text>
                        <Text>Username: {userInfo.username}</Text>
                    </View>
                )}
                <TouchableOpacity style={homeStyles.button} onPress={handleLogout}>
                    <Text style={homeStyles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </InnerContainer>
        </StyledContainer>
    );
};

export default ProtectedRoute(Home);

import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

import {
    StyledContainer,
    InnerContainer,
    PageLogo,
    PageTitle
} from '../styles/commonStyles';
import { loginStyles } from '../styles/LoginStyles';
import { loginUser } from '../api/authApi';
import { storeToken } from '../utils/asyncStorage';

const Login: React.FC = () => {
    const { t } = useTranslation();
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loginError, setLoginError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [generalError, setGeneralError] = useState<string>('');
    const navigation = useNavigation<StackNavigationProp<any>>();

    const validateInputs = (): boolean => {
        let isValid = true;
        setLoginError('');
        setPasswordError('');
        setGeneralError('');

        if (!login.trim()) {
            setLoginError('Username or email is required');
            isValid = false;
        }
        if (!password) {
            setPasswordError('Password is required');
            isValid = false;
        }
        return isValid;
    };

    const handleLogin = async () => {
        if (validateInputs()) {
            try {
                const response = await loginUser(login, password);
                if (response.customer_account && response.token) {
                    await storeToken(response.token);
                    navigation.navigate('Home');
                } else {
                    setGeneralError('An unexpected error occurred during login.');
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setGeneralError(error.response?.data?.message || 'An unexpected error occurred. Please try again later.');
                } else {
                    setGeneralError('An unexpected error occurred. Please try again later.');
                }
            }
        }
    };

    const handleSignUp = () => {
        navigation.navigate('SignUp');
    };

    return (
        <StyledContainer>
            <InnerContainer>
                <PageLogo resizeMode="cover" source={require('./../assets/gardensbtb.png')} />
                <PageTitle>{t('go-touch-grass')}</PageTitle>
                
                <View style={loginStyles.inputContainer}>
                    <TextInput
                        style={loginStyles.input}
                        placeholder={t('username-or-email')}
                        value={login}
                        onChangeText={(text) => {
                            setLogin(text);
                            setLoginError('');
                        }}
                        autoCapitalize="none"
                    />
                    {loginError ? <Text style={loginStyles.errorText}>{loginError}</Text> : null}
                    <TextInput
                        style={loginStyles.input}
                        placeholder={t('password')}
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            setPasswordError('');
                        }}
                        secureTextEntry
                    />
                    {passwordError ? <Text style={loginStyles.errorText}>{passwordError}</Text> : null}
                </View>
                
                <TouchableOpacity style={loginStyles.button} onPress={handleLogin}>
                    <Text style={loginStyles.buttonText}>{t('login')}</Text>
                </TouchableOpacity>
                
                {generalError ? <Text style={loginStyles.errorText}>{generalError}</Text> : null}
                
                <TouchableOpacity style={loginStyles.signUpButton} onPress={handleSignUp}>
                    <Text style={loginStyles.signUpButtonText}>{t('sign-up')}</Text>
                </TouchableOpacity>
            </InnerContainer>
        </StyledContainer>
    );
};

export default Login;
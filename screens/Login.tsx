import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import {
    StyledContainer,
    InnerContainer,
    PageLogo,
    PageTitle
} from '../components/styles';
import { loginStyles } from '../components/LoginStyles';

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [usernameError, setUsernameError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const navigation = useNavigation<StackNavigationProp<any>>();

    const validateInputs = (): boolean => {
        let isValid = true;
        setUsernameError('');
        setPasswordError('');

        if (!username.trim()) {
            setUsernameError('Username is required');
            isValid = false;
        }
        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters long');
            isValid = false;
        }
        return isValid;
    };

    const handleLogin = () => {
        if (validateInputs()) {
            // Implement login logic here
            console.log('Login attempted with:', username, password);
        }
    };

    const handleSignUp = () => {
        navigation.navigate('SignUp');
    };

    return (
        <StyledContainer>
            <InnerContainer>
                <PageLogo resizeMode="cover" source={require('./../assets/gardensbtb.png')} />
                <PageTitle>Go Touch Grass</PageTitle>
                
                <View style={loginStyles.inputContainer}>
                    <TextInput
                        style={loginStyles.input}
                        placeholder="Username"
                        value={username}
                        onChangeText={(text) => {
                            setUsername(text);
                            setUsernameError('');
                        }}
                        autoCapitalize="none"
                    />
                    {usernameError ? <Text style={loginStyles.errorText}>{usernameError}</Text> : null}
                    <TextInput
                        style={loginStyles.input}
                        placeholder="Password"
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
                    <Text style={loginStyles.buttonText}>Login</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={loginStyles.signUpButton} onPress={handleSignUp}>
                    <Text style={loginStyles.signUpButtonText}>Sign Up</Text>
                </TouchableOpacity>
            </InnerContainer>
        </StyledContainer>
    );
};

export default Login;
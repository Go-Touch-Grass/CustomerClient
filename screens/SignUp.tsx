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
import { signUpStyles } from '../components/SignUpStyles';

const SignUp: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const navigation = useNavigation<StackNavigationProp<any>>();

    const validateInputs = (): boolean => {
        let isValid = true;
        const newErrors = { ...errors };

        if (!fullName.trim()) {
            newErrors.fullName = 'Full name is required';
            isValid = false;
        }

        if (!username.trim()) {
            newErrors.username = 'Username is required';
            isValid = false;
        }

        if (!email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
            isValid = false;
        }

        if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
            isValid = false;
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSignUp = () => {
        if (validateInputs()) {
            // Implement sign up logic here
            console.log('Sign up attempted with:', { fullName, username, email, password });
        }
    };

    const handleLogin = () => {
        navigation.navigate('Login');
    };

    return (
        <StyledContainer>
            <InnerContainer>
                <PageLogo resizeMode="cover" source={require('./../assets/gardensbtb.png')} />
                <PageTitle>Create Account</PageTitle>
                
                <View style={signUpStyles.inputContainer}>
                    <TextInput
                        style={signUpStyles.input}
                        placeholder="Full Name"
                        value={fullName}
                        onChangeText={(text) => {
                            setFullName(text);
                            setErrors({ ...errors, fullName: '' });
                        }}
                    />
                    {errors.fullName ? <Text style={signUpStyles.errorText}>{errors.fullName}</Text> : null}

                    <TextInput
                        style={signUpStyles.input}
                        placeholder="Username"
                        value={username}
                        onChangeText={(text) => {
                            setUsername(text);
                            setErrors({ ...errors, username: '' });
                        }}
                        autoCapitalize="none"
                    />
                    {errors.username ? <Text style={signUpStyles.errorText}>{errors.username}</Text> : null}

                    <TextInput
                        style={signUpStyles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            setErrors({ ...errors, email: '' });
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    {errors.email ? <Text style={signUpStyles.errorText}>{errors.email}</Text> : null}

                    <TextInput
                        style={signUpStyles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            setErrors({ ...errors, password: '', confirmPassword: '' });
                        }}
                        secureTextEntry
                    />
                    {errors.password ? <Text style={signUpStyles.errorText}>{errors.password}</Text> : null}

                    <TextInput
                        style={signUpStyles.input}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChangeText={(text) => {
                            setConfirmPassword(text);
                            setErrors({ ...errors, confirmPassword: '' });
                        }}
                        secureTextEntry
                    />
                    {errors.confirmPassword ? <Text style={signUpStyles.errorText}>{errors.confirmPassword}</Text> : null}
                </View>
                
                <TouchableOpacity style={signUpStyles.button} onPress={handleSignUp}>
                    <Text style={signUpStyles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={signUpStyles.loginButton} onPress={handleLogin}>
                    <Text style={signUpStyles.loginButtonText}>Already have an account? Login</Text>
                </TouchableOpacity>
            </InnerContainer>
        </StyledContainer>
    );
};

export default SignUp;

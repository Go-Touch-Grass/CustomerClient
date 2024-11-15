import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, Platform, ScrollView, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { registerUser } from '../api/authApi';
import { storeToken } from '../utils/asyncStorage'; // New import
import axios from 'axios';

import { StyledContainer, InnerContainer, PageLogo, PageTitle } from '../styles/commonStyles';
import { signUpStyles } from '../styles/SignUpStyles';
import { useTranslation } from 'react-i18next';

const SignUp: React.FC = () => {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [errors, setErrors] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
    general: '',
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

  const handleSignUp = async () => {
    if (validateInputs()) {
      try {
        const response = await registerUser(fullName, username, email, password, referralCode);
        if (response.customer_account && response.token) {
          await storeToken(response.token);
          navigation.replace('verifyOTP', { userId: response.customer_account.id });
          //navigation.replace('CreateAvatar', { customerId: response.customer_account.id });
        } else {
          setErrors({ ...errors, general: "An unexpected error occurred during registration." });
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error)
          setErrors({
            ...errors,
            general: error.response?.data?.message || 'An unexpected error occurred. Please try again later.',
          });
        } else {
          setErrors({ ...errors, general: 'An unexpected error occurred. Please try again later.' });
        }
      }
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={handleScroll}
      >
        <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss} style={{ flex: 1 }}>
          <StyledContainer>
            <InnerContainer>
              <PageLogo resizeMode="cover" source={require('./../assets/gardensbtb.png')} />
              <PageTitle>{t('create-account')}</PageTitle>

              <View style={signUpStyles.inputContainer}>
                <TextInput
                  style={signUpStyles.input}
                  placeholder={t('full-name')}
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    setErrors({ ...errors, fullName: '' });
                  }}
                />
                {errors.fullName ? <Text style={signUpStyles.errorText}>{errors.fullName}</Text> : null}

                <TextInput
                  style={signUpStyles.input}
                  placeholder={t('username')}
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
                  placeholder={t('email')}
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
                  placeholder={t('password')}
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
                  placeholder={t('confirm-password')}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setErrors({ ...errors, confirmPassword: '' });
                  }}
                  secureTextEntry
                />
                {errors.confirmPassword ? <Text style={signUpStyles.errorText}>{errors.confirmPassword}</Text> : null}
              
                <TextInput
                  style={signUpStyles.input}
                  placeholder="Referral Code (if any)"
                  value={referralCode}
                  onChangeText={(text) => {
                    setReferralCode(text);
                    setErrors({ ...errors, referralCode: '' });
                  }}
                  maxLength={8}
                />
                {errors.referralCode ? <Text style={signUpStyles.errorText}>{errors.referralCode}</Text> : null}
              </View>

              <TouchableOpacity style={signUpStyles.button} onPress={handleSignUp}>
                <Text style={signUpStyles.buttonText}>{t('sign-up')}</Text>
              </TouchableOpacity>

              {errors.general ? (
                <View style={signUpStyles.generalErrorContainer}>
                  <Text style={signUpStyles.generalErrorText}>{errors.general}</Text>
                </View>
              ) : null}

              <TouchableOpacity style={signUpStyles.loginButton} onPress={handleLogin}>
                <Text style={signUpStyles.loginButtonText}>{t('already-have-an-account-login-instead')}</Text>
              </TouchableOpacity>
            </InnerContainer>
          </StyledContainer>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;

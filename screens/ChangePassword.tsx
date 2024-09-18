import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { changePassword } from '../api/userApi';
import { StyledContainer, InnerContainer, PageTitle } from '../styles/commonStyles';
import { profileStyles } from '../styles/ProfileStyles';
import ProtectedRoute from '../components/ProtectedRoute';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const ChangePassword: React.FC = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<StackNavigationProp<any>>();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [errors, setErrors] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        general: '',
    });

    const handleBack = () => {
        navigation.goBack();
    };

    const validateInputs = (): boolean => {
        let isValid = true;
        const newErrors = { ...errors };

        if (!currentPassword.trim()) {
            newErrors.currentPassword = t('current-password-is-required');
            isValid = false;
        }

        if (newPassword.length < 6) {
            newErrors.newPassword = t('new-password-six-characters');
            isValid = false;
        }

        if (newPassword !== confirmNewPassword) {
            newErrors.confirmNewPassword = t('passwords-do-not-match');
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChangePassword = async () => {
        if (validateInputs()) {
            try {
                await changePassword(currentPassword, newPassword);
                Alert.alert(t('success'), t('password-changed-successfully'));
                navigation.goBack();
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 401) {
                        setErrors({
                            ...errors,
                            currentPassword: t('current-password-incorrect'),
                        });
                    } else {
                        setErrors({
                            ...errors,
                            general: error.response?.data?.message || t('failed-to-change-password'),
                        });
                    }
                } else {
                    setErrors({
                        ...errors,
                        general: t('unexpected-error-occured'),
                    });
                }
            }
        }
    };

    return (
        <StyledContainer>
            <TouchableOpacity style={profileStyles.backButton} onPress={handleBack}>
                <Ionicons name="arrow-back" style={profileStyles.backIcon} />
            </TouchableOpacity>
            <InnerContainer>
                <PageTitle>{t('change-password')}</PageTitle>
                <View style={profileStyles.inputContainer}>
                    <Text style={profileStyles.label}>{t('current-password')}:</Text>
                    <TextInput
                        style={profileStyles.input}
                        value={currentPassword}
                        onChangeText={(text) => {
                            setCurrentPassword(text);
                            setErrors({ ...errors, currentPassword: '', general: '' });
                        }}
                        placeholder={t('current-password')}
                        secureTextEntry
                    />
                    {errors.currentPassword ? <Text style={profileStyles.errorText}>{errors.currentPassword}</Text> : null}

                    <Text style={profileStyles.label}>{t('new-password')}:</Text>
                    <TextInput
                        style={profileStyles.input}
                        value={newPassword}
                        onChangeText={(text) => {
                            setNewPassword(text);
                            setErrors({ ...errors, newPassword: '', confirmNewPassword: '', general: '' });
                        }}
                        placeholder={t('new-password')}
                        secureTextEntry
                    />
                    {errors.newPassword ? <Text style={profileStyles.errorText}>{errors.newPassword}</Text> : null}

                    <Text style={profileStyles.label}>{t('confirm-new-password')}:</Text>
                    <TextInput
                        style={profileStyles.input}
                        value={confirmNewPassword}
                        onChangeText={(text) => {
                            setConfirmNewPassword(text);
                            setErrors({ ...errors, confirmNewPassword: '', general: '' });
                        }}
                        placeholder={t('confirm-new-password')}
                        secureTextEntry
                    />
                    {errors.confirmNewPassword ? <Text style={profileStyles.errorText}>{errors.confirmNewPassword}</Text> : null}
                </View>
                <TouchableOpacity style={profileStyles.button} onPress={handleChangePassword}>
                    <Text style={profileStyles.buttonText}>{t('change-password')}</Text>
                </TouchableOpacity>
                {errors.general ? (
                    <View style={profileStyles.generalErrorContainer}>
                        <Text style={profileStyles.generalErrorText}>{errors.general}</Text>
                    </View>
                ) : null}
            </InnerContainer>
        </StyledContainer>
    );
};

export default ProtectedRoute(ChangePassword);
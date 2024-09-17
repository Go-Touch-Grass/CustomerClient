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

const ChangePassword: React.FC = () => {
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
            newErrors.currentPassword = 'Current password is required';
            isValid = false;
        }

        if (newPassword.length < 6) {
            newErrors.newPassword = 'New password must be at least 6 characters long';
            isValid = false;
        }

        if (newPassword !== confirmNewPassword) {
            newErrors.confirmNewPassword = 'Passwords do not match';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChangePassword = async () => {
        if (validateInputs()) {
            try {
                await changePassword(currentPassword, newPassword);
                Alert.alert('Success', 'Password changed successfully');
                navigation.goBack();
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 401) {
                        setErrors({
                            ...errors,
                            currentPassword: 'Current password is incorrect',
                        });
                    } else {
                        setErrors({
                            ...errors,
                            general: error.response?.data?.message || 'Failed to change password',
                        });
                    }
                } else {
                    setErrors({
                        ...errors,
                        general: 'An unexpected error occurred. Please try again later.',
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
                <PageTitle>Change Password</PageTitle>
                <View style={profileStyles.inputContainer}>
                    <Text style={profileStyles.label}>Current Password:</Text>
                    <TextInput
                        style={profileStyles.input}
                        value={currentPassword}
                        onChangeText={(text) => {
                            setCurrentPassword(text);
                            setErrors({ ...errors, currentPassword: '', general: '' });
                        }}
                        placeholder="Current Password"
                        secureTextEntry
                    />
                    {errors.currentPassword ? <Text style={profileStyles.errorText}>{errors.currentPassword}</Text> : null}

                    <Text style={profileStyles.label}>New Password:</Text>
                    <TextInput
                        style={profileStyles.input}
                        value={newPassword}
                        onChangeText={(text) => {
                            setNewPassword(text);
                            setErrors({ ...errors, newPassword: '', confirmNewPassword: '', general: '' });
                        }}
                        placeholder="New Password"
                        secureTextEntry
                    />
                    {errors.newPassword ? <Text style={profileStyles.errorText}>{errors.newPassword}</Text> : null}

                    <Text style={profileStyles.label}>Confirm New Password:</Text>
                    <TextInput
                        style={profileStyles.input}
                        value={confirmNewPassword}
                        onChangeText={(text) => {
                            setConfirmNewPassword(text);
                            setErrors({ ...errors, confirmNewPassword: '', general: '' });
                        }}
                        placeholder="Confirm New Password"
                        secureTextEntry
                    />
                    {errors.confirmNewPassword ? <Text style={profileStyles.errorText}>{errors.confirmNewPassword}</Text> : null}
                </View>
                <TouchableOpacity style={profileStyles.button} onPress={handleChangePassword}>
                    <Text style={profileStyles.buttonText}>Change Password</Text>
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
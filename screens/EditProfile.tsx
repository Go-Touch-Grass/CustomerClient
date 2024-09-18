import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { editProfile, deleteAccount } from '../api/userApi';
import { StyledContainer, InnerContainer, PageTitle } from '../styles/commonStyles';
import { profileStyles } from '../styles/ProfileStyles';
import ProtectedRoute from '../components/ProtectedRoute';
import { removeToken } from '../utils/asyncStorage';
import { useTranslation } from 'react-i18next';

interface EditProfileProps {
    route: {
        params: {
            userInfo: {
                fullName: string;
                email: string;
                username: string;
            };
        };
    };
}

const EditProfile: React.FC<EditProfileProps> = ({ route }) => {
    const { t } = useTranslation();
    const navigation = useNavigation<StackNavigationProp<any>>();
    const { userInfo } = route.params;
    const [fullName, setFullName] = useState(userInfo.fullName);
    const [email, setEmail] = useState(userInfo.email);
    const [username, setUsername] = useState(userInfo.username);
    const [errors, setErrors] = useState({
        fullName: '',
        email: '',
        username: '',
        general: '',
    });

    const handleBack = () => {
        navigation.goBack();
    };

    const validateInputs = (): boolean => {
        let isValid = true;
        const newErrors = { ...errors };

        if (!fullName.trim()) {
            newErrors.fullName = t('full-name-is-required');
            isValid = false;
        }

        if (!username.trim()) {
            newErrors.username = t('username-is-required');
            isValid = false;
        }

        if (!email.trim()) {
            newErrors.email = t('email-is-required');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = t('email-is-invalid');
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSave = async () => {
        if (validateInputs()) {
            try {
                const updatedInfo = await editProfile({ fullName, email, username });
                Alert.alert(t('success'), t('profile-updated-successfully'));
                navigation.navigate('Profile', { updatedInfo });
            } catch (error: any) {
                setErrors({
                    ...errors,
                    general: error.response?.data?.message || 'Failed to update profile',
                });
            }
        }
    };

    const handleDeleteAccount = async () => {
        Alert.alert(
            t('delete-account'),
            t('delete-confirmation'),
            [
                { text: t('cancel'), style: 'cancel' },
                {
                    text: t('delete'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteAccount();
                            await removeToken();
                            navigation.replace('Login');
                        } catch (error: any) {
                            setErrors({
                                ...errors,
                                general: error.response?.data?.message || 'Failed to delete account',
                            });
                        }
                    },
                },
            ]
        );
    };

    return (
        <StyledContainer>
            <TouchableOpacity style={profileStyles.backButton} onPress={handleBack}>
                <Ionicons name="arrow-back" style={profileStyles.backIcon} />
            </TouchableOpacity>
            <InnerContainer>
                <PageTitle>{t('edit-profile')}</PageTitle>
                <View style={profileStyles.inputContainer}>
                    <Text style={profileStyles.label}>{t('full-name')}:</Text>
                    <TextInput
                        style={profileStyles.input}
                        value={fullName}
                        onChangeText={(text) => {
                            setFullName(text);
                            setErrors({ ...errors, fullName: '' });
                        }}
                        placeholder="Full Name"
                    />
                    {errors.fullName ? <Text style={profileStyles.errorText}>{errors.fullName}</Text> : null}

                    <Text style={profileStyles.label}>{t('email')}:</Text>
                    <TextInput
                        style={profileStyles.input}
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            setErrors({ ...errors, email: '' });
                        }}
                        placeholder="Email"
                        keyboardType="email-address"
                    />
                    {errors.email ? <Text style={profileStyles.errorText}>{errors.email}</Text> : null}

                    <Text style={profileStyles.label}>{t('username')}:</Text>
                    <TextInput
                        style={profileStyles.input}
                        value={username}
                        onChangeText={(text) => {
                            setUsername(text);
                            setErrors({ ...errors, username: '' });
                        }}
                        placeholder="Username"
                    />
                    {errors.username ? <Text style={profileStyles.errorText}>{errors.username}</Text> : null}
                </View>
                <TouchableOpacity style={profileStyles.button} onPress={handleSave}>
                    <Text style={profileStyles.buttonText}>{t('save-changes')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={profileStyles.deleteButton} onPress={handleDeleteAccount}>
                    <Text style={profileStyles.deleteButtonText}>{t('delete-account')}</Text>
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

export default ProtectedRoute(EditProfile);

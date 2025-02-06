import { useEffect, useState } from "react";
import { getToken, removeToken, storeToken } from "../utils/asyncStorage";
import axiosInstance from '../api/authApi';
import { getUserInfo } from '../api/userApi';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from "@react-navigation/stack";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import React from "react";
// so that typescript can understand structure of decoded token
interface DecodedToken {
    id: number;
    username: string;
    role: string;
    iat: number;
    exp: number;
}

const VerifyOTP = () => {
    const [otp, setOTP] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const navigation = useNavigation<StackNavigationProp<any>>();

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const token = await getToken();
            if (!token) {
                throw new Error('No token found');
            } else {
                const userInfo = await getUserInfo();
                setUserId(userInfo.id);
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    const handleOTPSubmit = async () => {
        try {
            const response = await axiosInstance.post('/auth/verifyOtp', { otp, userId });

            if (response.status === 200) {
                setSuccess('OTP verified successfully!');
                // Store the session token
                // if (response.data && response.data.token) {
                    // await storeToken(response.data.token);
                    // await removeToken(); // Remove the OTP token if verified
                    navigation.replace('CreateAvatar');
                // } else {
                    // setError('No session token received after OTP verification.');
                // }
            } else {
                setError('Invalid OTP.');
            }
        } catch (error) {
            setError('Error verifying OTP. Please try again.');
        }
    };

    const handleResendOTP = async () => {
        try {
            const token = await getToken();
            if (!token) {
                throw new Error('No token found');
                return;
            }

            const response = await axiosInstance.post('/auth/resendOtp', { userId });
            if (response.status === 200) {
                setSuccess('A new OTP has been sent to your email.');
            } else {
                setError('Error resending OTP. Please try again.');
            }
        } catch (error) {
            setError('Error resending OTP. Please try again.');
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Verify Email</Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            {success ? <Text style={styles.successText}>{success}</Text> : null}
            <View style={styles.otpContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter OTP"
                    value={otp}
                    onChangeText={setOTP}
                    keyboardType="numeric"
                />
                <TouchableOpacity style={styles.submitButton} onPress={handleOTPSubmit}>
                    <Text style={styles.buttonText}>Submit OTP</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.resendButton} onPress={handleResendOTP}>
                <Text style={styles.buttonText}>Resend OTP</Text>
            </TouchableOpacity>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            {success ? <Text style={styles.successText}>{success}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    heading: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 20,
    },
    otpContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        marginRight: 10,
        width: '60%',
    },
    submitButton: {
        backgroundColor: '#38a169',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    resendButton: {
        backgroundColor: '#6b7280',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
    successText: {
        color: 'green',
        marginTop: 10,
    },
});

export default VerifyOTP;
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getToken } from '../api/auth';

const ProtectedRoute = (WrappedComponent: React.ComponentType<any>) => {
    return (props: any) => {
        const [isLoading, setIsLoading] = useState(true);
        const [isAuthenticated, setIsAuthenticated] = useState(false);
        const navigation = useNavigation<StackNavigationProp<any>>();

        useEffect(() => {
            const checkAuth = async () => {
                const token = await getToken();
                if (token) {
                    setIsAuthenticated(true);
                } else {
                    navigation.replace('Login');
                }
                setIsLoading(false);
            };

            checkAuth();
        }, []);

        if (isLoading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" />
                </View>
            );
        }

        return isAuthenticated ? <WrappedComponent {...props} /> : null;
    };
};

export default ProtectedRoute;

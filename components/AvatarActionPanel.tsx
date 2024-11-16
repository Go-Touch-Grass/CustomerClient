import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../styles/commonStyles';
import { AvatarActionPanelStyles } from '../styles/AvatarActionPanelStyles';
import { BranchInfo } from '../api/businessApi';

interface AvatarActionPanelProps {
    selectedBranch: BranchInfo;
    onClose: () => void;
    onShopPress: () => void;
    onChatPress: () => void;
}

const AvatarActionPanel: React.FC<AvatarActionPanelProps> = ({ 
    selectedBranch, 
    onClose, 
    onShopPress,
    onChatPress 
}) => {
    const slideAnim = React.useRef(new Animated.Value(0)).current;
    const { height } = Dimensions.get('window');

    const entityName = selectedBranch.entityType === 'Business_register_business'
        ? selectedBranch.entityName
        : selectedBranch.outletName;

    useEffect(() => {
        Animated.spring(slideAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 50,
            friction: 8
        }).start();
    }, []);

    const handleClose = () => {
        Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 8
        }).start(() => {
            onClose();
        });
    };

    return (
        <Animated.View style={[
            AvatarActionPanelStyles.container,
            {
                transform: [{
                    translateY: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [height * 0.3, 0]
                    })
                }]
            }
        ]}>
            <Text style={AvatarActionPanelStyles.title}>{entityName}</Text>

            <TouchableOpacity onPress={handleClose} style={AvatarActionPanelStyles.backButton}>
                <Ionicons name="arrow-back" size={24} color={Colors.primary} />
                <Text style={AvatarActionPanelStyles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <View style={AvatarActionPanelStyles.buttonContainer}>
                <TouchableOpacity 
                    style={AvatarActionPanelStyles.actionButton}
                    onPress={onChatPress}
                >
                    <Ionicons name="chatbubble-outline" size={24} color={Colors.white} />
                    <Text style={AvatarActionPanelStyles.buttonText}>Chat</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={AvatarActionPanelStyles.actionButton}
                    onPress={onShopPress}
                >
                    <Ionicons name="cart-outline" size={24} color={Colors.white} />
                    <Text style={AvatarActionPanelStyles.buttonText}>Shop</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

export default AvatarActionPanel;
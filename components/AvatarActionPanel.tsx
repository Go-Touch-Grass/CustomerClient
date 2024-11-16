import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../styles/commonStyles';
import { AvatarActionPanelStyles } from '../styles/AvatarActionPanelStyles';
import { BranchInfo } from '../api/businessApi';
import ChatScreen from '../screens/ChatScreen';

interface AvatarActionPanelProps {
    selectedBranch: BranchInfo;
    onClose: () => void;
    onShopPress: () => void;
}

const AvatarActionPanel: React.FC<AvatarActionPanelProps> = ({ 
    selectedBranch, 
    onClose, 
    onShopPress 
}) => {
    const slideAnim = React.useRef(new Animated.Value(0)).current;
    const { height } = Dimensions.get('window');
    const [showChat, setShowChat] = useState(false);

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

    const handleChatPress = () => {
        if (selectedBranch?.avatar?.id) {
            setShowChat(true);
        }
    };

    if (showChat && selectedBranch?.avatar?.id) {
        return (
            <ChatScreen
                branchName={entityName}
                locationDescription="Default location description"
                onClose={() => setShowChat(false)}
                onShopPress={onShopPress}
                avatarId={selectedBranch.avatar.id}
            />
        );
    }

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
                <Text style={AvatarActionPanelStyles.backButtonText}>Close</Text>
            </TouchableOpacity>

            <View style={AvatarActionPanelStyles.buttonContainer}>
                <TouchableOpacity 
                    style={AvatarActionPanelStyles.actionButton}
                    onPress={handleChatPress}
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
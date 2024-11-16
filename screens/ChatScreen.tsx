import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ChatMessage, createChatCompletion, getAvatarPrompt } from '../api/chatApi';
import { Colors } from '../styles/commonStyles';
import { ChatScreenStyles } from '../styles/ChatScreenStyles';

interface ChatOption {
    id: number;
    text: string;
    type: 'dialogue' | 'shop' | 'farewell';
}

interface ChatScreenProps {
    branchName: string;
    locationDescription: string;
    onClose: () => void;
    onShopPress?: () => void;
    avatarId: number | string;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ branchName, locationDescription, onClose, onShopPress, avatarId }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [availableOptions, setAvailableOptions] = useState<ChatOption[]>([]);
    const [hasStarted, setHasStarted] = useState(false);
    const [avatarPrompt, setAvatarPrompt] = useState<string>('');
    const slideAnim = React.useRef(new Animated.Value(0)).current;
    const { height } = Dimensions.get('window');

    useEffect(() => {
        Animated.spring(slideAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 50,
            friction: 8
        }).start();
    }, []);

    useEffect(() => {
        // Fetch avatar prompt when component mounts
        const fetchAvatarPrompt = async () => {
            try {
                const promptData = await getAvatarPrompt(avatarId);
                // console.log('promptData', promptData);
                // console.log('avatarId', avatarId);
                setAvatarPrompt(promptData.prompt);
            } catch (error) {
                console.error('Error fetching avatar prompt:', error);
            }
        };

        fetchAvatarPrompt();
    }, [avatarId]);

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

    const handleSendMessage = async (selectedOption?: ChatOption) => {
        if (!selectedOption || isLoading) return;

        if (selectedOption.type === 'shop' && onShopPress) {
            onShopPress();
            return;
        }

        const userMessage: ChatMessage = {
            role: 'user',
            content: selectedOption.text
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setAvailableOptions([]);

        try {
            const response = await createChatCompletion({
                messages: [
                    { role: 'system', content: avatarPrompt }, // Include avatar prompt
                    ...messages,
                    userMessage
                ],
                locationDescription
            });

            const parsedResponse = typeof response.message === 'string' 
                ? JSON.parse(response.message)
                : response.message;

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: JSON.stringify(parsedResponse)
            }]);

            setAvailableOptions(parsedResponse.available_options || []);
        } catch (error) {
            console.error('Error handling message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const startConversation = async () => {
        setHasStarted(true);
        setIsLoading(true);
        try {
            const response = await createChatCompletion({
                messages: [{ role: 'user', content: 'Hello' }],
                locationDescription
            });

            const parsedResponse = typeof response.message === 'string' 
                ? JSON.parse(response.message)
                : response.message;

            setMessages([{
                role: 'assistant',
                content: JSON.stringify(parsedResponse)
            }]);

            setAvailableOptions(parsedResponse.available_options || []);
        } catch (error) {
            console.error('Error starting conversation:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderMessageContent = (message: ChatMessage) => {
        if (message.role === 'user') return message.content;
        try {
            const parsed = JSON.parse(message.content);
            return parsed.npc_response;
        } catch {
            return message.content;
        }
    };

    const getOptionButtonStyle = (type: 'dialogue' | 'shop' | 'farewell') => {
        switch (type) {
            case 'farewell':
                return ChatScreenStyles.farewellButton;
            case 'shop':
                return ChatScreenStyles.shopButton;
            default:
                return ChatScreenStyles.dialogueButton;
        }
    };

    return (
        <Animated.View style={[
            ChatScreenStyles.container,
            {
                transform: [{
                    translateY: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [height * 0.8, 0]
                    })
                }]
            }
        ]}>
            <View style={ChatScreenStyles.header}>
                <TouchableOpacity onPress={handleClose} style={ChatScreenStyles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={ChatScreenStyles.title}>{branchName}</Text>
            </View>

            <ScrollView style={ChatScreenStyles.messagesContainer}>
                {messages.map((msg, index) => (
                    <View
                        key={index}
                        style={[
                            ChatScreenStyles.messageBox,
                            msg.role === 'user' ? ChatScreenStyles.userMessage : ChatScreenStyles.assistantMessage
                        ]}
                    >
                        <Text style={[
                            ChatScreenStyles.messageText,
                            msg.role === 'assistant' && ChatScreenStyles.assistantMessageText
                        ]}>
                            {renderMessageContent(msg)}
                        </Text>
                    </View>
                ))}
                {isLoading && (
                    <ActivityIndicator size="small" color={Colors.primary} />
                )}
            </ScrollView>

            <View style={ChatScreenStyles.optionsContainer}>
                {!hasStarted ? (
                    <TouchableOpacity
                        style={ChatScreenStyles.startButton}
                        onPress={startConversation}
                    >
                        <Text style={ChatScreenStyles.startButtonText}>Start Conversation</Text>
                    </TouchableOpacity>
                ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {availableOptions.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                style={[
                                    ChatScreenStyles.optionButton,
                                    getOptionButtonStyle(option.type)
                                ]}
                                onPress={() => handleSendMessage(option)}
                            >
                                <Text style={ChatScreenStyles.optionButtonText}>{option.text}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
            </View>
        </Animated.View>
    );
};

export default ChatScreen;
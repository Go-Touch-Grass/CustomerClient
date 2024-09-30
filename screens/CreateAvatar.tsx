import React, { useState } from 'react';
import { View, Text, Button, ScrollView, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { createAvatar } from '../api/avatarApi';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CreateAvatarStyles } from '../styles/CreateAvatarStyles';
import { storeToken } from '../utils/asyncStorage'; // New import

interface Item {
    name: string;
    image: any; // Use 'ImageSourcePropType' for better type safety if desired
}

const hats: Item[] = [
    { name: 'Baseball Cap', image: require('../assets/sprites/baseball_cap.png') },
    { name: 'Cowboy Hat', image: require('../assets/sprites/cowboy_hat.png') }
];

const upperWear: Item[] = [
    { name: 'Love Shirt', image: require('../assets/sprites/love_shirt.png') },
    { name: 'White Shirt', image: require('../assets/sprites/white_shirt.png') }
];

const lowerWear: Item[] = [
    { name: 'Blue Skirt', image: require('../assets/sprites/blue_skirt.png') },
    { name: 'Purple Pants', image: require('../assets/sprites/purple_pants.png') }
];

const CreateAvatar = () => {
    const [avatar, setAvatar] = useState(''); // Placeholder for base avatar
    const [customization, setCustomization] = useState<{
        hat: Item | null;
        upperWear: Item | null;
        lowerWear: Item | null;
    }>({
        hat: null,
        upperWear: null,
        lowerWear: null
    });

    const [selectedCategory, setSelectedCategory] = useState('');
    const navigation = useNavigation<StackNavigationProp<any>>();

    const handleCreateAvatar = async () => {
        try {
            
            const response = await createAvatar(avatar, customization);
            if (response.customer_account && response.token) {
                await storeToken(response.token);
                Alert.alert('Avatar created successfully');
                navigation.navigate('Home');
            }
        } catch (error) {
            Alert.alert('Error creating avatar', error.message);
        }
    };

    const handleSelectItem = (category: string, item: Item) => {
        setCustomization((prev) => ({ ...prev, [category]: item }));
    };

    // Render wardrobe items based on the selected category
    const renderWardrobeItems = () => {
        let items: Item[] = [];
        if (selectedCategory === 'hat') items = hats;
        else if (selectedCategory === 'upperWear') items = upperWear;
        else if (selectedCategory === 'lowerWear') items = lowerWear;

        return (
            <ScrollView horizontal>
                {items.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => handleSelectItem(selectedCategory, item)}>
                        <Image source={item.image} style={CreateAvatarStyles.wearItem} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        );
    };

    return (
        <View style={CreateAvatarStyles.container}>
            {/* Title */}
            <Text style={CreateAvatarStyles.title}>Create Your Avatar</Text>

            {/* Base Avatar */}
            <View style={CreateAvatarStyles.avatarContainer}>
                <Image source={require('../assets/sprites/avatar_base.png')} style={CreateAvatarStyles.avatar} />

                {/* Equipped Items */}
                {customization.hat && <Image source={customization.hat.image} style={CreateAvatarStyles.hat} />}
                {customization.upperWear && <Image source={customization.upperWear.image} style={CreateAvatarStyles.upperWear} />}
                {customization.lowerWear && <Image source={customization.lowerWear.image} style={CreateAvatarStyles.lowerWear} />}
            </View>

            {/* Category Selection */}
            <View style={CreateAvatarStyles.categorySelection}>
                <TouchableOpacity style={CreateAvatarStyles.categoryButton} onPress={() => setSelectedCategory('hat')}>
                    <Text style={CreateAvatarStyles.categoryButtonText}>Hat</Text>
                </TouchableOpacity>
                <TouchableOpacity style={CreateAvatarStyles.categoryButton} onPress={() => setSelectedCategory('upperWear')}>
                    <Text style={CreateAvatarStyles.categoryButtonText}>Upper Wear</Text>
                </TouchableOpacity>
                <TouchableOpacity style={CreateAvatarStyles.categoryButton} onPress={() => setSelectedCategory('lowerWear')}>
                    <Text style={CreateAvatarStyles.categoryButtonText}>Lower Wear</Text>
                </TouchableOpacity>
            </View>

            {/* Wardrobe Items */}
            {renderWardrobeItems()}

            {/* Create Avatar Button */}
            <TouchableOpacity style={CreateAvatarStyles.finishButton} onPress={handleCreateAvatar}>
                <Text style={CreateAvatarStyles.finishButtonText}>Finish Creating Avatar</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CreateAvatar;

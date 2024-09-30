import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getAvatarDetails, updateAvatar } from '../api/avatarApi';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define the Item interface
interface Item {
    name: string;
    image: any;
}

// Define wardrobe items
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

// Define customization state interface
interface Customization {
    hat: Item | null;
    upperWear: Item | null;
    lowerWear: Item | null;
}

const EditAvatar = () => {
    const [avatar, setAvatar] = useState<string>(''); // Placeholder for base avatar
    const [customization, setCustomization] = useState<Customization>({
        hat: null,
        upperWear: null,
        lowerWear: null
    });

    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const navigation = useNavigation<StackNavigationProp<any>>();

    useEffect(() => {
        const fetchAvatarDetails = async () => {
            try {
                const avatarData = await getAvatarDetails(); 
                const customization: Customization = {
                    hat: avatarData.customization.hat || null,
                    upperWear: avatarData.customization.upperWear || null,
                    lowerWear: avatarData.customization.lowerWear || null
                };

                setAvatar(avatarData.avatar);
                setCustomization(customization);
                setLoading(false);
            } catch (error) {
                Alert.alert('Error fetching avatar details', error.message);
            }
        };

        fetchAvatarDetails();
    }, []);

    const handleUpdateAvatar = async () => {
        try {
            const data = {
                avatar, // Placeholder for base avatar
                customization // User's customization
            };
            await updateAvatar(data); // Update avatar data
            Alert.alert('Avatar updated successfully');
            navigation.navigate('Home'); // Redirect to Home screen
        } catch (error) {
            Alert.alert('Error updating avatar', error.message);
        }
    };

    const handleSelectItem = (category: keyof Customization, item: Item) => {
        setCustomization((prev) => ({ ...prev, [category]: item }));
    };

    const renderWardrobeItems = () => {
        let items: Item[] = [];
        if (selectedCategory === 'hat') items = hats;
        else if (selectedCategory === 'upperWear') items = upperWear;
        else if (selectedCategory === 'lowerWear') items = lowerWear;

        return (
            <ScrollView horizontal>
                {items.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => handleSelectItem(selectedCategory as keyof Customization, item)}>
                        <Image source={item.image} style={{ width: 50, height: 50, margin: 10 }} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        );
    };

    if (loading) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <View>
            <Text>Edit Your Avatar</Text>

            {/* Base Avatar */}
            <Image source={require('../assets/sprites/avatar_base.png')} style={{ width: 200, height: 200 }} />

            {/* Equipped Items */}
            {customization.hat && <Image source={customization.hat.image} style={{ position: 'absolute', top: 30, width: 50, height: 50 }} />}
            {customization.upperWear && <Image source={customization.upperWear.image} style={{ position: 'absolute', top: 80, width: 100, height: 100 }} />}
            {customization.lowerWear && <Image source={customization.lowerWear.image} style={{ position: 'absolute', top: 150, width: 100, height: 100 }} />}

            {/* Category Selection */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 10 }}>
                <Button title="Hat" onPress={() => setSelectedCategory('hat')} />
                <Button title="Upper Wear" onPress={() => setSelectedCategory('upperWear')} />
                <Button title="Lower Wear" onPress={() => setSelectedCategory('lowerWear')} />
            </View>

            {/* Wardrobe Items */}
            {renderWardrobeItems()}

            {/* Update Avatar Button */}
            <Button title="Update Avatar" onPress={handleUpdateAvatar} />
        </View>
    );
};

export default EditAvatar;

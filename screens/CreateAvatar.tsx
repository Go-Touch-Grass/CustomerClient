import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { CreateAvatarStyles } from '../styles/CreateAvatarStyles';

/* interface Collectable {
    id: number;
    name: string;
    image: any; 
}

interface EquippedItems {
    shirt: Collectable | null;
    pants: Collectable | null;
    hat: Collectable | null;
} */

const collectables = {
    hats: [
        { id: 1, name: 'Cowboy Hat', image: require('../assets/sprites/cowboy_hat.png') },
        { id: 2, name: 'Baseball Cap', image: require('../assets/sprites/baseball_cap.png') },
    ],
    shirts: [
        { id: 1, name: 'White Shirt', image: require('../assets/sprites/white_shirt.png') },
        { id: 2, name: 'Love Shirt', image: require('../assets/sprites/love_shirt.png') },
    ],
    pants: [
        { id: 1, name: 'Blue Skirt', image: require('../assets/sprites/blue_skirt.png') },
        { id: 2, name: 'Purple Pants', image: require('../assets/sprites/purple_pants.png') },
    ],
};

const CreateAvatar: React.FC = () => {
    // State to hold equipped items
    const [equippedItems, setEquippedItems] = useState({
        shirt: null,
        pants: null,
        hat: null,
    });

    // Function to equip collectables
    const equipCollectable = (type: keyof EquippedItems, collectable: Collectable) => {
        setEquippedItems((prev) => ({ ...prev, [type]: collectable }));
    };

    // Function to create avatar (you would send this to your backend)
    const createAvatar = () => {
        console.log('Avatar created with:', equippedItems);
    };

    return (
        <View style={CreateAvatarStyles.container}>
            <View style={CreateAvatarStyles.avatarContainer}>
                <Image
                    source={require('../assets/sprites/avatar_base.png')} 
                    style={CreateAvatarStyles.sprite}
                />
                {equippedItems.shirt && (
                    <Image source={equippedItems.shirt.image} style={CreateAvatarStyles.sprite} />
                )}
                {equippedItems.pants && (
                    <Image source={equippedItems.pants.image} style={CreateAvatarStyles.sprite} />
                )}
                {equippedItems.hat && (
                    <Image source={equippedItems.hat.image} style={CreateAvatarStyles.sprite} />
                )}
            </View>

            <View style={CreateAvatarStyles.collectableContainer}>
                <Text>Select a Hat:</Text>
                {collectables.hats.map((hat) => (
                    <TouchableOpacity key={hat.id} onPress={() => equipCollectable('hat', hat)}>
                        <Image source={hat.image} style={CreateAvatarStyles.collectable} />
                    </TouchableOpacity>
                ))}

                <Text>Select a Shirt:</Text>
                {collectables.shirts.map((shirt) => (
                    <TouchableOpacity key={shirt.id} onPress={() => equipCollectable('shirt', shirt)}>
                        <Image source={shirt.image} style={CreateAvatarStyles.collectable} />
                    </TouchableOpacity>
                ))}

                <Text>Select Pants:</Text>
                {collectables.pants.map((pants) => (
                    <TouchableOpacity key={pants.id} onPress={() => equipCollectable('pants', pants)}>
                        <Image source={pants.image} style={CreateAvatarStyles.collectable} />
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity onPress={createAvatar} style={CreateAvatarStyles.createAvatarButton}>
                <Text style={CreateAvatarStyles.createAvatarText}>Create Avatar</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CreateAvatar;

// EditAvatar.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

const EditAvatar = ({ navigation, route }) => {
    const { t } = useTranslation();
    const { currentAvatar } = route.params; // Get current avatar data from route params
    const [customization, setCustomization] = useState(currentAvatar.customization);

    const handleCustomization = (type, item) => {
        setCustomization(prev => {
            const items = prev[type].includes(item) ? prev[type].filter(i => i !== item) : [...prev[type], item];
            return { ...prev, [type]: items };
        });
    };

    const handleSubmit = () => {
        // Update avatar data (to backend or local state)
        console.log({ customization });
        navigation.navigate('Home');
    };

    return (
        <View style={styles.container}>
            <Text>{t('edit_avatar')}</Text>
            {/* Display current customization options */}
            <Text>{t('current_hats')}: {customization.hats.join(', ')}</Text>
            <Text>{t('current_upperWear')}: {customization.upperWear.join(', ')}</Text>
            <Text>{t('current_lowerWear')}: {customization.lowerWear.join(', ')}</Text>

            <Button title="Add Hat" onPress={() => handleCustomization('hats', 'Hat1')} />
            <Button title="Add Upper Wear" onPress={() => handleCustomization('upperWear', 'Shirt1')} />
            <Button title="Add Lower Wear" onPress={() => handleCustomization('lowerWear', 'Pants1')} />

            <Button title={t('update_avatar')} onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default EditAvatar;

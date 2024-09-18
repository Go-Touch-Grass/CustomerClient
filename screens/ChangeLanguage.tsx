import React, { useState } from 'react';
import { View, TouchableOpacity, Text, FlatList, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ChangeLanguageStyles } from '../styles/ChangeLanguageStyles'
import { Ionicons } from '@expo/vector-icons'; 
import { StyledContainer, InnerContainer, PageTitle } from '../styles/commonStyles';
import languagesList from '../services/languagesList.json';

type Languages = {
    [key: string]: {
      name: string;
      nativeName: string;
    };
  };
  
// Assign the imported JSON to the 'languages' variable
const languages: Languages = languagesList;

const ChangeLanguage: React.FC = () => {
    const { t, i18n } = useTranslation();

    const navigation = useNavigation<StackNavigationProp<any>>();

    const changeLanguage = async (lng: string) => {
        await i18n.changeLanguage(lng); 
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <StyledContainer>
            <TouchableOpacity style={ChangeLanguageStyles.backButton} onPress={handleBack}>
                <Ionicons name="arrow-back" style={ChangeLanguageStyles.backIcon} />
            </TouchableOpacity>
            <InnerContainer>
                <PageTitle>{t('language-preference')}</PageTitle>
                    <View style={ChangeLanguageStyles.languageListContainer}>
                        <FlatList
                            data={Object.keys(languages)}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={ChangeLanguageStyles.languageItem}
                                    onPress={() => changeLanguage(item)}
                                    >
                                    <Text style={ChangeLanguageStyles.languageItemText}>
                                        {languages[item].nativeName}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
            </InnerContainer>
        </StyledContainer>
    );
};

export default ChangeLanguage;

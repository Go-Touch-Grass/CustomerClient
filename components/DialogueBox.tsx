import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '../styles/commonStyles';
import { DialogueNode, DialogueOption } from '../utils/dialogue';

interface DialogueBoxProps {
    currentNode: DialogueNode;
    onSelectOption: (option: DialogueOption) => void;
}

const DialogueBox: React.FC<DialogueBoxProps> = ({ currentNode, onSelectOption }) => {
    return (
        <View style={styles.container}>
            {currentNode.response && (
                <ScrollView style={styles.responseContainer}>
                    <Text style={styles.responseText}>{currentNode.response}</Text>
                </ScrollView>
            )}

            <View style={styles.optionsContainer}>
                {currentNode.options.map((option) => (
                    <TouchableOpacity
                        key={option.id}
                        style={styles.optionButton}
                        onPress={() => onSelectOption(option)}
                    >
                        <Text style={styles.optionText}>{option.text}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 15,
        padding: 15,
        margin: 10,
        maxHeight: '60%',
    },
    responseContainer: {
        maxHeight: 150,
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
    },
    responseText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 22,
    },
    optionsContainer: {
        gap: 10,
    },
    optionButton: {
        backgroundColor: Colors.primary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    optionText: {
        color: '#fff',
        fontSize: 14,
    },
});

export default DialogueBox;
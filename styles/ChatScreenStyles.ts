import { StyleSheet } from 'react-native';
import { Colors } from './commonStyles';

// Add new color constants (you may want to move these to commonStyles.ts)
const themeColors = {
    primary: '#2E7D32', // dark green
    secondary: '#2E7D32', // changed to match primary for higher contrast (was '#81C784')
    background: '#F1F8E9', // very light green
};

export const ChatScreenStyles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '80%',
        backgroundColor: Colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGray,
    },
    backButton: {
        marginRight: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    messagesContainer: {
        flex: 1,
        padding: 16,
        maxHeight: '70%', // Reduce message container height to make room for options
    },
    messageBox: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        maxWidth: '80%',
    },
    userMessage: {
        backgroundColor: themeColors.primary,
        alignSelf: 'flex-end',
    },
    assistantMessage: {
        backgroundColor: Colors.white,
        alignSelf: 'flex-start',
        borderWidth: 2,
        borderColor: themeColors.secondary,
    },
    messageText: {
        color: Colors.white,
    },
    assistantMessageText: {
        color: themeColors.secondary,
    },
    optionsContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: Colors.lightGray,
    },
    startButton: {
        backgroundColor: themeColors.primary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    startButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    optionButton: {
        backgroundColor: Colors.green,
        padding: 12,
        borderRadius: 8,
        marginRight: 8,
        marginBottom: 4, // Add bottom margin for wrapped rows
        // minWidth: '45%', // Set minimum width to ensure 2 buttons per row
    },
    dialogueButton: {
        backgroundColor: Colors.green,
    },
    shopButton: {
        backgroundColor: Colors.primary,
    },
    farewellButton: {
        backgroundColor: Colors.red,
    },
    optionButtonText: {
        color: Colors.white,
    },
});
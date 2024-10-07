import { StyleSheet } from 'react-native';
import { Colors, commonStyles } from './commonStyles';

export const loginStyles = StyleSheet.create({
    inputContainer: {
        width: '80%',
    },
    input: {
        backgroundColor: Colors.secondary,
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
    },
    button: {
        backgroundColor: Colors.green,
        padding: 15,
        borderRadius: 5,
        width: '80%',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    signUpButton: {
        backgroundColor: 'transparent',
        padding: 15,
        borderRadius: 5,
        width: '80%',
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderColor: Colors.green,
    },
    signUpButtonText: {
        color: Colors.green,
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        ...commonStyles.errorText,
        fontSize: 12,
        marginTop: 5,
    },
});

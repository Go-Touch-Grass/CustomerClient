import { StyleSheet } from 'react-native';
import { Colors, commonStyles } from './commonStyles';

export const signUpStyles = StyleSheet.create({
    inputContainer: {
        width: '80%',
    },
    input: {
        backgroundColor: Colors.secondary,
        padding: 15,
        borderRadius: 5,
        fontSize: 16,
        marginBottom: 10,
    },
    errorText: {
        ...commonStyles.errorText,
        fontSize: 12,
        marginTop: -5,
    },
    button: {
        backgroundColor: Colors.green,
        padding: 15,
        borderRadius: 5,
        width: '80%',
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginButton: {
        marginTop: 15,
    },
    loginButtonText: {
        color: Colors.green,
        fontSize: 16,
    },
    generalErrorContainer: {
        width: '80%',
        marginTop: 10,
    },
    generalErrorText: commonStyles.errorText,
});

import { StyleSheet } from 'react-native';

export const signUpStyles = StyleSheet.create({
    inputContainer: {
        width: '80%',
    },
    input: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 5,
        fontSize: 16,
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: -5,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#4CAF50',
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
        color: '#4CAF50',
        fontSize: 16,
    },
    // New styles for general error message
    generalErrorContainer: {
        width: '80%',
        marginTop: 10,
    },
    generalErrorText: {
        color: 'red',
        fontSize: 14,
        textAlign: 'center',
    },
});

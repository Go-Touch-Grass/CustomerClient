import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from './commonStyles';

const { width, height } = Dimensions.get('window');

export const groupPurchaseStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        marginTop: 50,
        paddingHorizontal: 20,
    },
    headerContainer: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: 20,
        padding: 10,
        zIndex: 1,
    },
    headerText: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    listContainer: {
        padding: 10,
        paddingHorizontal: 20,
    },
    groupItem: {
        backgroundColor: Colors.white,
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    groupHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    groupTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.lightGreen,
        marginBottom: 5,
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 8,
    },
    groupStatus: {
        fontSize: 14,
        fontWeight: 'bold',
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    fullStatus: {
        color: Colors.green,
    },
    notFullStatus: {
        color: '#ff9800',
    },
    paymentStatus: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    completedPayment: {
        color: Colors.green,
    },
    pendingPayment: {
        color: '#ff9800',
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    infoText: {
        fontSize: 16,
        color: Colors.tertiary,
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Colors.green,
        marginVertical: 10,
    },
    shareContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    shareText: {
        fontSize: 16,
        color: Colors.green,
        marginLeft: 5,
    },
    actionButton: {
        backgroundColor: Colors.green,
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
        width: '100%',
    },
    buttonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    inputContainer: {
        width: '100%',
        padding: 15,
        paddingHorizontal: 20,
    },
    label: {
        fontSize: 16,
        color: Colors.tertiary,
        marginBottom: 8,
    },
    input: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 12,
        fontSize: 16,
        width: '100%',
        marginBottom: 15,
    },
    error: {
        color: Colors.red,
        fontSize: 14,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        paddingHorizontal: 20,
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    toggleButton: {
        flex: 1,
        padding: 12,
        borderRadius: 5,
        marginHorizontal: 5,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.green,
    },
    activeButton: {
        backgroundColor: Colors.green,
    },
    toggleButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.tertiary,
    },
    activeButtonText: {
        color: Colors.white,
    },
    emptyListText: {
        fontSize: 16,
        color: Colors.gray,
        textAlign: 'center',
        marginTop: 20,
    }
});
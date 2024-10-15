import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from './commonStyles';

const { width, height } = Dimensions.get('window');

export const BusinessAvatarShopboxStyles = StyleSheet.create({
    shopBox: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: height * 0.7,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    shopTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        color: Colors.primary,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    backButtonText: {
        fontSize: 16,
        color: Colors.primary,
        marginLeft: 5,
    },
    vouchersList: {
        flex: 1,
    },
    voucherItem: {
        flexDirection: 'row',
        backgroundColor: Colors.lightGray,
        borderRadius: 10,
        marginBottom: 15,
        overflow: 'hidden',
    },
    voucherImage: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
    },
    voucherDetails: {
        flex: 1,
        padding: 10,
        justifyContent: 'space-between',
    },
    voucherName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 5,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    originalPrice: {
        fontSize: 14,
        color: Colors.gray,
        textDecorationLine: 'line-through',
        marginRight: 10,
    },
    discountedPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.green,
    },
    discountBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: Colors.red,
        borderRadius: 15,
        padding: 5,
    },
    discountText: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 12,
    },
    noVouchersText: {
        fontSize: 16,
        color: Colors.gray,
        textAlign: 'center',
        marginTop: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: width * 0.8,
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: Colors.primary,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    quantityButton: {
        backgroundColor: Colors.lightGray,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    quantityButtonText: {
        fontSize: 24,
        color: Colors.primary,
    },
    quantityInput: {
        width: 50,
        height: 40,
        textAlign: 'center',
        fontSize: 18,
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: Colors.lightGray,
        borderRadius: 5,
    },
    totalCost: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: Colors.primary,
    },
    confirmButton: {
        backgroundColor: Colors.green,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
    },
    confirmButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        paddingVertical: 10,
    },
    cancelButtonText: {
        color: Colors.primary,
        fontSize: 16,
    },
    successMessageContainer: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        backgroundColor: Colors.green,
        padding: 10,
        borderRadius: 5,
    },
    successMessageText: {
        color: Colors.white,
        textAlign: 'center',
        fontSize: 16,
    },
    rewardItemImage: {
        width: 40,
        height: 40,
        position: 'absolute',
        top: 50,
        right: 10,
        borderRadius: 25,
    },
});

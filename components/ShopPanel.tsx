import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../styles/commonStyles';
import { BusinessAvatarShopboxStyles } from '../styles/BusinessAvatarShopboxStyles';
import { BranchInfo, SubscriptionInfo } from '../api/businessApi';
import { Voucher, purchaseVouchers, startGroupPurchase } from '../api/voucherApi';
import { customerCashback } from '../api/userApi';
import { activateXpDoubler, awardXP, showXPAlert, XP_REWARDS } from '../utils/xpRewards';
import { useTranslation } from 'react-i18next';
// import { IP_ADDRESS } from '@env';

interface ShopPanelProps {
    selectedBranch: BranchInfo;
    vouchers: Voucher[];
    onClose: () => void;
    navigation: any;
}

const ShopPanel: React.FC<ShopPanelProps> = ({ selectedBranch, vouchers, onClose, navigation }) => {
    const { t } = useTranslation();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState<Voucher>();
    const [quantity, setQuantity] = useState(1);
    const [successMessage, setSuccessMessage] = useState('');
    const [timerMessage, setTimerMessage] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const entityName = selectedBranch.entityType === 'Business_register_business'
        ? selectedBranch.entityName
        : selectedBranch.outletName;

    const handleGroupPurchaseStart = async (voucher: Voucher) => {
        try {
            const response = await startGroupPurchase(voucher);
            navigation.navigate('GroupPurchase', { groupPurchaseId: response.id });
        } catch (error) {
            setError(error instanceof Error ? error.message : String(error));
        }
    };

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 8000);

            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    return (
        <View style={BusinessAvatarShopboxStyles.shopBox}>
            <Text style={BusinessAvatarShopboxStyles.shopTitle}>{`${entityName}'s Shop`}</Text>

            <TouchableOpacity onPress={onClose} style={BusinessAvatarShopboxStyles.backButton}>
                <Ionicons name="arrow-back" size={24} color={Colors.primary} />
                <Text style={BusinessAvatarShopboxStyles.backButtonText}>{t('Back')}</Text>
            </TouchableOpacity>

            <ScrollView style={BusinessAvatarShopboxStyles.vouchersList}>
                {vouchers.length > 0 ? (
                    vouchers.map((voucher, index) => {
                        const originalPrice = Math.round(10 * voucher.price);
                        const discountedPrice = Math.round(originalPrice * (1 - voucher.discount / 100));
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    setSelectedVoucher(voucher);
                                    setQuantity(1);
                                    setModalVisible(true);
                                }}
                                style={BusinessAvatarShopboxStyles.voucherItem}
                            >
                                <Image
                                    source={voucher.voucherImage ? { uri: `http://192.168.79.142:8080/${voucher.voucherImage}` } : require('../assets/noimage.jpg')}
                                    style={BusinessAvatarShopboxStyles.voucherImage}
                                />
                                <View style={BusinessAvatarShopboxStyles.voucherDetails}>
                                    <Text style={BusinessAvatarShopboxStyles.voucherName}>{voucher.name}</Text>
                                    <View style={BusinessAvatarShopboxStyles.priceContainer}>
                                        <Text style={BusinessAvatarShopboxStyles.originalPrice}>{originalPrice} Gems</Text>
                                        <Text style={BusinessAvatarShopboxStyles.discountedPrice}>{discountedPrice} Gems</Text>

                                        {voucher.groupPurchaseEnabled && (
                                            <View style={BusinessAvatarShopboxStyles.groupPurchaseContainer}>
                                                <View style={BusinessAvatarShopboxStyles.groupInfoContainer}>
                                                    <Text style={BusinessAvatarShopboxStyles.groupInfoText}>Group Size: {voucher.groupSize}</Text>
                                                    <Text style={BusinessAvatarShopboxStyles.groupInfoText}>Group Discount: {voucher.groupDiscount}%</Text>
                                                </View>

                                                <TouchableOpacity
                                                    style={BusinessAvatarShopboxStyles.groupButton}
                                                    onPress={() => handleGroupPurchaseStart(voucher)}
                                                >
                                                    <Text style={BusinessAvatarShopboxStyles.groupButtonText}>Group Purchase</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </View>
                                    <View style={BusinessAvatarShopboxStyles.discountBadge}>
                                        <Text style={BusinessAvatarShopboxStyles.discountText}>{voucher.discount}% OFF</Text>
                                    </View>
                                </View>
                                {voucher.rewardItem && (
                                    <Image
                                        source={{ uri: `${voucher.rewardItem.filepath}` }}
                                        style={BusinessAvatarShopboxStyles.rewardItemImage}
                                    />
                                )}
                            </TouchableOpacity>
                        );
                    })
                ) : (
                    <Text style={BusinessAvatarShopboxStyles.noVouchersText}>{t('No vouchers available')}</Text>
                )}
            </ScrollView>

            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={BusinessAvatarShopboxStyles.modalOverlay}>
                    <View style={BusinessAvatarShopboxStyles.modalContainer}>
                        <Text style={BusinessAvatarShopboxStyles.modalTitle}>
                            Purchase {selectedVoucher?.name}
                        </Text>

                        <View style={BusinessAvatarShopboxStyles.quantityContainer}>
                            <TouchableOpacity
                                onPress={() => setQuantity(prev => Math.max(1, prev - 1))}
                                style={BusinessAvatarShopboxStyles.quantityButton}
                            >
                                <Text style={BusinessAvatarShopboxStyles.quantityButtonText}>-</Text>
                            </TouchableOpacity>
                            <TextInput
                                style={BusinessAvatarShopboxStyles.quantityInput}
                                value={String(quantity)}
                                onChangeText={text => setQuantity(Number(text))}
                                keyboardType="numeric"
                            />
                            <TouchableOpacity
                                onPress={() => setQuantity(prev => prev + 1)}
                                style={BusinessAvatarShopboxStyles.quantityButton}
                            >
                                <Text style={BusinessAvatarShopboxStyles.quantityButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>

                        {selectedVoucher && (
                            <Text style={BusinessAvatarShopboxStyles.totalCost}>
                                Total Cost: {Math.round(10 * selectedVoucher.price * (1 - selectedVoucher.discount / 100) * quantity)} Gems
                            </Text>
                        )}

                        <TouchableOpacity
                            onPress={async () => {
                                try {
                                    if (!selectedVoucher) {
                                        console.error('No voucher selected');
                                        return;
                                    }
                                    if (quantity > 1) {
                                        for (let i = 0; i < quantity; i++) {
                                            await purchaseVouchers(String(selectedVoucher.listing_id));
                                        }
                                    } else {
                                        await purchaseVouchers(String(selectedVoucher.listing_id));
                                    }
                                    customerCashback(1);
                                    activateXpDoubler();
                                    const xpResult = await awardXP(XP_REWARDS.PURCHASE_VOUCHER);
                                    setSuccessMessage(`Your Voucher has been added to your Inventory! You have earned 1 Gem as cashback!`);
                                    showXPAlert(xpResult);
                                    setTimerMessage(true);
                                    setTimeout(() => setTimerMessage(false), 10000);
                                    setModalVisible(false);
                                } catch (error) {
                                    console.error('Please top up more gems first!');
                                }
                            }}
                            style={BusinessAvatarShopboxStyles.confirmButton}
                        >
                            <Text style={BusinessAvatarShopboxStyles.confirmButtonText}>Confirm Purchase</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            style={BusinessAvatarShopboxStyles.cancelButton}
                        >
                            <Text style={BusinessAvatarShopboxStyles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {successMessage && (
                <View style={BusinessAvatarShopboxStyles.successMessageContainer}>
                    <Text style={BusinessAvatarShopboxStyles.successMessageText}>{successMessage}</Text>
                </View>
            )}
        </View>
    );
};

export default ShopPanel;
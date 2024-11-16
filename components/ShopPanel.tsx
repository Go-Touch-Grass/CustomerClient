import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Image, Animated, Dimensions, Alert } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Colors } from '../styles/commonStyles';
import { BusinessAvatarShopboxStyles } from '../styles/BusinessAvatarShopboxStyles';
import { BranchInfo, SubscriptionInfo } from '../api/businessApi';
import { Voucher, purchaseVouchers, startGroupPurchase } from '../api/voucherApi';
import { customerCashback } from '../api/userApi';
import { activateXpDoubler, awardXP, showXPAlert, XP_REWARDS } from '../utils/xpRewards';
import { useTranslation } from 'react-i18next';
import { IP_ADDRESS } from '@env';
// import { IP_ADDRESS } from '@env';

interface ShopPanelProps {
    selectedBranch: BranchInfo;
    vouchers: Voucher[];
    onClose: () => void;
    navigation: any;
    onReturn?: () => void;
}

const ShopPanel: React.FC<ShopPanelProps> = ({ selectedBranch, vouchers, onClose, navigation, onReturn }) => {
    const { t } = useTranslation();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState<Voucher>();
    const [quantity, setQuantity] = useState(1);
    const [timerMessage, setTimerMessage] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const slideAnim = React.useRef(new Animated.Value(0)).current;
    const { height } = Dimensions.get('window');
    const [xpDoublerTimeLeft, setXpDoublerTimeLeft] = useState<number | null>(null);
    const [isTimerModalVisible, setIsTimerModalVisible] = useState(false);

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

    const handleClose = () => {
        Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 8
        }).start(() => {
            onClose();
            if (onReturn) onReturn();
        });
    };

    useEffect(() => {
        Animated.spring(slideAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 50,
            friction: 8
        }).start();
    }, []);

    useEffect(() => {
        if (xpDoublerTimeLeft !== null && xpDoublerTimeLeft > 0) {
            const interval = setInterval(() => {
                setXpDoublerTimeLeft(prev => (prev !== null ? prev - 1 : null));
            }, 1000);

            return () => clearInterval(interval);
        } else if (xpDoublerTimeLeft === 0) {
            setXpDoublerTimeLeft(null);
        }
    }, [xpDoublerTimeLeft]);

    const handleActivateXpDoubler = () => {
        activateXpDoubler();
        setXpDoublerTimeLeft(15 * 60);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handlePurchase = async () => {
        try {
            if (!selectedVoucher) {
                console.error('No voucher selected');
                return;
            }
            
            // Process purchases
            if (quantity > 1) {
                for (let i = 0; i < quantity; i++) {
                    await purchaseVouchers(String(selectedVoucher.listing_id));
                }
            } else {
                await purchaseVouchers(String(selectedVoucher.listing_id));
            }

            // Award cashback and handle XP
            customerCashback(1);
            handleActivateXpDoubler();
            const xpResult = await awardXP(XP_REWARDS.PURCHASE_VOUCHER);
            
            // Show purchase success alert
            Alert.alert(
                '🛍️ Purchase Successful!',
                'Your Voucher has been added to your Inventory!',
                [
                    {
                        text: 'Great!',
                        onPress: () => {
                            // Show gem cashback alert after purchase alert is dismissed
                            Alert.alert(
                                '💎 Gems Earned!',
                                'You earned 1 Gem as gem cashback!',
                                [
                                    {
                                        text: 'Nice!',
                                        onPress: () => {
                                            // Show XP alert after gem alert is dismissed
                                            showXPAlert(xpResult);
                                        }
                                    }
                                ]
                            );
                        }
                    }
                ]
            );

            setTimerMessage(true);
            setTimeout(() => setTimerMessage(false), 10000);
            setModalVisible(false);
        } catch (error) {
            console.error('Please top up more gems first!');
        }
    };

    return (
        <>
            <Animated.View style={[
                BusinessAvatarShopboxStyles.shopBox,
                {
                    transform: [{
                        translateY: slideAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [height * 0.7, 0]
                        })
                    }]
                }
            ]}>
                <View style={BusinessAvatarShopboxStyles.timerContainer}>
                    {xpDoublerTimeLeft !== null && (
                        <TouchableOpacity onPress={() => setIsTimerModalVisible(true)} style={{ padding: 10 }}>
                            <FontAwesome name="hourglass-half" size={30} color="#4F7942" />
                        </TouchableOpacity>
                    )}
                </View>
                <Text style={BusinessAvatarShopboxStyles.shopTitle}>{`${entityName}'s Shop`}</Text>

                <TouchableOpacity onPress={handleClose} style={BusinessAvatarShopboxStyles.backButton}>
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
                                        source={voucher.voucherImage ? { uri: `http://${IP_ADDRESS}:8080/${voucher.voucherImage}` } : require('../assets/noimage.jpg')}
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
            </Animated.View>

            {/* Purchase Modal */}
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
                            onPress={handlePurchase}
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

            {/* Timer Modal */}
            <Modal
                transparent={true}
                visible={isTimerModalVisible}
                animationType="fade"
                onRequestClose={() => setIsTimerModalVisible(false)}
            >
                <View style={BusinessAvatarShopboxStyles.timerModalOverlay}>
                    <View style={BusinessAvatarShopboxStyles.timerModalContainer}>
                        <Text style={BusinessAvatarShopboxStyles.timerModalTitle}>
                            XP Doubler Time Left:
                        </Text>
                        <Text style={BusinessAvatarShopboxStyles.timerModalTime}>
                            {xpDoublerTimeLeft !== null ? formatTime(xpDoublerTimeLeft) : '00:00'}
                        </Text>
                        <TouchableOpacity 
                            onPress={() => setIsTimerModalVisible(false)}
                            style={BusinessAvatarShopboxStyles.timerModalCloseButton}
                        >
                            <Text style={BusinessAvatarShopboxStyles.timerModalCloseText}>
                                Close
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Timer Message */}
            {timerMessage && (
                <View style={BusinessAvatarShopboxStyles.timerMessageContainer}>
                    <Text style={BusinessAvatarShopboxStyles.timerMessageText}>
                        XP Doubler activated! View remaining XP doubler time from the hourglass icon!
                    </Text>
                </View>
            )}
        </>
    );
};

export default ShopPanel;
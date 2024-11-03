import React, { useEffect } from 'react';
import { Modal, View, Text, StyleSheet, Animated } from 'react-native';

interface XPModalProps {
    visible: boolean;
    xpAmount: number;
    onClose: () => void;
}

const XPModal: React.FC<XPModalProps> = ({ visible, xpAmount, onClose }) => {
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        if (visible) {
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.delay(2000),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start(() => onClose());
        }
    }, [visible]);

    return (
        <Modal transparent visible={visible}>
            <View style={styles.container}>
                <Animated.View style={[styles.modal, { opacity: fadeAnim }]}>
                    <Text style={styles.text}>+{xpAmount} XP</Text>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 20,
        borderRadius: 10,
    },
    text: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default XPModal;
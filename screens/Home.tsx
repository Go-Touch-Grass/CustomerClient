import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, Animated, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import MapView from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { StyledContainer } from '../styles/commonStyles';
import { homeStyles } from '../styles/HomeStyles';
import ProtectedRoute from '../components/ProtectedRoute';
import { Colors } from '../styles/commonStyles';
import { removeToken } from '../utils/asyncStorage';

const Home: React.FC = () => {
	const navigation = useNavigation<StackNavigationProp<any>>();
	const [menuVisible, setMenuVisible] = useState(false);
	const menuAnimation = useRef(new Animated.Value(0)).current;

	const toggleMenu = (visible: boolean) => {
		setMenuVisible(visible);
		Animated.parallel([
			Animated.spring(menuAnimation, {
				toValue: visible ? 1 : 0,
				useNativeDriver: true,
				speed: 20, // Increase speed
				bounciness: 8, // Reduce bounciness for a quicker settle
			}),
			Animated.timing(menuAnimation, {
				toValue: visible ? 1 : 0,
				duration: 200, // Faster fade
				useNativeDriver: true,
			})
		]).start();
	};

	const handleMenuPress = () => {
		toggleMenu(!menuVisible);
	};

	const navigateToProfile = () => {
		toggleMenu(false);
		navigation.navigate('Profile');
	};

	const handleLogout = async () => {
		toggleMenu(false);
		await removeToken();
		navigation.replace('Login');
	};

	const menuTranslateY = menuAnimation.interpolate({
		inputRange: [0, 1],
		outputRange: [-50, 0], // Reduced distance for faster appearance
	});

	return (
		<TouchableWithoutFeedback onPress={() => menuVisible && toggleMenu(false)}>
			<StyledContainer>
				{menuVisible && (
					<TouchableWithoutFeedback onPress={() => toggleMenu(false)}>
						<View style={homeStyles.overlay} />
					</TouchableWithoutFeedback>
				)}
				<View style={homeStyles.menuContainer}>
					<TouchableOpacity style={homeStyles.menuButton} onPress={handleMenuPress}>
						<Ionicons name="menu" size={24} color={Colors.primary} />
					</TouchableOpacity>
				</View>
				<Animated.View 
					style={[
						homeStyles.menu, 
						{ 
							transform: [{ translateY: menuTranslateY }],
							opacity: menuAnimation,
							display: menuVisible ? 'flex' : 'none'
						}
					]}
				>
					<TouchableWithoutFeedback>
						<View>
							<TouchableOpacity style={homeStyles.menuItem} onPress={navigateToProfile}>
								<Text style={homeStyles.menuItemText}>Profile</Text>
							</TouchableOpacity>
							<TouchableOpacity style={homeStyles.menuItem} onPress={handleLogout}>
								<Text style={homeStyles.menuItemText}>Logout</Text>
							</TouchableOpacity>
						</View>
					</TouchableWithoutFeedback>
				</Animated.View>
				<View style={homeStyles.mapContainer}>
					<MapView
						style={homeStyles.map}
						initialRegion={{
							latitude: 37.78825,
							longitude: -122.4324,
							latitudeDelta: 0.0922,
							longitudeDelta: 0.0421,
						}}
					/>
				</View>
			</StyledContainer>
		</TouchableWithoutFeedback>
	);
};

export default ProtectedRoute(Home);

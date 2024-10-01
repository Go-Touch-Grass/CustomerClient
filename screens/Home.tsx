import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, Animated, TouchableWithoutFeedback, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import MapView, { Region, Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { StyledContainer } from '../styles/commonStyles';
import { homeStyles } from '../styles/HomeStyles';
import { CreateAvatarStyles } from '../styles/CreateAvatarStyles';
import ProtectedRoute from '../components/ProtectedRoute';
import { Colors } from '../styles/commonStyles';
import { removeToken } from '../utils/asyncStorage';
import { useTranslation } from 'react-i18next';
import { getAvatarDetails } from '../api/avatarApi';

// Define the AvatarInfo interface
interface AvatarInfo {
    avatar: string;
    customization: Record<string, any>;
}

const Home: React.FC = () => {
	const { t } = useTranslation();
	const navigation = useNavigation<StackNavigationProp<any>>();
	const [menuVisible, setMenuVisible] = useState(false);
	const menuAnimation = useRef(new Animated.Value(0)).current;
	const [region, setRegion] = useState<Region | null>(null);
	const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
	const mapRef = useRef<MapView>(null);
	const [avatar, setAvatar] = useState('');
	const [avatarDetails, setAvatarDetails] = useState<AvatarInfo | null>(null);

	useEffect(() => {
		(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				console.log('Permission to access location was denied');
				return;
			}

			let location = await Location.getCurrentPositionAsync({});
			setRegion({
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
			});
			setUserLocation(location);

			// Watch for location changes
			Location.watchPositionAsync(
				{ accuracy: Location.Accuracy.BestForNavigation, timeInterval: 1000, distanceInterval: 1 },
				(newLocation) => {
					setUserLocation(newLocation);
				}
			);

			// Fetch avatar details
			const fetchAvatarDetails = async () => {
				try {
					const details = await getAvatarDetails();
					setAvatarDetails(details);
				} catch (error) {
					console.error('Failed to fetch avatar details:', error);
				}
			};

			fetchAvatarDetails();
		})();
	}, []);


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

	const navigateToChangeLanguage = () => {
		toggleMenu(false);
		navigation.navigate('Change Language');
	};

	const handleLogout = async () => {
		toggleMenu(false);
		await removeToken();
		navigation.replace('Login');
	};

	const centerOnUserLocation = async () => {
		if (userLocation) {
			const newRegion = {
				latitude: userLocation.coords.latitude,
				longitude: userLocation.coords.longitude,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
			};
			setRegion(newRegion);
			mapRef.current?.animateToRegion(newRegion, 1000);
		}
	};

	const navigateToCreateAvatar = () => {
		toggleMenu(false);
		navigation.navigate('CreateAvatar');
	};

	const menuTranslateY = menuAnimation.interpolate({
		inputRange: [0, 1],
		outputRange: [-50, 0],
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
								<Text style={homeStyles.menuItemText}>{t('profile')}</Text>
							</TouchableOpacity>
							<TouchableOpacity style={homeStyles.menuItem} onPress={navigateToChangeLanguage}>
								<Text style={homeStyles.menuItemText}>{t('change-language')}</Text>
							</TouchableOpacity>
							<TouchableOpacity style={homeStyles.menuItem} onPress={navigateToCreateAvatar}>
								<Text style={homeStyles.menuItemText}>{t('create-avatar')}</Text>
							</TouchableOpacity>
							<TouchableOpacity style={homeStyles.menuItem} onPress={handleLogout}>
								<Text style={homeStyles.menuItemText}>{t('logout')}</Text>
							</TouchableOpacity>
						</View>
					</TouchableWithoutFeedback>
				</Animated.View>


				<View style={homeStyles.mapContainer}>
					{region && (
						<MapView
							ref={mapRef}
							style={homeStyles.map}
							region={region}
						>
							{userLocation && (
								<Marker
									coordinate={{
										latitude: userLocation.coords.latitude,
										longitude: userLocation.coords.longitude,
									}}
									title="You are here"
									description="Your current location"
									anchor={{ x: 0.5, y: 0.5 }}
								>
									<View style={homeStyles.markerContainer}>
										{avatarDetails ? (
											<Image 
												source={{ uri: avatarDetails.avatar }}
												style={homeStyles.avatarImage}
											/>
										) : (
											<View style={homeStyles.markerBackground}>
												<View style={homeStyles.markerDot} />
											</View>
										)}
									</View>
								</Marker>
							)}
						</MapView>
					)}
					<TouchableOpacity
						style={homeStyles.centerButton}
						onPress={centerOnUserLocation}
					>
						<Ionicons name="locate" size={24} color="black" />
					</TouchableOpacity>
				</View>
				{/* Avatar Container */}
				<View style={CreateAvatarStyles.avatarContainer}>
					{avatarDetails ? (
						<Image source={{ uri: avatarDetails.avatar }} style={CreateAvatarStyles.avatarImage} />
					) : (
						<Text style={{ textAlign: 'center' }}>{t('no-avatar')}</Text>
					)}
				</View>
				<View style={CreateAvatarStyles.avatarContainer}>
					{avatar ? (
						<Image source={{ uri: avatar }} style={CreateAvatarStyles.avatarImage} />
					) : (
						<Text style={{ textAlign: 'center' }}>{t('no-avatar')}</Text>
					)}
				</View>
			</StyledContainer>
		</TouchableWithoutFeedback>
	);
};

export default ProtectedRoute(Home);
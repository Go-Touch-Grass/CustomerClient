import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, Animated, TouchableWithoutFeedback, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import MapView, { Region, Marker, Camera } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { StyledContainer } from '../styles/commonStyles';
import { homeStyles } from '../styles/HomeStyles';
import ProtectedRoute from '../components/ProtectedRoute';
import { Colors } from '../styles/commonStyles';
import { removeToken } from '../utils/asyncStorage';
import { useTranslation } from 'react-i18next';
import { getAvatarByCustomerId, getAvatarByBusinessRegistrationId, getAvatarByOutletId } from '../api/avatarApi';
import { AvatarInfo } from '../api/businessApi';
import { getUserInfo } from '../api/userApi';
import { HomeScreenAvatarStyles } from '../styles/HomeScreenAvatarStyles';
import { DeviceMotion } from 'expo-sensors';
import AppMenu from '../components/AppMenu';
import { getAllSubscription, SubscriptionInfo } from '../api/businessApi';
import axios from 'axios';
interface GeocodeResult {
  latitude: number;
  longitude: number;
}

const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [menuVisible, setMenuVisible] = useState(false);
  const menuAnimation = useRef(new Animated.Value(0)).current;
  const [region, setRegion] = useState<Region | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const mapRef = useRef<MapView>(null);
  const [avatar, setAvatar] = useState<AvatarInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarSize, setAvatarSize] = useState(85);
  const [direction, setDirection] = useState(0);
  const [mapHeading, setMapHeading] = useState(0);
  const [subscriptions, setSubscriptions] = useState<SubscriptionInfo[]>([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const initialRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.00415,
        longitudeDelta: 0.00415,
      };
      setRegion(initialRegion);
      setUserLocation(location);

      // Watch for location changes
      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.BestForNavigation, timeInterval: 1000, distanceInterval: 1 },
        (newLocation) => {
          setUserLocation(newLocation);
        },
      );
    })();

    fetchAvatarDetails();
    fetchSubscriptions();
  }, []);

const fetchSubscriptions = async () => {
  try {
    const subscriptionData = await getAllSubscription();
    console.log('Fetched Subscription Data:', subscriptionData);

    // Fetch avatars and geocode each subscription's location
    const subscriptionsWithAvatars = await Promise.all(subscriptionData.map(async (subscription) => {
      const { branch } = subscription;

      // Geocode the branch location to get latitude and longitude
      let coordinates: { latitude: number; longitude: number } | null = null;
      if (branch.location) {
        try {
          coordinates = await geocodeLocation(branch.location);
        } catch (error) {
          console.error(`Error geocoding location "${branch.location}":`, error);
        }
      }
      try {
        let detailedAvatar;
        // Check the entity type and fetch the appropriate avatar
        if (branch.entityType === 'Outlet') {
          if (branch.outletId !== undefined) { 
            detailedAvatar = await getAvatarByOutletId(branch.outletId);
          } else {
            console.warn(`Outlet ID is undefined for subscription ${subscription.subscriptionId}`);
            return {
              ...subscription,
              branch: {
                ...branch,
                avatar: null, 
                coordinates,
              },
            };
          }
        } else if (branch.entityType === 'Business_register_business') {
          if (branch.registrationId !== undefined) { 
            detailedAvatar = await getAvatarByBusinessRegistrationId(branch.registrationId);
          } else {
            console.warn(`Registration ID is undefined for subscription ${subscription.subscriptionId}`);
            return {
              ...subscription,
              branch: {
                ...branch,
                avatar: null, 
                coordinates,
              },
            };
          }
        }
      
        return {
          ...subscription,
          branch: {
            ...branch,
            avatar: detailedAvatar,
            coordinates, // Add the coordinates to the branch
          },
        };
      } catch (error) {
        console.error(`Error fetching avatar for subscription ${subscription.subscriptionId}:`, error);
      }
      

      return {
        ...subscription,
        branch: {
          ...branch,
          coordinates, // Add the coordinates to the branch even if avatar fetching fails
        },
      };
    }));

    setSubscriptions(subscriptionsWithAvatars as SubscriptionInfo[]); // Store updated subscriptions in state
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
  } finally {
    setIsLoading(false);
  }
};

const geocodeLocation = async (location: string): Promise<GeocodeResult> => {
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&apiKey=e0a70d13ff6640aa8172c4caf76f2ab5`;
  console.log(`Geocoding request to: ${url}`); // Log the request URL
  
  try {
    const response = await axios.get(url);

    // Check if response data has features and is not empty
    if (response.data && response.data.features && response.data.features.length > 0) {
      // Extract the first feature's geometry coordinates
      const { geometry } = response.data.features[0];
      const [longitude, latitude] = geometry.coordinates; // coordinates are in [lon, lat] format
      console.log('Geocoded Coordinates:', [latitude, longitude])
      return { latitude, longitude };
    } else {
      throw new Error('No results found for the provided address.');
    }
  } catch (error) {
    console.error('Geocoding request failed:', error); // More detailed error logging
    throw error; // Re-throw for upstream handling
  }
};

  
  const subscribeToDeviceMotion = () => {
    const subscription = DeviceMotion.addListener(({ rotation }) => {
      if (rotation) {
        setDirection(rotation.alpha + 1.39626);
      }
    });
  
    DeviceMotion.setUpdateInterval(100);
    return () => {
      subscription.remove(); // Clean up the listener
    };
  };
  
  useEffect(() => {
    const unsubscribe = subscribeToDeviceMotion();
    return () => {
      unsubscribe();
    };
  }, []);
  
  useEffect(() => {
    if (region) {
      adjustAvatarSizeBasedOnZoom(region.latitudeDelta);
    }
  }, [region]);
  
  const updateMapHeading = async () => {
    if (mapRef.current) {
      const camera: Camera = await mapRef.current.getCamera();
      setMapHeading(camera.heading || 0); 
    }
  };

  const fetchAvatarDetails = async () => {
    try {
      const userInfo = await getUserInfo();
      const avatarDetails = await getAvatarByCustomerId(parseInt(userInfo.id));
      setAvatar(avatarDetails);
    } catch (error) {
      console.error('Error fetching avatar details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const adjustAvatarSizeBasedOnZoom = (latitudeDelta: number) => {
    const baseSize = 85; 
    const zoomFactor = 4000; 
    const size = baseSize - (latitudeDelta * zoomFactor); 
    setAvatarSize(Math.max(size, 25)); 
  };

  const toggleMenu = (visible: boolean) => {
    setMenuVisible(visible);
    Animated.parallel([
      Animated.spring(menuAnimation, {
        toValue: visible ? 1 : 0,
        useNativeDriver: true,
        speed: 20, 
        bounciness: 8, 
      }),
      Animated.timing(menuAnimation, {
        toValue: visible ? 1 : 0,
        duration: 200, 
        useNativeDriver: true,
      }),
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

  const navigateToGetAvatar = () => {
    toggleMenu(false);
    navigation.navigate('GetAvatar');
  };

  const navigateToEditAvatar = () => {
    toggleMenu(false);
    navigation.navigate('EditAvatar');
  };

  const handleLogout = async () => {
    toggleMenu(false);
    await removeToken();
    navigation.replace('Login');
  };

  const navigateToStore = () => {
    toggleMenu(false);
    navigation.navigate('Store');
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

  const menuTranslateY = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 0],
  });

  const renderSubscriptionMarkers = () => {
    return subscriptions.map((subscription) => {
      const { branch } = subscription;
      if (!branch || !branch.coordinates) return null; // Check if branch or coordinates exist
  
      // Now we can safely access latitude and longitude
      const { latitude, longitude } = branch.coordinates; 
  
      if (latitude === undefined || longitude === undefined) return null; // Ensure valid coordinates
  
      // Ensure branch.avatar is of type AvatarInfo and has properties
      const avatar = branch.avatar as AvatarInfo;
  
      return (
        <Marker
          coordinate={{
            latitude, // Use latitude
            longitude, // Use longitude
          }}
        >
          <View style={styles.avatarContainer}>
            {avatar.base && <Image source={{ uri: avatar.base.filepath }} style={styles.base} />}
            {avatar.hat && <Image source={{ uri: avatar.hat.filepath }} style={styles.hat} />}
            {avatar.shirt && <Image source={{ uri: avatar.shirt.filepath }} style={styles.upperWear} />}
            {avatar.bottom && <Image source={{ uri: avatar.bottom.filepath }} style={styles.lowerWear} />}
            
            {/* Render the entity name below the avatar */}
            <Text style={homeStyles.entityNameText}>
            {branch.entityType === 'Business_register_business' 
              ? branch.entityName 
              : branch.outletName}
            </Text>
          </View>
        </Marker>
      );
    });
  };
  
  const styles = HomeScreenAvatarStyles(avatarSize);

  const renderAvatarMarker = () => {
    if (!avatar || !userLocation) return null;

    const combinedRotation = direction + (mapHeading * (Math.PI / 180));

    return (
      <Marker
        coordinate={{
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
        }}
        anchor={{ x: 0.5, y: 0.5 }}
      >
        <View style={styles.avatarContainer}>
          <Image source={require('../assets/sprites/avatar_base.png')} style={styles.avatar} />
          {avatar.hat && <Image source={{ uri: avatar.hat.filepath }} style={styles.hat} /> }
          {avatar.shirt && <Image source={{ uri: avatar.shirt.filepath }} style={styles.upperWear} />}
          {avatar.bottom && <Image source={{ uri: avatar.bottom.filepath }} style={styles.lowerWear} />}

          {/* Direction Indicator */}
          <View style={{
            position: 'absolute',
            bottom: avatarSize * -0.65, 
            left: '50%',
            transform: [
              { translateX: -15 }, 
              { rotate: `${-combinedRotation}rad` }
            ],
          }}>
            <Ionicons name="arrow-up-circle" size={30} color="blue" />
          </View>
        </View>
      </Marker>
    );
  };

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
            <Ionicons name="menu" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <AppMenu
          visible={menuVisible}
          menuAnimation={menuAnimation}
          toggleMenu={toggleMenu}
          navigation={navigation}
        />

        <View style={homeStyles.mapContainer}>
          {region && (
            <MapView
              ref={mapRef}
              style={homeStyles.map}
              region={region}
              onRegionChangeComplete={(newRegion) => {
                setRegion(newRegion);
                updateMapHeading();
              }}       
            >
              {isLoading ? (
                <ActivityIndicator size="large" color="#00AB41" />
              ) : (
                <>
                  {renderAvatarMarker()}
                  {renderSubscriptionMarkers()}
                </>
              )}
            </MapView>
          )}
          <TouchableOpacity style={homeStyles.centerButton} onPress={centerOnUserLocation}>
            <Ionicons name="locate" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </StyledContainer>
    </TouchableWithoutFeedback>
  );
};

export default ProtectedRoute(Home);

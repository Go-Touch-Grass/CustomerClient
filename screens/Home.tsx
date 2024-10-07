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
import { getAvatarByCustomerId, AvatarInfo } from '../api/avatarApi';
import { getUserInfo } from '../api/userApi';
import { HomeScreenAvatarStyles } from '../styles/HomeScreenAvatarStyles';
import { DeviceMotion } from 'expo-sensors';
import AppMenu from '../components/AppMenu';

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
  }, []);

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

  const navigateToStore = () => {
    toggleMenu(false);
    navigation.navigate('Store');
  };

  const menuTranslateY = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 0],
  });


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
              {isLoading ? (<ActivityIndicator size="large" color="#00AB41" />) : (renderAvatarMarker())}
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

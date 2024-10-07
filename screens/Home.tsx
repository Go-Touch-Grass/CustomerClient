import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, Animated, TouchableWithoutFeedback, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import MapView, { Region, Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { StyledContainer } from '../styles/commonStyles';
import { homeStyles } from '../styles/HomeStyles';
import ProtectedRoute from '../components/ProtectedRoute';
import { Colors } from '../styles/commonStyles';
import { removeToken } from '../utils/asyncStorage';
import { useTranslation } from 'react-i18next';
import AppMenu from '../components/AppMenu';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [menuVisible, setMenuVisible] = useState(false);
  const menuAnimation = useRef(new Animated.Value(0)).current;
  const [region, setRegion] = useState<Region | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const mapRef = useRef<MapView>(null);

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
        },
      );
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

  const navigateToCreateAvatar = () => {
    toggleMenu(false);
    navigation.navigate('CreateAvatar');
  };

  const navigateToStore = () => {
    toggleMenu(false);
    navigation.navigate('Store');
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
            <MapView ref={mapRef} style={homeStyles.map} region={region}>
              {userLocation && (
                <Marker
                  coordinate={{
                    latitude: userLocation.coords.latitude,
                    longitude: userLocation.coords.longitude,
                  }}
                  title="You are here"
                  description="Your current location"
                  anchor={{ x: 0.5, y: 0.5 }}
                ></Marker>
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

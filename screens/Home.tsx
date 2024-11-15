import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, Animated, TouchableWithoutFeedback, Image, ActivityIndicator, ScrollView, Modal, FlatList, TextInput } from 'react-native';
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
import { customerCashback, getUserInfo } from '../api/userApi';
import { HomeScreenAvatarStyles } from '../styles/HomeScreenAvatarStyles';
import { BusinessAvatarShopboxStyles } from '../styles/BusinessAvatarShopboxStyles';
import { DeviceMotion } from 'expo-sensors';
import AppMenu from '../components/AppMenu';
import { getAllSubscription, SubscriptionInfo, BranchInfo } from '../api/businessApi';
import axios from 'axios';
import { GEOAPIFY_API_KEY } from '@env';
import { Voucher, getAllVouchers, purchaseVouchers, startGroupPurchase } from '../api/voucherApi';
import { useIsFocused } from '@react-navigation/native';
import { IP_ADDRESS } from '@env';
import { activateXpDoubler, awardXP, showXPAlert, XP_REWARDS } from '../utils/xpRewards';
import { FontAwesome } from '@expo/vector-icons';
import SearchBar  from '../components/SearchBar'

interface GeocodeResult {
  latitude: number;
  longitude: number;
}

const RADIUS_THRESHOLD = 500; // in meters

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
  const [selectedBranch, setSelectedBranch] = useState<BranchInfo | null>(null);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher>();
  const [quantity, setQuantity] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [timerMessage, setTimerMessage] = useState(false);
  const isFocused = useIsFocused();
  const [labelVisible, setLabelVisible] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [messageVisible, setMessageVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [xpDoublerTimeLeft, setXpDoublerTimeLeft] = useState<number | null>(null);
  const [isTimerModalVisible, setIsTimerModalVisible] = useState(false);

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
          setRegion({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            latitudeDelta: 0.00415,
            longitudeDelta: 0.00415,
          });
        },
      ); 
    })();

    fetchAvatarDetails();
    fetchSubscriptions();
  }, []); 
  /* useEffect(() => {
    const initialRegion = {
      latitude: 1.374996062398145,
      longitude: 103.95815594284734,
      latitudeDelta: 0.00415,
      longitudeDelta: 0.00415,
    };
    setRegion(initialRegion);

    // Set user location based on the hardcoded coordinates
    setUserLocation({
      coords: {
        latitude: 1.374996062398145,
        longitude: 103.95815594284734,
        altitude: null,
        accuracy: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    });

    fetchAvatarDetails();
    fetchSubscriptions();
  }, []); */
  
  const handleBranchSelect = (branch: BranchInfo) => {
    const { coordinates } = branch;
    if (coordinates) {
      const { latitude, longitude } = coordinates;
      mapRef.current?.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
      setSelectedBranchId(branch.entityType === 'Business_register_business' ? String(branch.registrationId) : String(branch.outletId));
      setLabelVisible(true);
      setTimeout(() => setLabelVisible(false), 3000);
    }
  };

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
      }));

      setSubscriptions(subscriptionsWithAvatars as SubscriptionInfo[]); // Store updated subscriptions in state
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const geocodeLocation = async (location: string): Promise<GeocodeResult> => {
    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&apiKey=${GEOAPIFY_API_KEY}`;
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
        latitude: 1.374996062398145,//userLocation.coords.latitude,
        longitude: 103.95815594284734,//userLocation.coords.longitude,
        latitudeDelta: 0.00415,
        longitudeDelta: 0.00415,
      };
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1000);

      await fetchSubscriptions();
    }
  };
  
  const menuTranslateY = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 0],
  });

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // in meters
    return distance;
  };

  const calculateRoamingCoordinates = (
    branchLat: number,
    branchLng: number,
    userLat: number,
    userLng: number,
    distance: number
  ) => {
    const toRadians = (degrees: number) => degrees * (Math.PI / 180);
    const toDegrees = (radians: number) => radians * (180 / Math.PI);

    const earthRadius = 6371e3; // Earth's radius in meters
    const distanceInMeters = distance * 1000;

    const branchLatRad = toRadians(branchLat);
    const branchLngRad = toRadians(branchLng);
    const userLatRad = toRadians(userLat);
    const userLngRad = toRadians(userLng);

    const bearing = Math.atan2(
      Math.sin(userLngRad - branchLngRad) * Math.cos(userLatRad),
      Math.cos(branchLatRad) * Math.sin(userLatRad) -
      Math.sin(branchLatRad) * Math.cos(userLatRad) * Math.cos(userLngRad - branchLngRad)
    );

    const newLatRad = Math.asin(
      Math.sin(branchLatRad) * Math.cos(distanceInMeters / earthRadius) +
      Math.cos(branchLatRad) * Math.sin(distanceInMeters / earthRadius) * Math.cos(bearing)
    );

    const newLngRad =
      branchLngRad +
      Math.atan2(
        Math.sin(bearing) * Math.sin(distanceInMeters / earthRadius) * Math.cos(branchLatRad),
        Math.cos(distanceInMeters / earthRadius) - Math.sin(branchLatRad) * Math.sin(newLatRad)
      );

    return {
      latitude: toDegrees(newLatRad),
      longitude: toDegrees(newLngRad),
    };
  };

  const handleGroupPurchaseStart = async (voucher: Voucher) => {
    // Logic for initiating a group purchase or navigating to the group purchase flow
    console.log(`Initiating group purchase for voucher: ${voucher.listing_id}`);
    try {
      const response = await startGroupPurchase(voucher);
      //console.log("passing groupPurchase Id over", response.id);
      navigation.navigate('GroupPurchase', { groupPurchaseId: response.id });
    } catch (error) {
      //console.error('Error starting group purchase:', error.response?.data || error.message);
      setError(error instanceof Error ? error.message : String(error));
      //alert(error.response?.data.message || 'Error starting group purchase.');
    }
  };
  const handleActivateXpDoubler = () => {
    activateXpDoubler();
    setXpDoublerTimeLeft(15 * 60); 
  };

  useEffect(() => {
    if (xpDoublerTimeLeft !== null && xpDoublerTimeLeft > 0) {
        const interval = setInterval(() => {
            setXpDoublerTimeLeft(prev => (prev !== null ? prev - 1 : null));
        }, 1000);

        return () => clearInterval(interval);
    } else if (xpDoublerTimeLeft === 0) {
        setXpDoublerTimeLeft(null); // Clear the timer when it runs out
    }
  }, [xpDoublerTimeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderSubscriptionMarkers = () => {
    return subscriptions.flatMap((subscription) => {
      const { branch } = subscription;
      if (!branch || !branch.coordinates) return [];

      const { latitude, longitude } = branch.coordinates;
      if (latitude === undefined || longitude === undefined) return [];

      const avatar = branch.avatar as AvatarInfo;
      const markers = [];

      // Function to handle marker press
      const handleMarkerPress = (targetBranch: BranchInfo, isRoaming = false) => {
        const { coordinates } = targetBranch;
        if (!coordinates) {
          console.warn('Branch coordinates are not available.');
          return;
        }

        const { latitude, longitude } = coordinates;
        if (!userLocation) {
          console.warn('User location not available.');
          return;
        }

        const userLatitude = userLocation.coords.latitude;
        const userLongitude = userLocation.coords.longitude;

        const distanceToAvatar = calculateDistance(
          userLatitude,
          userLongitude,
          latitude,
          longitude
        );

        if (distanceToAvatar <= RADIUS_THRESHOLD && !isRoaming) {
          setSelectedBranch(targetBranch);
          setIsShopOpen(true);
        } else if (isRoaming) {
          const roamingCoordinates = calculateRoamingCoordinates(
            latitude,
            longitude,
            userLocation.coords.latitude,
            userLocation.coords.longitude,
            subscription.distanceCoverage
          );
          const distanceToRoamingAvatar = calculateDistance(
            userLatitude,
            userLongitude,
            roamingCoordinates.latitude,
            roamingCoordinates.longitude
          );

          if (distanceToRoamingAvatar <= 500 && branch.coordinates) {
            // Proceed with the normal logic for roaming avatar
            mapRef.current?.animateToRegion({
              latitude: branch.coordinates.latitude,
              longitude: branch.coordinates.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            });
            setSelectedBranchId(branch.entityType === 'Business_register_business' ? String(branch.registrationId) : String(branch.outletId));
            setLabelVisible(true);
            setTimeout(() => setLabelVisible(false), 3000);
          } else {
            // Show message if user is too far from the roaming avatar
            setMessageVisible(true);
            setTimeout(() => setMessageVisible(false), 3000);
          }
        } else {
          navigation.navigate('BusinessAvatarInfo', {
            entityType: branch.entityType,
            entityName: branch.entityType === 'Business_register_business' ? branch.entityName : branch.outletName,
            location: branch.location,
            category: branch.entityType === 'Business_register_business' ? branch.category : null,
            description: branch.entityType === 'Outlet' ? branch.description : null,
            coordinates: {
              latitude: branch.coordinates?.latitude,
              longitude: branch.coordinates?.longitude
            }
          });
        }
      };

      // Render the actual branch avatar marker
      markers.push(
        <Marker
          coordinate={{ latitude, longitude }}
          onPress={() => handleMarkerPress(branch)}
        > 
          <View style={styles.avatarContainer}>
            {avatar.base && <Image source={{ uri: avatar.base.filepath }} style={styles.base} />}
            {avatar.hat && <Image source={{ uri: avatar.hat.filepath }} style={styles.hat} />}
            {avatar.shirt && <Image source={{ uri: avatar.shirt.filepath }} style={styles.upperWear} />}
            {avatar.bottom && <Image source={{ uri: avatar.bottom.filepath }} style={styles.lowerWear} />}
            <Text style={homeStyles.entityNameText} numberOfLines={2}>
              {branch.entityType === 'Business_register_business'
                ? branch.entityName
                : branch.outletName}
            </Text>
            {/* Label for the Up arrows */}
            {selectedBranchId === (branch.entityType === 'Business_register_business' ? String(branch.registrationId) : String(branch.outletId)) && labelVisible && (
              <View>
                <Text style={homeStyles.labelText}>↑↑↑</Text>
              </View>
            )}
          </View>
        </Marker>
      );

      // Render roaming avatar if distanceCoverage > 0
      if (subscription.distanceCoverage > 0 && userLocation) {
        const roamingCoordinates = calculateRoamingCoordinates(
          latitude,
          longitude,
          userLocation.coords.latitude,
          userLocation.coords.longitude,
          subscription.distanceCoverage
        );

        markers.push(
          <Marker
            coordinate={roamingCoordinates}
            onPress={() => handleMarkerPress(branch, true)}
          >
            <View style={styles.avatarContainer}>
              {avatar.base && <Image source={{ uri: avatar.base.filepath }} style={styles.base} />}
              {avatar.hat && <Image source={{ uri: avatar.hat.filepath }} style={styles.hat} />}
              {avatar.shirt && <Image source={{ uri: avatar.shirt.filepath }} style={styles.upperWear} />}
              {avatar.bottom && <Image source={{ uri: avatar.bottom.filepath }} style={styles.lowerWear} />}
              <Text style={homeStyles.entityNameText} numberOfLines={2}>
                [ROAMING] {branch.entityType === 'Business_register_business'
                  ? branch.entityName
                  : branch.outletName}
              </Text>
            </View>
          </Marker>
        );
      }

      return markers;
    });
  };


  useEffect(() => {
    const fetchVouchers = async () => {
      if (!selectedBranch || !isFocused) return;

      try {
        let fetchedVouchers;
        if (selectedBranch.entityType === 'Business_register_business') {
          console.log('Fetching vouchers for Registration ID:', selectedBranch.registrationId);
          fetchedVouchers = await getAllVouchers(selectedBranch.registrationId);
        } else if (selectedBranch.entityType === 'Outlet') {
          console.log('Fetching vouchers for Outlet ID:', selectedBranch.outletId);
          fetchedVouchers = await getAllVouchers(undefined, selectedBranch.outletId);
        }
        console.log('Fetched Vouchers:', fetchedVouchers);
        setVouchers(fetchedVouchers?.vouchers || []);
      } catch (error) {
        console.error('Error fetching vouchers:', error);
      }
    };

    fetchVouchers();
  }, [selectedBranch, isFocused]);

  const renderShopBox = () => {
    if (!selectedBranch) return null;

    const entityName = selectedBranch.entityType === 'Business_register_business'
      ? selectedBranch.entityName
      : selectedBranch.outletName;

    return (
      <View style={BusinessAvatarShopboxStyles.shopBox}>
        <Text style={BusinessAvatarShopboxStyles.shopTitle}>{`${entityName}'s Shop`}</Text>

        <TouchableOpacity onPress={() => setIsShopOpen(false)} style={BusinessAvatarShopboxStyles.backButton}>
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

                          <TouchableOpacity style={BusinessAvatarShopboxStyles.groupButton} onPress={() => handleGroupPurchaseStart(voucher)}>
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

        {/* Modal for Purchasing Vouchers */}
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

              {/* Quantity Selection */}
              <View style={BusinessAvatarShopboxStyles.quantityContainer}>
                <TouchableOpacity onPress={() => setQuantity(prev => Math.max(1, prev - 1))} style={BusinessAvatarShopboxStyles.quantityButton}>
                  <Text style={BusinessAvatarShopboxStyles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <TextInput
                  style={BusinessAvatarShopboxStyles.quantityInput}
                  value={String(quantity)}
                  onChangeText={text => setQuantity(Number(text))}
                  keyboardType="numeric"
                />
                <TouchableOpacity onPress={() => setQuantity(prev => prev + 1)} style={BusinessAvatarShopboxStyles.quantityButton}>
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
                      customerCashback(1);
                      handleActivateXpDoubler();
                      const xpResult = await awardXP(XP_REWARDS.PURCHASE_VOUCHER);
                      setSuccessMessage(`Your Voucher has been added to your Inventory! You have earned 1 Gem as cashback!`);
                      showXPAlert(xpResult);
                      setTimerMessage(true);
                      setTimeout(() => setTimerMessage(false), 10000);
                      setModalVisible(false);
                    } else {
                      await purchaseVouchers(String(selectedVoucher.listing_id));
                      customerCashback(1);
                      handleActivateXpDoubler();
                      const xpResult = await awardXP(XP_REWARDS.PURCHASE_VOUCHER);
                      setSuccessMessage(`Your Voucher has been added to your Inventory! You have earned 1 Gem as cashback!`);
                      showXPAlert(xpResult);
                      setTimerMessage(true);
                      setTimeout(() => setTimerMessage(false), 10000);
                      setModalVisible(false);
                    }
                  } catch (error) {
                    console.error('Please top up more gems first!');
                  }
                }}
                style={BusinessAvatarShopboxStyles.confirmButton}
              >
                <Text style={BusinessAvatarShopboxStyles.confirmButtonText}>Confirm Purchase</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={BusinessAvatarShopboxStyles.cancelButton}>
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

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 8000); 

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [successMessage]);

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
          {avatar.hat && <Image source={{ uri: avatar.hat.filepath }} style={styles.hat} />}
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
        
        {/* Menu Button */}
        <View style={homeStyles.menuContainer}>
          <TouchableOpacity style={homeStyles.menuButton} onPress={handleMenuPress}>
            <Ionicons name="menu" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
        
        {/* Double XP Timer */}
        <View style = {homeStyles.timer}>
          {xpDoublerTimeLeft !== null && (
            <TouchableOpacity onPress={() => setIsTimerModalVisible(true)} style={{ padding: 10 }}>
              <FontAwesome name="hourglass-half" size={30} color="#4F7942" />
            </TouchableOpacity>
          )}

          {/* Modal for showing time left */}
          <Modal
            transparent={true}
            visible={isTimerModalVisible}
            onRequestClose={() => setIsTimerModalVisible(false)}
          >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                <Text style={{ fontSize: 18 }}>XP Doubler Time Left:</Text>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                  {xpDoublerTimeLeft !== null ? formatTime(xpDoublerTimeLeft) : '00:00'}
                </Text>
                <TouchableOpacity onPress={() => setIsTimerModalVisible(false)} style={{ marginTop: 10 }}>
                  <Text style={{ color: 'green' }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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
          {/* Search Bar */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <SearchBar subscriptions={subscriptions} onBranchSelect={handleBranchSelect} />
          </View>
          <TouchableOpacity style={homeStyles.centerButton} onPress={centerOnUserLocation}>
            <Ionicons name="locate" size={24} color="black" />
          </TouchableOpacity>
          {messageVisible && (
            <View style={homeStyles.messageContainer}>
              <Text style={homeStyles.messageText}>Get closer to the Roaming avatar first!</Text>
            </View>
          )}
          {timerMessage && (
            <View style={homeStyles.timerMessageContainer}>
              <Text style={homeStyles.timerMessageText}>XP Doubler activated! View remaining XP doubler time from the hourglass icon!</Text>
            </View>
          )}
        </View>
        {/* Render the shop box if shop is open */}
        {isShopOpen && renderShopBox()}
      </StyledContainer>
    </TouchableWithoutFeedback>
  );
};


export default ProtectedRoute(Home);

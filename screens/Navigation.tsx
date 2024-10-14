import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline, Camera } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NavigationStyles } from '../styles/NavigationStyles';
import { MAPBOX_API_KEY } from '@env';
import { DeviceMotion } from 'expo-sensors';

const RADIUS_THRESHOLD = 500;

const Navigation: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [mapHeading, setMapHeading] = useState(0);
  const [direction, setDirection] = useState(0);
  const mapRef = useRef<MapView>(null);

  const { entityName, coordinates } = route.params as {
    entityName: string;
    coordinates: { latitude: number; longitude: number } | null;
  };

  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
  const [isNavigating, setIsNavigating] = useState(true);
  const [duration, setDuration] = useState<number | null>(null); // State for duration

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const subscription = Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10,
          timeInterval: 5000,
        },
        (newLocation) => {
          setUserLocation({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          });

          if (coordinates) {
            const distance = getDistance(
              { latitude: newLocation.coords.latitude, longitude: newLocation.coords.longitude },
              { latitude: coordinates.latitude, longitude: coordinates.longitude }
            );

            if (distance <= RADIUS_THRESHOLD) {
              stopNavigation();
            }
          }
        }
      );

      fetchWalkingRoute(location.coords);

      return () => {
        subscription.then(sub => sub.remove());
      };
    };

    getLocation();
  }, [coordinates]);

  const subscribeToDeviceMotion = () => {
    const subscription = DeviceMotion.addListener(({ rotation }) => {
      if (rotation) {
        setDirection(rotation.alpha + 1.39626);
      }
    });

    DeviceMotion.setUpdateInterval(100);
    return () => {
      subscription.remove();
    };
  };

  useEffect(() => {
    const unsubscribe = subscribeToDeviceMotion();
    return () => {
      unsubscribe();
    };
  }, []);

  const updateMapHeading = async () => {
    if (mapRef.current) {
      const camera: Camera = await mapRef.current.getCamera();
      setMapHeading(camera.heading || 0); 
    }
  };

  const fetchWalkingRoute = async (currentLocation: any) => {
    if (coordinates) {
      const route = await getWalkingRoute(currentLocation, coordinates);
      if (route && route.trips && route.trips.length > 0) {
        const trip = route.trips[0];
        const encodedPolyline = trip.geometry;
        const formattedRoute = decodePolyline(encodedPolyline);
        const legDuration = trip.legs[0].duration;
        const roundedDuration = Math.round(legDuration / 60);

        setDuration(roundedDuration);
        setRouteCoordinates(formattedRoute);
      } else {
        console.error('No trips found in the response:', route);
      }
    }
  };

  const getWalkingRoute = async (start: { latitude: number; longitude: number }, end: { latitude: number; longitude: number }) => {
    const osrmUrl = `https://api.mapbox.com/optimized-trips/v1/mapbox/walking/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?access_token=${MAPBOX_API_KEY}`;

    try {
      const response = await fetch(osrmUrl);
      if (!response.ok) {
        throw new Error(`Error fetching route: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch walking route:', error);
      return null;
    }
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    navigation.navigate('Home');
  };

  const getDistance = (pointA: { latitude: number; longitude: number }, pointB: { latitude: number; longitude: number }) => {
    const rad = (x: number) => (x * Math.PI) / 180;
    const R = 6371e3; 
    const dLat = rad(pointB.latitude - pointA.latitude);
    const dLon = rad(pointB.longitude - pointA.longitude);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(rad(pointA.latitude)) * Math.cos(rad(pointB.latitude)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const decodePolyline = (encoded: string): { latitude: number; longitude: number }[] => {
    const coordinates: { latitude: number; longitude: number }[] = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      coordinates.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }

    return coordinates;
  };

  const initialRegion = {
    latitude: userLocation?.latitude || (coordinates ? coordinates.latitude : 0),
    longitude: userLocation?.longitude || (coordinates ? coordinates.longitude : 0),
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const combinedRotation = direction + (mapHeading * (Math.PI / 180));

  return (
    <View style={NavigationStyles.container}>
      <MapView
        ref={mapRef}
        style={NavigationStyles.map}
        initialRegion={initialRegion}
        onRegionChangeComplete={updateMapHeading}
        onMapReady={updateMapHeading} 
      >
        {userLocation && (
          <Marker coordinate={userLocation} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={{ 
                transform: [
                    {translateX: -15},
                    { rotate: `${-combinedRotation}rad` }
                ], 
            }}>
              <Ionicons name="arrow-up-circle" size={30} color="blue" />
            </View>
          </Marker>
        )}
        {coordinates && (
          <Marker
            coordinate={coordinates}
            title={entityName}
          />
        )}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={5}
            strokeColor="blue"
          />
        )}
      </MapView>
      {isNavigating && duration && (
        <View style={NavigationStyles.popupBox}>
          <Text style={NavigationStyles.popupText}>
            Duration: {duration} minutes
          </Text>
          <TouchableOpacity onPress={stopNavigation} style={NavigationStyles.exitButton}>
            <Text style={NavigationStyles.exitButtonText}>Exit Navigation</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Navigation;

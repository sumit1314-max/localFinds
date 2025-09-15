import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const MapScreen = ({ navigation, route }) => {
  const [distance, setDistance] = useState(route.params?.distance || 15);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const webViewRef = useRef(null);

  useEffect(() => {
    loadLocationAndShowMap();
    loadSavedDistance();
  }, []);

  const loadSavedDistance = async () => {
    try {
      const savedDistance = await AsyncStorage.getItem('selectedDistance');
      if (savedDistance && !route.params?.distance) {
        const parsedDistance = parseFloat(savedDistance);
        console.log('📏 MapScreen loading saved distance:', parsedDistance);
        setDistance(parsedDistance);
      }
    } catch (error) {
      console.error('Error loading saved distance in MapScreen:', error);
    }
  };

  const loadLocationAndShowMap = async () => {
    try {
      setIsLoading(true);
      
      // Load saved location from AsyncStorage
      const savedLocation = await AsyncStorage.getItem('userLocation');
      if (savedLocation) {
        const locationData = JSON.parse(savedLocation);
        
        const location = {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          address: locationData.address,
          accuracy: locationData.accuracy,
        };
        
        setCurrentLocation(location);
        
        // Auto zoom to location when map is ready
        setTimeout(() => {
          if (webViewRef.current && location) {
            // Set initial zoom level for WebView map
            const jsCode = `
              if (window.map) {
                window.map.setView([${location.latitude}, ${location.longitude}], 14);
              }
            `;
            webViewRef.current.postMessage(jsCode);
          }
        }, 2000); // Increased timeout for WebView to load
      } else {
        Alert.alert(
          'No Location Found',
          'Please enable location access first to view your current position on the map.',
          [
            { text: 'Go to Location Settings', onPress: () => navigation.navigate('LocationAccess') },
            { text: 'Go Back', onPress: () => navigation.goBack() }
          ]
        );
      }
    } catch (error) {
      console.error('Error loading location for map:', error);
      Alert.alert(
        'Error Loading Map',
        'Unable to load your location data. Please try again.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDistanceChange = async (newDistance) => {
    setDistance(newDistance);
    
    // Save distance to AsyncStorage
    try {
      await AsyncStorage.setItem('selectedDistance', newDistance.toString());
      console.log('📏 MapScreen distance saved:', newDistance);
    } catch (error) {
      console.error('Error saving distance in MapScreen:', error);
    }
    
    // Update circle on map
    if (webViewRef.current && currentLocation) {
      const jsCode = `
        if (window.circle) {
          window.map.removeLayer(window.circle);
        }
        window.circle = L.circle([${currentLocation.latitude}, ${currentLocation.longitude}], {
          color: 'rgba(239, 68, 68, 0.8)',
          fillColor: 'rgba(239, 68, 68, 0.1)',
          fillOpacity: 0.1,
          radius: ${newDistance * 1000}
        }).addTo(window.map);
      `;
      webViewRef.current.postMessage(jsCode);
    }
  };

  const generateMapHTML = () => {
    if (!currentLocation) return '';
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Distance Range Map</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style>
            body { margin: 0; padding: 0; }
            #map { height: 100vh; width: 100vw; }
            .custom-marker {
                width: 20px;
                height: 20px;
                background: #3b82f6;
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                position: relative;
            }
            .custom-marker::after {
                content: '';
                width: 30px;
                height: 30px;
                background: rgba(59, 130, 246, 0.3);
                border-radius: 50%;
                position: absolute;
                top: -8px;
                left: -8px;
                animation: pulse 2s infinite;
            }
            @keyframes pulse {
                0% { transform: scale(0.8); opacity: 1; }
                100% { transform: scale(1.2); opacity: 0; }
            }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
            window.map = L.map('map').setView([${currentLocation.latitude}, ${currentLocation.longitude}], 14);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap contributors'
            }).addTo(window.map);
            
            // Custom marker
            const customIcon = L.divIcon({
                html: '<div class="custom-marker"></div>',
                className: 'custom-div-icon',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });
            
            window.marker = L.marker([${currentLocation.latitude}, ${currentLocation.longitude}], {
                icon: customIcon
            }).addTo(window.map);
            
            window.marker.bindPopup(\`
                <div style="text-align: center; padding: 5px;">
                    <strong>Your Location</strong><br>
                    <small>${currentLocation.address}</small><br>
                    <small>Accuracy: ±${currentLocation.accuracy ? Math.round(currentLocation.accuracy) : 'N/A'}m</small>
                </div>
            \`);
            
            // Distance circle
            window.circle = L.circle([${currentLocation.latitude}, ${currentLocation.longitude}], {
                color: 'rgba(239, 68, 68, 0.8)',
                fillColor: 'rgba(239, 68, 68, 0.1)',
                fillOpacity: 0.1,
                radius: ${distance * 1000}
            }).addTo(window.map);
            
            // Listen for messages from React Native
            function handleMessage(event) {
                try {
                    console.log('Received message:', event.data);
                    eval(event.data);
                } catch(e) {
                    console.error('Error executing code:', e, event.data);
                }
            }
            
            // For iOS
            window.addEventListener('message', handleMessage);
            
            // For Android
            document.addEventListener('message', handleMessage);
            
            console.log('📍 Map initialized successfully');
        </script>
    </body>
    </html>
    `;
  };

  const zoomToRange = () => {
    if (webViewRef.current && currentLocation) {
      // Calculate zoom level based on distance
      let zoomLevel = 14;
      if (distance <= 1) zoomLevel = 16;
      else if (distance <= 5) zoomLevel = 14;
      else if (distance <= 10) zoomLevel = 13;
      else if (distance <= 25) zoomLevel = 11;
      else zoomLevel = 10;
      
      const jsCode = `
        window.map.setView([${currentLocation.latitude}, ${currentLocation.longitude}], ${zoomLevel});
      `;
      webViewRef.current.postMessage(jsCode);
    }
  };

  const applyDistance = async () => {
    // Save distance first
    try {
      await AsyncStorage.setItem('selectedDistance', distance.toString());
      console.log('📏 Applied distance saved:', distance);
    } catch (error) {
      console.error('Error saving applied distance:', error);
    }

    Alert.alert(
      'Distance Range Applied ✅',
      `Your search range has been set to ${distance} km. This will be used for finding nearby places.`,
      [
        {
          text: 'Continue',
          onPress: () => {
            // Navigate back with updated distance
            navigation.navigate('HomeMain', { updatedDistance: distance });
          },
        },
      ]
    );
  };

  const onWebViewLoad = () => {
    setMapReady(true);
    console.log('📍 Map loaded successfully in WebView');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading your location...</Text>
      </View>
    );
  }

  if (!currentLocation) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="location-outline" size={64} color="#9ca3af" />
        <Text style={styles.errorTitle}>Location Not Available</Text>
        <Text style={styles.errorText}>
          Please enable location access to view the map with your current position.
        </Text>
        <TouchableOpacity 
          style={styles.enableLocationButton}
          onPress={() => navigation.navigate('LocationAccess')}
        >
          <Text style={styles.enableLocationButtonText}>Enable Location</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Distance Range Map</Text>
          <Text style={styles.headerSubtitle}>
            {currentLocation.address}
          </Text>
        </View>
        <TouchableOpacity style={styles.zoomButton} onPress={zoomToRange}>
          <Ionicons name="scan" size={20} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <WebView
        ref={webViewRef}
        style={styles.map}
        source={{ html: generateMapHTML() }}
        onLoadEnd={onWebViewLoad}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        mixedContentMode="compatibility"
        onMessage={(event) => {
          console.log('Message from WebView:', event.nativeEvent.data);
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error: ', nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView HTTP error: ', nativeEvent);
        }}
      />

      {/* Distance Control Panel */}
      <View style={styles.controlPanel}>
        <View style={styles.distanceInfo}>
          <View style={styles.distanceHeader}>
            <View style={styles.distanceIconContainer}>
              <Ionicons name="radio-outline" size={20} color="#ef4444" />
            </View>
            <View style={styles.distanceTextContainer}>
              <Text style={styles.distanceLabel}>Search Range</Text>
              <Text style={styles.distanceValue}>{distance} km radius</Text>
            </View>
          </View>
          
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={50}
            value={distance}
            onValueChange={handleDistanceChange}
            minimumTrackTintColor="#ef4444"
            maximumTrackTintColor="#e5e7eb"
            thumbStyle={styles.sliderThumb}
          />
          
          <View style={styles.rangeLabels}>
            <Text style={styles.rangeLabel}>1 km</Text>
            <Text style={styles.rangeLabel}>50 km</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.applyButton} onPress={applyDistance}>
            <Ionicons name="checkmark" size={18} color="#ffffff" />
            <Text style={styles.applyButtonText}>Apply Range</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Map Info */}
      <View style={styles.mapInfo}>
        <View style={styles.infoItem}>
          <Ionicons name="location" size={16} color="#3b82f6" />
          <Text style={styles.infoText}>
            Accuracy: ±{currentLocation.accuracy ? Math.round(currentLocation.accuracy) : 'N/A'}m
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <Ionicons name="radio" size={16} color="#ef4444" />
          <Text style={styles.infoText}>
            Coverage: {(Math.PI * distance * distance).toFixed(1)} km²
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  enableLocationButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  enableLocationButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerCenter: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  zoomButton: {
    padding: 8,
    backgroundColor: '#eff6ff',
    borderRadius: 20,
  },
  map: {
    flex: 1,
  },
  controlPanel: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  distanceInfo: {
    marginBottom: 20,
  },
  distanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  distanceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  distanceTextContainer: {
    flex: 1,
  },
  distanceLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  distanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  slider: {
    height: 8,
    marginBottom: 8,
  },
  sliderThumb: {
    backgroundColor: '#ef4444',
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  applyButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#ef4444',
    gap: 6,
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  mapInfo: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default MapScreen;

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EnhancedLocationService from '../services/enhancedLocationService';

const LocationAccessScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState('Initializing...');
  const [accuracy, setAccuracy] = useState(null);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSkip = () => {
    navigation.navigate('Main');
  };

  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    setLocationStatus('Initializing enhanced location service...');
    
    try {
      // Update status during different phases
      const statusCallback = (status) => {
        setLocationStatus(status);
      };

      // Use enhanced location service
      setLocationStatus('🎯 Scanning for GPS satellites...');
      const locationData = await EnhancedLocationService.getCompleteLocationData({
        onStatusChange: statusCallback
      });

      setAccuracy(locationData.accuracy);
      setIsGettingLocation(false);
      setLocationStatus('Location acquired successfully! 🎉');
      
      // Create success message with enhanced data
      const qualityEmoji = {
        'excellent': '🎯',
        'very_good': '✅',
        'good': '👍',
        'fair': '⚠️',
        'poor': '❌'
      };

      const qualityText = locationData.quality ? 
        `${qualityEmoji[locationData.quality]} Quality: ${locationData.quality.replace('_', ' ').toUpperCase()}` : '';
      
      const accuracyText = locationData.accuracy ? 
        `Accuracy: ±${Math.round(locationData.accuracy)}m` : '';
      
      const attemptsText = locationData.attempts ? 
        `Attempts: ${locationData.attempts}` : '';

      const successMessage = [
        `📍 ${locationData.address}`,
        '',
        locationData.detailedAddress ? `🏠 ${locationData.detailedAddress}` : '',
        '',
        accuracyText,
        qualityText,
        attemptsText,
        '',
        `📊 Coordinates: ${locationData.coordinates}`,
        `🕐 Updated: ${new Date(locationData.timestamp).toLocaleString()}`
      ].filter(Boolean).join('\n');
      
      Alert.alert(
        'Location Updated Successfully! 🎉',
        successMessage,
        [
          {
            text: 'Continue',
            onPress: () => navigation.navigate('Main'),
          },
        ]
      );

    } catch (error) {
      setIsGettingLocation(false);
      setLocationStatus('❌ Enhanced location detection failed');
      console.error('Enhanced location service error:', error);
      
      let errorMessage = 'Unable to get your precise location.';
      let errorSolutions = [];
      let errorEmoji = '📍';
      
      if (error.message.includes('Location services are disabled')) {
        errorMessage = 'Location services are disabled on your device.';
        errorEmoji = '⚙️';
        errorSolutions = [
          'Open device Settings > Privacy > Location Services',
          'Enable Location Services',
          'Make sure GPS/High Accuracy mode is selected',
          'Restart the app after enabling'
        ];
      } else if (error.message.includes('timeout') || error.message.includes('Failed to get location')) {
        errorMessage = 'GPS signal is weak or unavailable.';
        errorEmoji = '📡';
        errorSolutions = [
          'Move to an open area away from buildings',
          'Ensure clear view of the sky',
          'Turn off WiFi and use mobile data temporarily',
          'Wait a few moments for GPS to connect',
          'Try enabling High Accuracy mode in Location settings'
        ];
      } else if (error.message.includes('permission')) {
        errorMessage = 'Location permission was denied.';
        errorEmoji = '🚫';
        errorSolutions = [
          'Allow location access when prompted',
          'Go to Settings > Apps > LocalFinds > Permissions',
          'Enable Location permission',
          'Choose "Allow all the time" or "Allow while using app"'
        ];
      } else {
        errorMessage = 'Enhanced location detection encountered an issue.';
        errorEmoji = '⚠️';
        errorSolutions = [
          'Check internet connection',
          'Ensure location services are enabled',
          'Try moving to a different location',
          'Restart the app if problem persists'
        ];
      }
      
      const fullMessage = [
        errorMessage,
        '',
        '💡 Troubleshooting Steps:',
        ...errorSolutions.map((solution, index) => `${index + 1}. ${solution}`)
      ].join('\n');
      
      Alert.alert(
        `Enhanced Location Error ${errorEmoji}`,
        fullMessage,
        [
          { text: 'Retry Enhanced Detection', onPress: getCurrentLocation },
          { text: 'Skip for Now', onPress: handleSkip }
        ]
      );
    }
  };

  const checkLocationServices = async () => {
    try {
      const serviceEnabled = await Location.hasServicesEnabledAsync();
      if (!serviceEnabled) {
        Alert.alert(
          'Location Services Disabled',
          'Please enable location services in your device settings to get precise location.',
          [
            { text: 'Skip', onPress: handleSkip },
            { text: 'Check Settings', onPress: requestLocationPermission }
          ]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking location services:', error);
      return true; // Continue anyway
    }
  };

  const requestLocationPermission = async () => {
    try {
      // First check if location services are enabled
      const servicesEnabled = await checkLocationServices();
      if (!servicesEnabled) return;

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        await getCurrentLocation();
      } else {
        Alert.alert(
          'Permission Denied 🚫',
          'Location permission is required for precise location detection. This helps you discover nearby places accurately.\n\nYou can enable it later in settings.',
          [
            { text: 'Skip', onPress: handleSkip },
            { text: 'Try Again', onPress: requestLocationPermission }
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      Alert.alert(
        'Permission Error',
        'Failed to request location permission. Please try again.',
        [
          { text: 'Skip', onPress: handleSkip },
          { text: 'Retry', onPress: requestLocationPermission }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="location" size={80} color="#6b7280" />
        </View>
        
        <Text style={styles.title}>Enhanced Location Detection</Text>
        <Text style={styles.description}>
          Our advanced location service uses multiple GPS strategies to provide the most accurate location possible. This helps you discover nearby markets, events, and services with precision.
        </Text>
        
        {isGettingLocation && (
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>{locationStatus}</Text>
            {accuracy && (
              <Text style={styles.accuracyText}>
                Accuracy: ±{Math.round(accuracy)}m
              </Text>
            )}
          </View>
        )}
      </Animated.View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.allowButton, isGettingLocation && styles.allowButtonDisabled]} 
          onPress={requestLocationPermission}
          disabled={isGettingLocation}
        >
          {isGettingLocation ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#111827" />
              <Text style={styles.allowButtonText}>Getting Location...</Text>
            </View>
          ) : (
            <Text style={styles.allowButtonText}>Enable Enhanced Location</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  footer: {
    padding: 24,
  },
  allowButton: {
    backgroundColor: '#f9f506',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  allowButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: 'bold',
  },
  allowButtonDisabled: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
    textAlign: 'center',
  },
  accuracyText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default LocationAccessScreen;

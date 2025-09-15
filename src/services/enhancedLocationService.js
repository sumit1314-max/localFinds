import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

class EnhancedLocationService {
  constructor() {
    this.watchId = null;
    this.lastKnownPosition = null;
    this.locationCache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Get high accuracy location using multiple strategies
   */
  async getHighAccuracyLocation(options = {}) {
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 60000,
      distanceFilter: 5, // meters
      ...options
    };

    try {
      // Check if location services are enabled
      const serviceEnabled = await Location.hasServicesEnabledAsync();
      if (!serviceEnabled) {
        throw new Error('Location services are disabled. Please enable GPS in your device settings.');
      }

      // Request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied. Please allow location access in app settings.');
      }

      // Strategy 1: Try watchPosition for continuous updates (most accurate)
      console.log('🎯 Attempting high-accuracy location detection...');
      
      let bestLocation = null;
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts && (!bestLocation || bestLocation.coords.accuracy > 20)) {
        attempts++;
        console.log(`📍 Location attempt ${attempts}/${maxAttempts}`);

        try {
          const location = await Location.getCurrentPositionAsync({
            accuracy: attempts === 1 ? Location.Accuracy.BestForNavigation : 
                     attempts === 2 ? Location.Accuracy.Highest : 
                     Location.Accuracy.Balanced,
            timeout: 15000 + (attempts * 5000),
            maximumAge: attempts === 1 ? 0 : 30000,
          });

          if (!bestLocation || location.coords.accuracy < bestLocation.coords.accuracy) {
            bestLocation = location;
            console.log(`✅ Better location found: ±${Math.round(location.coords.accuracy)}m`);
          }

          // If we got very accurate location, break early
          if (location.coords.accuracy <= 10) {
            console.log('🎯 High accuracy achieved!');
            break;
          }

        } catch (error) {
          console.log(`⚠️ Attempt ${attempts} failed:`, error.message);
          if (attempts === maxAttempts) {
            throw error;
          }
        }

        // Wait a bit before next attempt
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      if (!bestLocation) {
        throw new Error('Failed to get location after multiple attempts');
      }

      // Enhanced location data
      const enhancedLocation = {
        ...bestLocation,
        timestamp: new Date().toISOString(),
        accuracy: bestLocation.coords.accuracy,
        method: 'Enhanced GPS',
        attempts: attempts,
        quality: this.getLocationQuality(bestLocation.coords.accuracy)
      };

      this.lastKnownPosition = enhancedLocation;
      return enhancedLocation;

    } catch (error) {
      console.error('❌ Enhanced location service error:', error);
      throw error;
    }
  }

  /**
   * Get comprehensive address using reverse geocoding with fallbacks
   */
  async getComprehensiveAddress(latitude, longitude) {
    try {
      console.log('🏠 Getting comprehensive address...');
      
      // Strategy 1: Use expo-location reverse geocoding
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addresses && addresses.length > 0) {
        const addr = addresses[0];
        
        const comprehensiveAddress = {
          formatted: this.formatAddress(addr),
          detailed: this.getDetailedAddress(addr),
          components: {
            name: addr.name || '',
            street: addr.street || '',
            streetNumber: addr.streetNumber || '',
            district: addr.district || '',
            city: addr.city || '',
            subregion: addr.subregion || '',
            region: addr.region || '',
            postalCode: addr.postalCode || '',
            country: addr.country || '',
            isoCountryCode: addr.isoCountryCode || ''
          },
          confidence: 'high'
        };

        return comprehensiveAddress;
      }

      throw new Error('No address found');

    } catch (error) {
      console.error('🏠 Address lookup failed:', error);
      return {
        formatted: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        detailed: 'Address not available',
        components: {},
        confidence: 'low'
      };
    }
  }

  /**
   * Save location data with enhanced metadata
   */
  async saveLocationData(location, address) {
    try {
      const locationData = {
        // Coordinates
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude,
        
        // Accuracy
        accuracy: location.coords.accuracy,
        altitudeAccuracy: location.coords.altitudeAccuracy,
        
        // Motion
        heading: location.coords.heading,
        speed: location.coords.speed,
        
        // Address
        address: address.formatted,
        detailedAddress: address.detailed,
        addressComponents: address.components,
        
        // Metadata
        timestamp: location.timestamp,
        method: location.method,
        attempts: location.attempts,
        quality: location.quality,
        confidence: address.confidence,
        
        // Formatted coordinates
        coordinates: `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`,
        
        // Additional info
        provider: 'Enhanced Location Service',
        version: '2.0'
      };

      await AsyncStorage.setItem('userLocation', JSON.stringify(locationData));
      await AsyncStorage.setItem('locationHistory', JSON.stringify({
        ...locationData,
        historyId: Date.now()
      }));

      console.log('💾 Enhanced location data saved successfully');
      return locationData;

    } catch (error) {
      console.error('💾 Failed to save location data:', error);
      throw error;
    }
  }

  /**
   * Get location quality assessment
   */
  getLocationQuality(accuracy) {
    if (accuracy <= 5) return 'excellent';
    if (accuracy <= 10) return 'very_good';
    if (accuracy <= 20) return 'good';
    if (accuracy <= 50) return 'fair';
    return 'poor';
  }

  /**
   * Format address for display
   */
  formatAddress(addr) {
    const parts = [];
    
    if (addr.name && addr.name !== addr.street) {
      parts.push(addr.name);
    }
    
    if (addr.street) {
      const street = addr.streetNumber ? 
        `${addr.streetNumber} ${addr.street}` : 
        addr.street;
      parts.push(street);
    }
    
    if (addr.district && addr.district !== addr.city) {
      parts.push(addr.district);
    }
    
    if (addr.city) {
      parts.push(addr.city);
    } else if (addr.subregion) {
      parts.push(addr.subregion);
    }
    
    if (addr.region && addr.region !== addr.city) {
      parts.push(addr.region);
    }
    
    if (addr.country) {
      parts.push(addr.country);
    }

    return parts.length > 0 ? parts.join(', ') : 'Unknown Location';
  }

  /**
   * Get detailed address
   */
  getDetailedAddress(addr) {
    const parts = [];
    
    if (addr.name) parts.push(addr.name);
    if (addr.street) {
      const street = addr.streetNumber ? 
        `${addr.streetNumber} ${addr.street}` : 
        addr.street;
      parts.push(street);
    }
    if (addr.district) parts.push(addr.district);
    if (addr.city) parts.push(addr.city);
    if (addr.postalCode) parts.push(addr.postalCode);
    
    return parts.join(', ');
  }

  /**
   * Start watching location changes
   */
  async startWatching(callback, options = {}) {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      this.watchId = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 10000, // 10 seconds
          distanceInterval: 10, // 10 meters
          ...options
        },
        callback
      );

      console.log('👀 Started watching location changes');
      return this.watchId;

    } catch (error) {
      console.error('👀 Failed to start watching location:', error);
      throw error;
    }
  }

  /**
   * Stop watching location changes
   */
  stopWatching() {
    if (this.watchId) {
      this.watchId.remove();
      this.watchId = null;
      console.log('⏹️ Stopped watching location changes');
    }
  }

  /**
   * Get complete location data (coordinates + address)
   */
  async getCompleteLocationData(options = {}) {
    try {
      console.log('🚀 Starting enhanced location detection...');
      
      // Get high accuracy location
      const location = await this.getHighAccuracyLocation(options);
      
      // Get comprehensive address
      const address = await this.getComprehensiveAddress(
        location.coords.latitude,
        location.coords.longitude
      );
      
      // Save data
      const savedData = await this.saveLocationData(location, address);
      
      console.log('✅ Complete location data obtained successfully');
      return savedData;

    } catch (error) {
      console.error('❌ Failed to get complete location data:', error);
      throw error;
    }
  }
}

export default new EnhancedLocationService();

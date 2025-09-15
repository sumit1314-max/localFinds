import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [distance, setDistance] = useState(15);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState('New York, USA');
  const [locationData, setLocationData] = useState(null);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadUserLocation();
    loadSavedDistance();
  }, []);

  const loadSavedDistance = async () => {
    try {
      const savedDistance = await AsyncStorage.getItem('selectedDistance');
      if (savedDistance) {
        const parsedDistance = parseFloat(savedDistance);
        console.log('📏 Loading saved distance:', parsedDistance);
        setDistance(parsedDistance);
      }
    } catch (error) {
      console.error('Error loading saved distance:', error);
    }
  };

  const saveDistance = async (newDistance) => {
    try {
      await AsyncStorage.setItem('selectedDistance', newDistance.toString());
      console.log('📏 Distance saved:', newDistance);
    } catch (error) {
      console.error('Error saving distance:', error);
    }
  };

  useEffect(() => {
    // Listen for distance updates from MapScreen
    const unsubscribe = navigation.addListener('focus', () => {
      // Check if we're returning from MapScreen with updated distance
      const state = navigation.getState();
      const currentRoute = state.routes[state.index];
      
      if (currentRoute.params?.updatedDistance) {
        const newDistance = currentRoute.params.updatedDistance;
        console.log('📏 Updating distance from MapScreen:', newDistance);
        setDistance(newDistance);
        saveDistance(newDistance);
        
        // Clear the parameter to avoid repeated updates
        navigation.setParams({ updatedDistance: undefined });
      }
    });

    return unsubscribe;
  }, [navigation]);

  const loadUserLocation = async () => {
    try {
      const savedLocation = await AsyncStorage.getItem('userLocation');
      if (savedLocation) {
        const parsedLocationData = JSON.parse(savedLocation);
        setLocationData(parsedLocationData);
        setUserLocation(parsedLocationData.address);
      }
    } catch (error) {
      console.error('Error loading user location:', error);
    }
  };

  const categories = [
    { 
      id: 1, 
      name: 'Markets', 
      icon: 'storefront', 
      color: '#3b82f6',
      subcategories: [
        { id: 11, name: 'Farmers Market', icon: 'leaf', count: 15 },
        { id: 12, name: 'Flea Market', icon: 'diamond', count: 8 },
        { id: 13, name: 'Street Market', icon: 'car', count: 12 },
        { id: 14, name: 'Night Market', icon: 'moon', count: 6 }
      ]
    },
    { 
      id: 2, 
      name: 'Grocery', 
      icon: 'basket', 
      color: '#10b981',
      subcategories: [
        { id: 21, name: 'Supermarket', icon: 'business', count: 25 },
        { id: 22, name: 'Local Store', icon: 'home', count: 40 },
        { id: 23, name: 'Organic Store', icon: 'nutrition', count: 12 },
        { id: 24, name: 'Convenience', icon: 'time', count: 30 }
      ]
    },
    { 
      id: 3, 
      name: 'Events', 
      icon: 'calendar', 
      color: '#f59e0b',
      subcategories: [
        { id: 31, name: 'Festivals', icon: 'star', count: 8 },
        { id: 32, name: 'Workshops', icon: 'hammer', count: 15 },
        { id: 33, name: 'Exhibitions', icon: 'images', count: 10 },
        { id: 34, name: 'Community', icon: 'people', count: 20 }
      ]
    },
    { 
      id: 4, 
      name: 'Concerts', 
      icon: 'musical-notes', 
      color: '#8b5cf6',
      subcategories: [
        { id: 41, name: 'Live Music', icon: 'mic', count: 12 },
        { id: 42, name: 'DJ Events', icon: 'disc', count: 8 },
        { id: 43, name: 'Classical', icon: 'library', count: 5 },
        { id: 44, name: 'Local Bands', icon: 'musical-note', count: 18 }
      ]
    },
    { 
      id: 5, 
      name: 'Malls', 
      icon: 'bag', 
      color: '#ef4444',
      subcategories: [
        { id: 51, name: 'Shopping Mall', icon: 'storefront', count: 8 },
        { id: 52, name: 'Outlet Store', icon: 'pricetag', count: 12 },
        { id: 53, name: 'Department', icon: 'business', count: 6 },
        { id: 54, name: 'Brand Store', icon: 'diamond', count: 25 }
      ]
    },
    { 
      id: 6, 
      name: 'Repair', 
      icon: 'build', 
      color: '#06b6d4',
      subcategories: [
        { id: 61, name: 'Electronics', icon: 'phone-portrait', count: 15 },
        { id: 62, name: 'Automotive', icon: 'car', count: 10 },
        { id: 63, name: 'Appliances', icon: 'tv', count: 12 },
        { id: 64, name: 'Bike Repair', icon: 'bicycle', count: 8 }
      ]
    },
    { 
      id: 7, 
      name: 'Tuition', 
      icon: 'school', 
      color: '#84cc16',
      subcategories: [
        { id: 71, name: 'Academic', icon: 'book', count: 20 },
        { id: 72, name: 'Music Classes', icon: 'musical-notes', count: 15 },
        { id: 73, name: 'Sports', icon: 'football', count: 12 },
        { id: 74, name: 'Art & Craft', icon: 'brush', count: 10 }
      ]
    },
    { 
      id: 8, 
      name: 'Hotels', 
      icon: 'bed', 
      color: '#f97316',
      subcategories: [
        { id: 81, name: 'Luxury Hotels', icon: 'star', count: 5 },
        { id: 82, name: 'Budget Hotels', icon: 'wallet', count: 18 },
        { id: 83, name: 'Guest House', icon: 'home', count: 12 },
        { id: 84, name: 'Hostels', icon: 'people', count: 8 }
      ]
    },
  ];

  const featuredBanners = [
    {
      id: 1,
      title: '50% Off on Fresh Groceries',
      subtitle: 'Find your nearest market now!',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGyTh-01Md-epe2qLbveW8jKZvsM4SFlYED3GP_JSPKSY9sOQA5cvvS7isC23tTMACkXAKLIs17tf7QfaJ4ZhbLWXN5wxB7n_zq3tOTsV1PWkgflbcdASsgyxs6WteJr0as3EQMjWyCmlPl_WLmRRIXLAKp3BRSHXrbiAgdrIZmIYVBLe9gv7yv_w6xnYmTqK8dLnWQYQtzBxmGq6BcrNxC_otlDwETbTteznB5CvIIdk9WvDT37iWmN71hmLDeoHA5AC-t9S9TdU',
    },
    {
      id: 2,
      title: 'Weekend Music Fest',
      subtitle: 'Book your tickets today',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGyTh-01Md-epe2qLbveW8jKZvsM4SFlYED3GP_JSPKSY9sOQA5cvvS7isC23tTMACkXAKLIs17tf7QfaJ4ZhbLWXN5wxB7n_zq3tOTsV1PWkgflbcdASsgyxs6WteJr0as3EQMjWyCmlPl_WLmRRIXLAKp3BRSHXrbiAgdrIZmIYVBLe9gv7yv_w6xnYmTqK8dLnWQYQtzBxmGq6BcrNxC_otlDwETbTteznB5CvIIdk9WvDT37iWmN71hmLDeoHA5AC-t9S9TdU',
    },
    {
      id: 3,
      title: 'Biggest Sale of the Season',
      subtitle: 'At your favorite shopping mall',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGyTh-01Md-epe2qLbveW8jKZvsM4SFlYED3GP_JSPKSY9sOQA5cvvS7isC23tTMACkXAKLIs17tf7QfaJ4ZhbLWXN5wxB7n_zq3tOTsV1PWkgflbcdASsgyxs6WteJr0as3EQMjWyCmlPl_WLmRRIXLAKp3BRSHXrbiAgdrIZmIYVBLe9gv7yv_w6xnYmTqK8dLnWQYQtzBxmGq6BcrNxC_otlDwETbTteznB5CvIIdk9WvDT37iWmN71hmLDeoHA5AC-t9S9TdU',
    },
  ];

  const handleCategoryPress = (category) => {
    navigation.navigate('Categories', { 
      category: category,
      subcategories: category.subcategories 
    });
  };

  const toggleLocationDropdown = () => {
    setShowLocationDropdown(!showLocationDropdown);
  };

  const refreshLocation = () => {
    setShowLocationDropdown(false);
    navigation.navigate('LocationAccess');
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.95],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <TouchableOpacity style={styles.locationContainer} onPress={toggleLocationDropdown}>
          <Text style={styles.locationLabel}>Your Location</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={18} color="#3b82f6" />
            <Text style={styles.locationText} numberOfLines={1}>{userLocation}</Text>
            <Ionicons 
              name={showLocationDropdown ? "chevron-up" : "chevron-down"} 
              size={18} 
              color="#4b5563" 
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications" size={24} color="#4b5563" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </Animated.View>

      {showLocationDropdown && (
        <View style={styles.locationDropdown}>
          <View style={styles.dropdownContent}>
            <View style={styles.currentLocationSection}>
              <View style={styles.locationIconContainer}>
                <Ionicons name="location" size={24} color="#3b82f6" />
              </View>
              <View style={styles.locationDetails}>
                <Text style={styles.currentLocationTitle}>Current Location</Text>
                <Text style={styles.currentLocationAddress}>{userLocation}</Text>
                {locationData?.detailedAddress && (
                  <Text style={styles.detailedAddress}>{locationData.detailedAddress}</Text>
                )}
                {locationData?.accuracy && (
                  <Text style={styles.accuracyInfo}>
                    Accuracy: ±{Math.round(locationData.accuracy)}m
                    {locationData.quality && ` (${locationData.quality.replace('_', ' ').toUpperCase()})`}
                  </Text>
                )}
                {locationData?.coordinates && (
                  <Text style={styles.coordinatesInfo}>
                    📍 {locationData.coordinates}
                  </Text>
                )}
                {locationData?.timestamp && (
                  <Text style={styles.timestampInfo}>
                    Updated: {new Date(locationData.timestamp).toLocaleDateString()} {new Date(locationData.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </Text>
                )}
                {locationData?.method && (
                  <Text style={styles.methodInfo}>
                    🎯 {locationData.method}
                    {locationData.attempts && ` (${locationData.attempts} attempts)`}
                  </Text>
                )}
              </View>
            </View>
            
            <View style={styles.dropdownActions}>
              <TouchableOpacity style={styles.refreshButton} onPress={refreshLocation}>
                <Ionicons name="refresh" size={18} color="#3b82f6" />
                <Text style={styles.refreshButtonText}>Refresh Location</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setShowLocationDropdown(false)}
              >
                <Ionicons name="close" size={18} color="#6b7280" />
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for markets, events, or services"
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.distanceSection}>
          <View style={styles.distanceHeader}>
            <Text style={styles.distanceLabel}>Distance Range</Text>
            <View style={styles.distanceActions}>
              <Text style={styles.distanceValue}>{distance} km</Text>
              <TouchableOpacity 
                style={styles.mapButton}
                onPress={() => navigation.navigate('MapScreen', { distance })}
              >
                <Ionicons name="map" size={16} color="#3b82f6" />
                <Text style={styles.mapButtonText}>View Map</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={50}
            value={distance}
            onValueChange={(newDistance) => {
              setDistance(newDistance);
              saveDistance(newDistance);
            }}
            minimumTrackTintColor="#3b82f6"
            maximumTrackTintColor="#e5e7eb"
            thumbStyle={styles.sliderThumb}
          />
        </View>

        <View style={styles.categoriesSection}>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryItem}
                onPress={() => handleCategoryPress(category)}
              >
                <View style={[styles.categoryIcon, { backgroundColor: `${category.color}1a` }]}>
                  <Ionicons name={category.icon} size={32} color={category.color} />
                </View>
                <Text style={styles.categoryText}>{category.name}</Text>
                <Text style={styles.categoryCount}>
                  {category.subcategories.reduce((total, sub) => total + sub.count, 0)} places
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bannersSection}>
          <View style={styles.bannersHeader}>
            <Text style={styles.bannersTitle}>Featured Banners</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.bannersScroll}
            contentContainerStyle={styles.bannersContent}
          >
            {featuredBanners.map((banner) => (
              <TouchableOpacity key={banner.id} style={styles.bannerCard}>
                <Image source={{ uri: banner.image }} style={styles.bannerImage} />
                <View style={styles.bannerOverlay} />
                <View style={styles.bannerContent}>
                  <Text style={styles.bannerTitle}>{banner.title}</Text>
                  <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  locationContainer: {
    flex: 1,
    paddingVertical: 4,
  },
  locationLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
    marginRight: 8,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 24,
    marginHorizontal: 16,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1f2937',
  },
  scrollView: {
    flex: 1,
  },
  distanceSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
  },
  distanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  distanceLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  distanceActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  distanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  mapButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3b82f6',
  },
  slider: {
    height: 8,
    borderRadius: 4,
  },
  sliderThumb: {
    backgroundColor: '#3b82f6',
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  categoriesSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '22%',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'center',
  },
  locationDropdown: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownContent: {
    padding: 16,
  },
  currentLocationSection: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationDetails: {
    flex: 1,
  },
  currentLocationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  currentLocationAddress: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3b82f6',
    marginBottom: 4,
  },
  detailedAddress: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
    lineHeight: 16,
  },
  accuracyInfo: {
    fontSize: 11,
    color: '#10b981',
    marginBottom: 2,
  },
  coordinatesInfo: {
    fontSize: 10,
    color: '#8b5cf6',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  timestampInfo: {
    fontSize: 10,
    color: '#9ca3af',
  },
  methodInfo: {
    fontSize: 10,
    color: '#3b82f6',
    fontWeight: '500',
    marginTop: 2,
  },
  dropdownActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  refreshButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3b82f6',
    marginLeft: 6,
  },
  closeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    marginLeft: 6,
  },
  bannersSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  bannersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bannersTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  bannersScroll: {
    marginHorizontal: -16,
  },
  bannersContent: {
    paddingHorizontal: 16,
  },
  bannerCard: {
    width: 320,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  bannerContent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#ffffff',
  },
});

export default HomeScreen;

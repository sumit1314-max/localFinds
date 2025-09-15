import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import placesApiService from '../services/placesApiService';

const { width } = Dimensions.get('window');

const CategoriesScreen = ({ navigation, route }) => {
  const [selectedSort, setSelectedSort] = useState('sort');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(15);
  
  const { category, subcategories } = route.params || {};

  useEffect(() => {
    loadUserLocationAndData();
  }, []);

  useEffect(() => {
    if (userLocation && category) {
      searchPlaces();
    }
  }, [userLocation, category, selectedSubcategory]);

  const loadUserLocationAndData = async () => {
    try {
      // Load user location
      const savedLocation = await AsyncStorage.getItem('userLocation');
      const savedDistance = await AsyncStorage.getItem('selectedDistance');
      
      if (savedLocation) {
        const locationData = JSON.parse(savedLocation);
        setUserLocation(locationData);
      }
      
      if (savedDistance) {
        setDistance(parseFloat(savedDistance));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setLoading(false);
    }
  };

  const searchPlaces = async (expandedRadius = false) => {
    if (!userLocation || !category) return;
    
    setLoading(true);
    try {
      console.log(`🔍 Searching for ${category.name} places...`);
      
      // Use expanded radius for Events if no results found
      const searchRadius = expandedRadius && category?.name === 'Events & Entertainment' ? 50 : distance;
      
      const results = await placesApiService.searchPlaces(
        userLocation.latitude,
        userLocation.longitude,
        searchRadius,
        category.name,
        selectedSubcategory?.name || null
      );

      // Filter by subcategory if selected
      let filteredResults = results;
      if (selectedSubcategory) {
        filteredResults = results.filter(place => 
          place.name.toLowerCase().includes(selectedSubcategory.name.toLowerCase()) ||
          (place.types && place.types.some(type => 
            type.toLowerCase().includes(selectedSubcategory.name.toLowerCase())
          ))
        );
      }

      // Add distance calculation
      const placesWithDistance = filteredResults.map(place => ({
        ...place,
        distance: place.distance || placesApiService.calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          place.latitude,
          place.longitude
        ).toFixed(1) + ' km away'
      }));

      setMarketData(placesWithDistance);
      console.log(`✅ Found ${placesWithDistance.length} places`);
      
      // If no results and it's Events category, try expanded search
      if (placesWithDistance.length === 0 && category?.name === 'Events & Entertainment' && !expandedRadius) {
        console.log('🔍 No events found, trying expanded radius search...');
        setTimeout(() => {
          searchPlaces(true); // Retry with expanded radius
        }, 1000);
      }
      
    } catch (error) {
      console.error('Error searching places:', error);
      setMarketData(mockData); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const sortOptions = [
    { id: 'sort', name: 'Sort', icon: 'swap-vertical' },
    { id: 'distance', name: 'Distance' },
    { id: 'popularity', name: 'Popularity' },
    { id: 'latest', name: 'Latest' },
  ];

  // Mock data as fallback
  const mockData = [
    {
      id: 1,
      name: 'Farmers Market',
      distance: '1.2 km away',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQXnqImtWPRXWVYmtZFq_tz75-Eze5DVHjqZ-kIohKa_u9ZpQOCPuZoPwxOYr89IOlR9qWAMN_1DWiN3m3_ylDK9V7bjFrXQxp1d77BYqNh0MJ64bOfGZGDs93JXR33l-9oacGyijdUgIkAkIcFAXn6719ZHIOf-jAZQUJKGVzAo2fCkPvCGGWUQ2x5ZOg1G5vrVKr0IpQoGuvI4ehr8IiPVe7QnlkUMpAE7jwjfxp8I5J_zvRtXE2YCSTl1p_rqOUqnsIH_B6_jU',
    },
    {
      id: 2,
      name: 'Local Crafts Fair',
      distance: '2.5 km away',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCy8ndh5DzxI8G-4PgYrFnmW67PU6zdDX6RKGDOCmLiRLxG3Q1CXFmcLxc9meBVLB6T_zl8HjLFbxdPajS9602lNGK4On7denJwi52sCu8BEbPgwJUHFJSe4B6FEaXZBCLSDyhcJeYEGSpiplQFfWUals4M3-jZAe7t8SsREsDWg6zStWVP5zhCvFd088xzCAbuk-nuK1FleyOb3sq16c5CY923eYhVBth93HlkEwg_2d0kV7tWhckTxnk1DrCtgVIdkSSjx8hhZ0o',
    },
    {
      id: 3,
      name: 'Vintage Clothing Market',
      distance: '3.1 km away',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIAbVCfkxloyinkw0zbJbLOiZp9js04i3sn1hnNt8oQA_Z8X6qzvBqTCwYw9OsRtNU6tPX8jl3zVQAWbKzCqCpJdjqlNWDKz3vNnXb0_rYvPIfN3U2_baY3dL-AgeGpz_fzwT5XtgHSwZCWIdSD6GAwBddv_5cYGMPdP5Ap04MfT-dd8-f4Ga94znVtYiMys-jE0yI7hxbXGuQMtWHc6BkVFwt_sWs1n0CloxjnxH8ylWlgEBZbB_bkpfQi3KqiIO_blEB8Xz0W38',
    },
    {
      id: 4,
      name: 'Artisan Food Market',
      distance: '1.8 km away',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfZOEKgoPtG1w1Vgu793ieao3NCYTeWiRTKUgqOPw_XpfKQYMhc70WrT28CPR7sXw2ue40_yoR1TdZxJacFzThqyux5lulIgoYdb-KR7h5HtYxMR6eiSn4_LxWH9tIx-MIlPIpCXJH-8Ski55dUEpSCfp0zl4iDIVZOYRI_Tx58Oegn55SqA_xmJ9A0lAVWCNDizhDnjC7eQxrnQftKf9_hb5KiiT8m3ssDWQnYqQGa2QcXs9Uo9up57vcI7OSfxToQ7YMpCmXt-Y',
    },
    {
      id: 5,
      name: 'Flea Market',
      distance: '4.2 km away',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9y632-ocHva4ZUIFRRQP1j3-PZDyQpONDITNfHTbV8WQqxrtbzSaVt5-5a1cpxjKc9D-upPOPW-Ai8-vw62rFp1qfOhZv2Iajex28BtIDw7d3vyWxlRazgGLtf935Nf0fDUROXraTVWhTTnZPsTFFjRbygtXDpj3JV-rhBoD2ilDCpfx4rp6onrOL682IdYnDE4ACpwKwAKJABIDBAKqPw1kVBteNzSvsSk2EvOcSLDGzQ5X0RqxMy3DwwmWb_QE3eVBj-bwEIZQ',
    },
    {
      id: 6,
      name: 'Holiday Bazaar',
      distance: '0.9 km away',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCB6PEaDiuWhZzl_kMQfL74cQNI9xKaLC4D9AyvzoT0UMDmGO66Yx-V9lSYeFxeWYpmsvebSh6Qmpf3RcydPCCB_bgLV-EzAFHRJ3ZaBZngfisN6O5NSYEFtXTRMPUucH2xflAh5X6C1RFHQnfMQKSbWc5uqEeff0KlR32A2qbdVsAdgceDbOO5bIRW90pSzRb2EGF_eX5qzTFzerUlHyehlTJhmgxnOuzBJH56J6VwuyGklGeBTt0U5-zu9Cdsme4NFRwO-wRqzVI',
    },
  ];

  const handleItemPress = (item) => {
    navigation.navigate('DetailScreen', { item });
  };

  // Filter market data based on selected subcategory
  const getFilteredData = () => {
    if (!selectedSubcategory) {
      return marketData;
    }
    // Filter based on subcategory type - in real app, you'd have more sophisticated filtering
    return marketData.filter(item => 
      item.name.toLowerCase().includes(selectedSubcategory.name.toLowerCase()) ||
      item.type === selectedSubcategory.name ||
      (item.types && item.types.some(type => 
        type.toLowerCase().includes(selectedSubcategory.name.toLowerCase())
      ))
    );
  };

  const renderMarketItem = ({ item }) => {
    const imageUri = item.photoReference 
      ? placesApiService.getPhotoUrl(item.photoReference, 400)
      : item.image || 'https://via.placeholder.com/300x200?text=No+Image';

    return (
      <TouchableOpacity style={styles.marketItem} onPress={() => handleItemPress(item)}>
        <Image source={{ uri: imageUri }} style={styles.marketImage} />
        <View style={styles.marketContent}>
          <Text style={styles.marketName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.marketAddress} numberOfLines={1}>{item.address}</Text>
          
          {/* Category-specific information display */}
          {item.description && (
            <Text style={styles.marketDescription} numberOfLines={2}>{item.description}</Text>
          )}
          
          {/* Event-specific info */}
          {item.date && (
            <Text style={styles.eventDate}>📅 {item.date} {item.time && `at ${item.time}`}</Text>
          )}
          
          {/* Eventbrite-specific info */}
          {item.venue && (
            <Text style={styles.eventVenue}>🏢 {item.venue}</Text>
          )}
          
          {item.capacity && (
            <Text style={styles.eventCapacity}>👥 Capacity: {item.capacity}</Text>
          )}
          
          {item.is_free !== undefined && (
            <Text style={[styles.eventPrice, item.is_free ? styles.freeEvent : styles.paidEvent]}>
              {item.is_free ? '🆓 Free Event' : '💰 Paid Event'}
            </Text>
          )}
          
          {item.url && (
            <Text style={styles.eventUrl}>🔗 View Details</Text>
          )}
          
          {/* Service-specific info */}
          {item.phone && (
            <Text style={styles.servicePhone}>📞 {item.phone}</Text>
          )}
          
          {/* Hotel-specific info */}
          {item.priceRange && (
            <Text style={styles.hotelPrice}>💰 {item.priceRange}</Text>
          )}
          
          {/* Education-specific info */}
          {item.subjects && Array.isArray(item.subjects) && (
            <Text style={styles.eduSubjects}>📚 {item.subjects.join(', ')}</Text>
          )}
          
          {/* Health-specific info */}
          {item.specialties && Array.isArray(item.specialties) && (
            <Text style={styles.healthSpecialties}>🏥 {item.specialties.join(', ')}</Text>
          )}
          
          <View style={styles.marketDetails}>
            <Text style={styles.marketDistance}>{item.distance}</Text>
            {item.rating > 0 && (
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={12} color="#f59e0b" />
                <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
              </View>
            )}
            {item.price && (
              <Text style={styles.itemPrice}>{item.price}</Text>
            )}
          </View>
          <View style={styles.sourceContainer}>
            <Text style={styles.sourceText}>via {item.source}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={20} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category?.name || 'Categories'}</Text>
        <TouchableOpacity style={styles.searchButton} onPress={searchPlaces}>
          <Ionicons name="refresh" size={20} color="#1f2937" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.sortContainer}
        contentContainerStyle={styles.sortContent}
      >
        {sortOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.sortButton,
              selectedSort === option.id && styles.sortButtonActive
            ]}
            onPress={() => setSelectedSort(option.id)}
          >
            {option.icon && (
              <Ionicons 
                name={option.icon} 
                size={16} 
                color={selectedSort === option.id ? '#ffffff' : '#1f2937'} 
                style={styles.sortIcon}
              />
            )}
            <Text style={[
              styles.sortText,
              selectedSort === option.id && styles.sortTextActive
            ]}>
              {option.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {subcategories && subcategories.length > 0 && (
        <View style={styles.subcategoriesContainer}>
          <Text style={styles.subcategoriesTitle}>Choose Subcategory</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.subcategoriesScroll}
            contentContainerStyle={styles.subcategoriesContent}
          >
            <TouchableOpacity
              style={[
                styles.subcategoryButton,
                selectedSubcategory === null && styles.subcategoryButtonActive
              ]}
              onPress={() => setSelectedSubcategory(null)}
            >
              <View style={styles.subcategoryIcon}>
                <Ionicons name="grid" size={16} color={selectedSubcategory === null ? '#ffffff' : category?.color || '#3b82f6'} />
              </View>
              <Text style={[
                styles.subcategoryText,
                selectedSubcategory === null && styles.subcategoryTextActive
              ]}>All</Text>
            </TouchableOpacity>
            {subcategories.map((subcat) => (
              <TouchableOpacity
                key={subcat.id}
                style={[
                  styles.subcategoryButton,
                  selectedSubcategory?.id === subcat.id && styles.subcategoryButtonActive
                ]}
                onPress={() => setSelectedSubcategory(subcat)}
              >
                <View style={styles.subcategoryIcon}>
                  <Ionicons 
                    name={subcat.icon} 
                    size={16} 
                    color={selectedSubcategory?.id === subcat.id ? '#ffffff' : category?.color || '#3b82f6'} 
                  />
                </View>
                <Text style={[
                  styles.subcategoryText,
                  selectedSubcategory?.id === subcat.id && styles.subcategoryTextActive
                ]}>
                  {subcat.name}
                </Text>
                <View style={styles.subcategoryCount}>
                  <Text style={styles.subcategoryCountText}>{subcat.count}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Searching for {category?.name || 'places'}...</Text>
          <Text style={styles.loadingSubtext}>Using real APIs to find nearby locations</Text>
        </View>
      ) : (
        <FlatList
          data={getFilteredData()}
          renderItem={renderMarketItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.marketList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={64} color="#9ca3af" />
              <Text style={styles.emptyTitle}>
                {category?.name === 'Events & Entertainment' ? 'No events found nearby' : 'No places found'}
              </Text>
              <Text style={styles.emptyText}>
                {category?.name === 'Events & Entertainment' 
                  ? 'We\'re searching for events in a wider area...' 
                  : 'Try adjusting your search criteria or increase the distance range'
                }
              </Text>
              <TouchableOpacity style={styles.retryButton} onPress={searchPlaces}>
                <Text style={styles.retryButtonText}>
                  {category?.name === 'Events & Entertainment' ? '🔍 Search in wider area' : 'Retry Search'}
                </Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  searchButton: {
    padding: 8,
    borderRadius: 20,
  },
  sortContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  sortContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  sortButtonActive: {
    backgroundColor: '#1f2937',
  },
  sortIcon: {
    marginRight: 4,
  },
  sortText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  sortTextActive: {
    color: '#ffffff',
  },
  marketList: {
    padding: 16,
  },
  marketItem: {
    flex: 1,
    margin: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  marketImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#f3f4f6',
  },
  marketName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  marketDistance: {
    fontSize: 14,
    color: '#6b7280',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  subcategoriesContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingVertical: 16,
  },
  subcategoriesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  subcategoriesScroll: {
    paddingLeft: 16,
  },
  subcategoriesContent: {
    paddingRight: 16,
  },
  subcategoryButton: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    minWidth: 80,
  },
  subcategoryButtonActive: {
    backgroundColor: '#3b82f6',
  },
  subcategoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  subcategoryText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  subcategoryTextActive: {
    color: '#ffffff',
  },
  subcategoryCount: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  subcategoryCountText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#3b82f6',
  },
  marketContent: {
    padding: 12,
    flex: 1,
  },
  marketAddress: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  marketDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '500',
  },
  sourceContainer: {
    alignSelf: 'flex-start',
  },
  sourceText: {
    fontSize: 10,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  // Category-specific styles
  marketDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
    lineHeight: 16,
  },
  eventDate: {
    fontSize: 12,
    color: '#059669',
    marginTop: 2,
    fontWeight: '500',
  },
  servicePhone: {
    fontSize: 12,
    color: '#2563eb',
    marginTop: 2,
  },
  hotelPrice: {
    fontSize: 12,
    color: '#dc2626',
    marginTop: 2,
    fontWeight: '600',
  },
  eduSubjects: {
    fontSize: 11,
    color: '#7c3aed',
    marginTop: 2,
  },
  healthSpecialties: {
    fontSize: 11,
    color: '#059669',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '600',
    marginLeft: 8,
  },
  // Eventbrite-specific styles
  eventVenue: {
    fontSize: 12,
    color: '#7c3aed',
    marginTop: 2,
    fontWeight: '500',
  },
  eventCapacity: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  eventPrice: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  freeEvent: {
    color: '#059669',
  },
  paidEvent: {
    color: '#dc2626',
  },
  eventUrl: {
    fontSize: 11,
    color: '#2563eb',
    marginTop: 2,
    textDecorationLine: 'underline',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CategoriesScreen;

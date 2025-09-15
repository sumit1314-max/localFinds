// Places API Service for LocalFinds App
// Integration with multiple free APIs for real business data

import AsyncStorage from '@react-native-async-storage/async-storage';
import eventbriteAPI from './eventbriteAPI';
// import categorySpecificAPIs from './categorySpecificAPIs'; // Temporarily disabled

class PlacesApiService {
  constructor() {
    // API Keys (Store these securely in environment variables)
    this.APIs = {
      GOOGLE_PLACES: {
        key: 'YOUR_GOOGLE_PLACES_API_KEY',
        baseUrl: 'https://maps.googleapis.com/maps/api/place',
        freeTier: 1000, // requests per month
      },
      FOURSQUARE: {
        key: 'YOUR_FOURSQUARE_API_KEY',
        baseUrl: 'https://api.foursquare.com/v3/places',
        freeTier: 1000, // requests per day
      },
      OVERPASS: {
        baseUrl: 'https://overpass-api.de/api/interpreter',
        freeTier: 'unlimited', // completely free
      },
      YELP: {
        key: 'YOUR_YELP_API_KEY',
        baseUrl: 'https://api.yelp.com/v3/businesses',
        freeTier: 5000, // requests per month
      }
    };

    // Enhanced category mapping for different APIs with subcategories
    this.categoryMapping = {
      'Markets & Shopping': {
        google: ['shopping_mall', 'store', 'supermarket', 'department_store'],
        foursquare: ['17000', '17001', '17002', '17003'], // Shopping categories
        overpass: ['shop', 'marketplace', 'mall'],
        yelp: ['shopping', 'markets', 'departmentstores'],
        subcategories: {
          'Farmers Market': {
            google: ['store', 'food'],
            overpass: ['shop=farm', 'amenity=marketplace'],
            keywords: ['farmers', 'organic', 'fresh', 'produce']
          },
          'Flea Market': {
            google: ['store'],
            overpass: ['shop=second_hand', 'shop=antiques'],
            keywords: ['flea', 'antique', 'vintage', 'used']
          },
          'Shopping Mall': {
            google: ['shopping_mall'],
            overpass: ['shop=mall'],
            keywords: ['mall', 'center', 'plaza']
          },
          'Night Market': {
            google: ['store', 'food'],
            overpass: ['amenity=marketplace'],
            keywords: ['night', 'evening', 'late']
          }
        }
      },
      'Food & Grocery': {
        google: ['grocery_or_supermarket', 'food', 'restaurant', 'bakery'],
        foursquare: ['13000', '13001', '13002'], // Food categories
        overpass: ['shop=supermarket', 'amenity=restaurant', 'shop=bakery'],
        yelp: ['grocery', 'food', 'restaurants'],
        subcategories: {
          'Supermarket': {
            google: ['grocery_or_supermarket', 'supermarket'],
            overpass: ['shop=supermarket'],
            keywords: ['supermarket', 'grocery', 'hypermarket']
          },
          'Local Grocery': {
            google: ['grocery_or_supermarket', 'convenience_store'],
            overpass: ['shop=convenience', 'shop=general'],
            keywords: ['local', 'convenience', 'neighborhood']
          },
          'Organic Store': {
            google: ['grocery_or_supermarket', 'health'],
            overpass: ['shop=organic'],
            keywords: ['organic', 'health', 'natural', 'bio']
          },
          'Bakery': {
            google: ['bakery'],
            overpass: ['shop=bakery'],
            keywords: ['bakery', 'bread', 'pastry', 'cake']
          }
        }
      },
      'Events & Entertainment': {
        google: ['amusement_park', 'museum', 'movie_theater', 'night_club'],
        foursquare: ['10000', '10001', '10002'], // Entertainment
        overpass: ['leisure', 'tourism', 'amenity=cinema'],
        yelp: ['eventservices', 'arts', 'entertainment'],
        subcategories: {
          'Festivals': {
            google: ['park', 'tourist_attraction'],
            overpass: ['leisure=park', 'tourism=attraction'],
            keywords: ['festival', 'celebration', 'event', 'fair']
          },
          'Workshops': {
            google: ['school', 'university'],
            overpass: ['amenity=school', 'craft'],
            keywords: ['workshop', 'training', 'class', 'seminar']
          },
          'Exhibitions': {
            google: ['museum', 'art_gallery'],
            overpass: ['tourism=museum', 'tourism=gallery'],
            keywords: ['exhibition', 'gallery', 'museum', 'art']
          },
          'Sports Events': {
            google: ['stadium', 'gym'],
            overpass: ['leisure=stadium', 'leisure=sports_centre'],
            keywords: ['sports', 'stadium', 'match', 'game']
          }
        }
      },
      'Music & Concerts': {
        google: ['night_club', 'restaurant', 'bar'],
        foursquare: ['10032', '10033'], // Nightlife
        overpass: ['amenity=bar', 'amenity=nightclub'],
        yelp: ['nightlife', 'musicvenues'],
        subcategories: {
          'Live Music': {
            google: ['night_club', 'bar'],
            overpass: ['amenity=bar', 'amenity=pub'],
            keywords: ['live music', 'band', 'concert', 'performance']
          },
          'DJ Events': {
            google: ['night_club'],
            overpass: ['amenity=nightclub'],
            keywords: ['dj', 'electronic', 'dance', 'club']
          },
          'Jazz Clubs': {
            google: ['bar', 'restaurant'],
            overpass: ['amenity=bar'],
            keywords: ['jazz', 'blues', 'lounge']
          }
        }
      },
      'Services & Repair': {
        google: ['car_repair', 'electronics_store', 'laundry', 'hair_care'],
        foursquare: ['18000', '18001'], // Services
        overpass: ['shop=repair', 'craft', 'shop=car_repair'],
        yelp: ['auto', 'homeservices', 'beautysvc'],
        subcategories: {
          'Electronics Repair': {
            google: ['electronics_store'],
            overpass: ['shop=electronics', 'craft=electronics_repair'],
            keywords: ['electronics', 'phone', 'computer', 'repair']
          },
          'Automotive': {
            google: ['car_repair', 'gas_station'],
            overpass: ['shop=car_repair', 'amenity=fuel'],
            keywords: ['car', 'auto', 'mechanic', 'garage']
          },
          'Beauty Services': {
            google: ['hair_care', 'beauty_salon'],
            overpass: ['shop=hairdresser', 'shop=beauty'],
            keywords: ['salon', 'beauty', 'hair', 'spa']
          }
        }
      },
      'Education & Tuition': {
        google: ['school', 'university', 'library'],
        foursquare: ['12000', '12001'], // Education
        overpass: ['amenity=school', 'amenity=university'],
        yelp: ['education', 'tutoring'],
        subcategories: {
          'Academic Tutoring': {
            google: ['school'],
            overpass: ['amenity=school'],
            keywords: ['tuition', 'coaching', 'academy', 'study']
          },
          'Music Classes': {
            google: ['school'],
            overpass: ['amenity=music_school'],
            keywords: ['music', 'instrument', 'singing', 'lessons']
          },
          'Sports Training': {
            google: ['gym', 'stadium'],
            overpass: ['leisure=sports_centre'],
            keywords: ['sports', 'training', 'fitness', 'coach']
          }
        }
      },
      'Hotels & Accommodation': {
        google: ['lodging', 'tourist_attraction'],
        foursquare: ['19000', '19001'], // Travel
        overpass: ['tourism=hotel', 'tourism=guest_house'],
        yelp: ['hotels', 'bedbreakfast'],
        subcategories: {
          'Luxury Hotels': {
            google: ['lodging'],
            overpass: ['tourism=hotel'],
            keywords: ['luxury', '5 star', 'premium', 'resort']
          },
          'Budget Hotels': {
            google: ['lodging'],
            overpass: ['tourism=hotel', 'tourism=motel'],
            keywords: ['budget', 'cheap', 'economy', 'lodge']
          },
          'Guest House': {
            google: ['lodging'],
            overpass: ['tourism=guest_house'],
            keywords: ['guest house', 'homestay', 'b&b']
          }
        }
      },
      'Health & Wellness': {
        google: ['hospital', 'pharmacy', 'dentist', 'gym'],
        foursquare: ['14000', '14001'], // Health
        overpass: ['amenity=hospital', 'amenity=pharmacy'],
        yelp: ['health', 'fitness'],
        subcategories: {
          'Hospitals': {
            google: ['hospital'],
            overpass: ['amenity=hospital'],
            keywords: ['hospital', 'medical', 'emergency']
          },
          'Pharmacies': {
            google: ['pharmacy'],
            overpass: ['amenity=pharmacy'],
            keywords: ['pharmacy', 'medicine', 'drugstore']
          },
          'Gyms': {
            google: ['gym'],
            overpass: ['leisure=fitness_centre'],
            keywords: ['gym', 'fitness', 'workout', 'health']
          }
        }
      }
    };
  }

  // Cache management
  async getCachedData(key) {
    try {
      const cached = await AsyncStorage.getItem(`places_cache_${key}`);
      if (cached) {
        const data = JSON.parse(cached);
        const now = Date.now();
        // Cache valid for 1 hour
        if (now - data.timestamp < 3600000) {
          return data.results;
        }
      }
    } catch (error) {
      console.error('Cache read error:', error);
    }
    return null;
  }

  async setCachedData(key, data) {
    try {
      const cacheData = {
        results: data,
        timestamp: Date.now()
      };
      await AsyncStorage.setItem(`places_cache_${key}`, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Cache write error:', error);
    }
  }

  // Google Places API with subcategory support
  async searchGooglePlaces(latitude, longitude, radius, category, subcategory = null) {
    const searchKey = subcategory ? `${category}_${subcategory}` : category;
    const cacheKey = `google_${latitude}_${longitude}_${radius}_${searchKey}`;
    const cached = await this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const types = this.getSearchParams(category, subcategory, 'google');
      if (types.length === 0) return [];

      const typeParam = types.join('|');
      
      let url = `${this.APIs.GOOGLE_PLACES.baseUrl}/nearbysearch/json?` +
        `location=${latitude},${longitude}&` +
        `radius=${radius * 1000}&` +
        `type=${typeParam}&` +
        `key=${this.APIs.GOOGLE_PLACES.key}`;

      // Add keyword search for subcategories
      if (subcategory) {
        const categoryData = this.categoryMapping[category];
        const subcatData = categoryData?.subcategories?.[subcategory];
        if (subcatData?.keywords) {
          const keyword = subcatData.keywords[0]; // Use first keyword
          url += `&keyword=${encodeURIComponent(keyword)}`;
        }
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        const formatted = this.formatGoogleResults(data.results);
        await this.setCachedData(cacheKey, formatted);
        return formatted;
      }
    } catch (error) {
      console.error('Google Places API error:', error);
    }
    return [];
  }

  // Foursquare Places API
  async searchFoursquarePlaces(latitude, longitude, radius, category) {
    const cacheKey = `foursquare_${latitude}_${longitude}_${radius}_${category}`;
    const cached = await this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const categories = this.categoryMapping[category]?.foursquare || [];
      const categoryParam = categories.join(',');
      
      const url = `${this.APIs.FOURSQUARE.baseUrl}/search?` +
        `ll=${latitude},${longitude}&` +
        `radius=${radius * 1000}&` +
        `categories=${categoryParam}&` +
        `limit=50`;

      const response = await fetch(url, {
        headers: {
          'Authorization': this.APIs.FOURSQUARE.key,
          'Accept': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.results) {
        const formatted = this.formatFoursquareResults(data.results);
        await this.setCachedData(cacheKey, formatted);
        return formatted;
      }
    } catch (error) {
      console.error('Foursquare API error:', error);
    }
    return [];
  }

  // Overpass API (OpenStreetMap) - Completely Free with subcategory support
  async searchOverpassPlaces(latitude, longitude, radius, category, subcategory = null) {
    const searchKey = subcategory ? `${category}_${subcategory}` : category;
    const cacheKey = `overpass_${latitude}_${longitude}_${radius}_${searchKey}`;
    const cached = await this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const tags = this.getSearchParams(category, subcategory, 'overpass');
      if (tags.length === 0) return [];
      
      const tagQuery = tags.map(tag => {
        if (tag.includes('=')) {
          return `node[${tag}]`;
        } else {
          return `node[${tag}]`;
        }
      }).join(';');
      
      const query = `
        [out:json][timeout:25];
        (
          ${tagQuery}(around:${radius * 1000},${latitude},${longitude});
        );
        out body;
      `;

      const response = await fetch(this.APIs.OVERPASS.baseUrl, {
        method: 'POST',
        body: query,
        headers: {
          'Content-Type': 'text/plain'
        }
      });

      const data = await response.json();
      
      if (data.elements) {
        let formatted = this.formatOverpassResults(data.elements);
        
        // Additional filtering for subcategories using keywords
        if (subcategory) {
          const categoryData = this.categoryMapping[category];
          const subcatData = categoryData?.subcategories?.[subcategory];
          if (subcatData?.keywords) {
            formatted = formatted.filter(place => {
              const placeName = place.name.toLowerCase();
              return subcatData.keywords.some(keyword => 
                placeName.includes(keyword.toLowerCase())
              );
            });
          }
        }
        
        await this.setCachedData(cacheKey, formatted);
        return formatted;
      }
    } catch (error) {
      console.error('Overpass API error:', error);
    }
    return [];
  }

  // Combined search with fallback and subcategory support + Category-specific APIs
  async searchPlaces(latitude, longitude, radius, category, subcategory = null) {
    const searchTarget = subcategory ? `${subcategory} in ${category}` : category;
    console.log(`🔍 Searching for ${searchTarget} within ${radius}km of ${latitude}, ${longitude}`);

    try {
      // 🎯 STEP 1: Try category-specific APIs first (best relevance)
      let categoryResults = await this.searchCategorySpecificAPIs(latitude, longitude, radius, category, subcategory);
      
      // 🌍 STEP 2: Try Google Places (best data quality)
      let googleResults = await this.searchGooglePlaces(latitude, longitude, radius, category, subcategory);
      
      // 🏢 STEP 3: Fallback to Foursquare
      let foursquareResults = await this.searchFoursquarePlaces(latitude, longitude, radius, category, subcategory);
      
      // 🗺️ STEP 4: Final fallback to Overpass (always free)
      let overpassResults = await this.searchOverpassPlaces(latitude, longitude, radius, category, subcategory);

      // Combine and deduplicate results
      const allResults = [
        ...categoryResults,
        ...googleResults,
        ...foursquareResults,
        ...overpassResults
      ];

      // Remove duplicates based on name and location
      const uniqueResults = this.removeDuplicates(allResults);
      
      console.log(`✅ Found ${uniqueResults.length} total places from all APIs`);
      return uniqueResults;

    } catch (error) {
      console.error('Places search error:', error);
      return [];
    }
  }

  // 🎯 Category-specific API router (Using mock data for stability)
  async searchCategorySpecificAPIs(latitude, longitude, radius, category, subcategory = null) {
    try {
      console.log(`🎯 Category-specific search for ${category} ${subcategory ? `> ${subcategory}` : ''}`);
      
      switch (category) {
        case 'Events & Entertainment':
          console.log(`🎪 Calling Eventbrite API for ${subcategory || 'all events'}`);
          const eventbriteResults = await eventbriteAPI.searchEvents(latitude, longitude, radius, subcategory);
          console.log(`🎪 Eventbrite returned ${eventbriteResults.length} events`);
          return eventbriteResults;
        
        case 'Music & Concerts':
          return this.getMockMusicData(subcategory);
        
        case 'Food & Grocery':
          return this.getMockFoodData(subcategory);
        
        case 'Services & Repair':
          return this.getMockServicesData(subcategory);
        
        case 'Hotels & Accommodation':
          return this.getMockHotelsData(subcategory);
        
        case 'Education & Tuition':
          return this.getMockEducationData(subcategory);
        
        case 'Health & Wellness':
          return this.getMockHealthData(subcategory);
        
        default:
          return []; // For Markets & Shopping, use general APIs
      }
    } catch (error) {
      console.error(`Category-specific API error for ${category}:`, error);
      return [];
    }
  }

  // 🎭 MOCK DATA METHODS FOR CATEGORY-SPECIFIC APIS
  // ================================================

  getMockEventsData(subcategory) {
    const baseEvents = [
      {
        id: 'evt_1',
        name: 'Kolkata Book Fair 2024',
        description: 'Annual international book fair featuring local and international publishers',
        address: 'Salt Lake Central Park, Sector V, Kolkata',
        latitude: 22.5726,
        longitude: 88.3639,
        distance: '2.1 km',
        date: '2024-01-15',
        time: '10:00 AM',
        category: 'Exhibitions',
        price: 'Free',
        image: 'https://via.placeholder.com/300x200?text=Book+Fair',
        source: 'Eventbrite',
        rating: 4.5
      },
      {
        id: 'evt_2',
        name: 'Digital Marketing Workshop',
        description: 'Learn latest digital marketing strategies and tools',
        address: 'TechHub Kolkata, Sector V, Salt Lake City',
        latitude: 22.5726,
        longitude: 88.3639,
        distance: '1.8 km',
        date: '2024-01-20',
        time: '2:00 PM',
        category: 'Workshops',
        price: '₹500',
        image: 'https://via.placeholder.com/300x200?text=Digital+Workshop',
        source: 'Eventbrite',
        rating: 4.3
      },
      {
        id: 'evt_3',
        name: 'Durga Puja Cultural Festival',
        description: 'Traditional cultural festival with music, dance, and food',
        address: 'Deshapriya Park, Kalighat, Kolkata',
        latitude: 22.5200,
        longitude: 88.3469,
        distance: '3.2 km',
        date: '2024-10-10',
        time: '6:00 PM',
        category: 'Festivals',
        price: 'Free',
        image: 'https://via.placeholder.com/300x200?text=Durga+Puja',
        source: 'Eventbrite',
        rating: 4.8
      }
    ];

    return subcategory 
      ? baseEvents.filter(event => event.category === subcategory)
      : baseEvents;
  }

  getMockMusicData(subcategory) {
    const baseConcerts = [
      {
        id: 'music_1',
        name: 'Jazz Night at Blue Note',
        description: 'Live jazz performance by Kolkata Jazz Ensemble',
        address: 'Blue Note Cafe, Park Street, Kolkata',
        latitude: 22.5540,
        longitude: 88.3509,
        distance: '1.5 km',
        date: '2024-01-25',
        time: '8:00 PM',
        category: 'Jazz Clubs',
        price: '₹800',
        image: 'https://via.placeholder.com/300x200?text=Jazz+Night',
        source: 'Bandsintown',
        rating: 4.6
      },
      {
        id: 'music_2',
        name: 'Electronic Dance Night',
        description: 'DJ Nucleya live performance',
        address: 'Aqua Club, Salt Lake City, Kolkata',
        latitude: 22.5726,
        longitude: 88.3639,
        distance: '2.3 km',
        date: '2024-02-01',
        time: '9:00 PM',
        category: 'DJ Events',
        price: '₹1500',
        image: 'https://via.placeholder.com/300x200?text=DJ+Night',
        source: 'Bandsintown',
        rating: 4.4
      },
      {
        id: 'music_3',
        name: 'Live Rock Concert',
        description: 'Fossils Band live performance',
        address: 'Netaji Indoor Stadium, Eden Gardens, Kolkata',
        latitude: 22.5645,
        longitude: 88.3433,
        distance: '2.8 km',
        date: '2024-02-10',
        time: '7:00 PM',
        category: 'Live Music',
        price: '₹1200',
        image: 'https://via.placeholder.com/300x200?text=Rock+Concert',
        source: 'Bandsintown',
        rating: 4.7
      }
    ];

    return subcategory 
      ? baseConcerts.filter(concert => concert.category === subcategory)
      : baseConcerts;
  }

  getMockFoodData(subcategory) {
    const baseFoodStores = [
      {
        id: 'food_1',
        name: 'Fresh & Organic Store',
        description: 'Certified organic products and fresh vegetables',
        address: 'Salt Lake Sector V, Kolkata',
        latitude: 22.5726,
        longitude: 88.3639,
        distance: '1.2 km',
        category: 'Organic Store',
        rating: 4.5,
        image: 'https://via.placeholder.com/300x200?text=Organic+Store',
        source: 'OpenFoodFacts'
      },
      {
        id: 'food_2',
        name: 'Annapurna Bakery',
        description: 'Fresh bread, cakes, and pastries daily',
        address: 'Gariahat Market, Kolkata',
        latitude: 22.5200,
        longitude: 88.3669,
        distance: '2.1 km',
        category: 'Bakery',
        rating: 4.3,
        image: 'https://via.placeholder.com/300x200?text=Bakery',
        source: 'OpenFoodFacts'
      },
      {
        id: 'food_3',
        name: 'Big Bazaar Supermarket',
        description: 'Complete grocery shopping destination',
        address: 'Forum Mall, Elgin Road, Kolkata',
        latitude: 22.5540,
        longitude: 88.3509,
        distance: '1.8 km',
        category: 'Supermarket',
        rating: 4.1,
        image: 'https://via.placeholder.com/300x200?text=Supermarket',
        source: 'OpenFoodFacts'
      }
    ];

    return subcategory 
      ? baseFoodStores.filter(store => store.category === subcategory)
      : baseFoodStores;
  }

  getMockServicesData(subcategory) {
    const baseServices = [
      {
        id: 'service_1',
        name: 'TechFix Electronics Repair',
        description: 'Mobile, laptop, and electronics repair services',
        address: 'Esplanade, Kolkata',
        latitude: 22.5675,
        longitude: 88.3433,
        distance: '1.4 km',
        category: 'Electronics Repair',
        rating: 4.4,
        price: '₹₹',
        image: 'https://via.placeholder.com/300x200?text=Electronics+Repair',
        source: 'Yelp',
        phone: '+91 98765 43210'
      },
      {
        id: 'service_2',
        name: 'AutoCare Service Center',
        description: 'Complete automotive repair and maintenance',
        address: 'Ultadanga, Kolkata',
        latitude: 22.5950,
        longitude: 88.3850,
        distance: '2.3 km',
        category: 'Automotive',
        rating: 4.2,
        price: '₹₹₹',
        image: 'https://via.placeholder.com/300x200?text=Auto+Repair',
        source: 'Yelp',
        phone: '+91 98765 43211'
      },
      {
        id: 'service_3',
        name: 'Glamour Beauty Salon',
        description: 'Hair styling, beauty treatments, and spa services',
        address: 'Park Street, Kolkata',
        latitude: 22.5540,
        longitude: 88.3509,
        distance: '1.6 km',
        category: 'Beauty Services',
        rating: 4.6,
        price: '₹₹',
        image: 'https://via.placeholder.com/300x200?text=Beauty+Salon',
        source: 'Yelp',
        phone: '+91 98765 43212'
      }
    ];

    return subcategory 
      ? baseServices.filter(service => service.category === subcategory)
      : baseServices;
  }

  getMockHotelsData(subcategory) {
    const baseHotels = [
      {
        id: 'hotel_1',
        name: 'The Oberoi Grand',
        description: 'Luxury heritage hotel in the heart of Kolkata',
        address: '15 Jawaharlal Nehru Road, Kolkata',
        latitude: 22.5645,
        longitude: 88.3433,
        distance: '1.8 km',
        category: 'Luxury Hotels',
        rating: 4.8,
        price: '₹₹₹₹₹',
        image: 'https://via.placeholder.com/300x200?text=Luxury+Hotel',
        source: 'Amadeus',
        priceRange: '₹15,000 - ₹25,000'
      },
      {
        id: 'hotel_2',
        name: 'Hotel Shilton',
        description: 'Comfortable budget accommodation',
        address: 'Park Street, Kolkata',
        latitude: 22.5540,
        longitude: 88.3509,
        distance: '1.2 km',
        category: 'Budget Hotels',
        rating: 4.1,
        price: '₹₹',
        image: 'https://via.placeholder.com/300x200?text=Budget+Hotel',
        source: 'Amadeus',
        priceRange: '₹2,000 - ₹4,000'
      },
      {
        id: 'hotel_3',
        name: 'Backpacker\'s Den Guest House',
        description: 'Cozy guest house for travelers and backpackers',
        address: 'Sudder Street, Kolkata',
        latitude: 22.5540,
        longitude: 88.3509,
        distance: '1.5 km',
        category: 'Guest House',
        rating: 4.0,
        price: '₹',
        image: 'https://via.placeholder.com/300x200?text=Guest+House',
        source: 'Amadeus',
        priceRange: '₹800 - ₹1,500'
      }
    ];

    return subcategory 
      ? baseHotels.filter(hotel => hotel.category === subcategory)
      : baseHotels;
  }

  getMockEducationData(subcategory) {
    const baseEducation = [
      {
        id: 'edu_1',
        name: 'Academic Excellence Coaching',
        description: 'IIT-JEE and NEET preparation classes',
        address: 'Salt Lake Sector V, Kolkata',
        latitude: 22.5726,
        longitude: 88.3639,
        distance: '1.8 km',
        category: 'Academic Tutoring',
        rating: 4.5,
        price: '₹₹₹',
        image: 'https://via.placeholder.com/300x200?text=Coaching+Center',
        source: 'Education Directory',
        subjects: ['Mathematics', 'Physics', 'Chemistry']
      },
      {
        id: 'edu_2',
        name: 'Melody Music Academy',
        description: 'Learn guitar, piano, and vocal music',
        address: 'Gariahat, Kolkata',
        latitude: 22.5200,
        longitude: 88.3669,
        distance: '2.1 km',
        category: 'Music Classes',
        rating: 4.6,
        price: '₹₹',
        image: 'https://via.placeholder.com/300x200?text=Music+Academy',
        source: 'Education Directory',
        subjects: ['Guitar', 'Piano', 'Vocal']
      },
      {
        id: 'edu_3',
        name: 'FitZone Sports Training',
        description: 'Cricket, football, and fitness training',
        address: 'Eden Gardens, Kolkata',
        latitude: 22.5645,
        longitude: 88.3433,
        distance: '2.5 km',
        category: 'Sports Training',
        rating: 4.3,
        price: '₹₹',
        image: 'https://via.placeholder.com/300x200?text=Sports+Training',
        source: 'Education Directory',
        subjects: ['Cricket', 'Football', 'Fitness']
      }
    ];

    return subcategory 
      ? baseEducation.filter(edu => edu.category === subcategory)
      : baseEducation;
  }

  getMockHealthData(subcategory) {
    const baseHealth = [
      {
        id: 'health_1',
        name: 'Apollo Gleneagles Hospital',
        description: 'Multi-specialty hospital with 24/7 emergency',
        address: '58 Canal Circular Road, Kolkata',
        latitude: 22.5200,
        longitude: 88.3669,
        distance: '2.3 km',
        category: 'Hospitals',
        rating: 4.4,
        price: '₹₹₹₹',
        image: 'https://via.placeholder.com/300x200?text=Hospital',
        source: 'Health Directory',
        specialties: ['Cardiology', 'Neurology', 'Oncology']
      },
      {
        id: 'health_2',
        name: 'MedPlus Pharmacy',
        description: 'Complete medical store with home delivery',
        address: 'Park Street, Kolkata',
        latitude: 22.5540,
        longitude: 88.3509,
        distance: '1.1 km',
        category: 'Pharmacies',
        rating: 4.2,
        price: '₹₹',
        image: 'https://via.placeholder.com/300x200?text=Pharmacy',
        source: 'Health Directory'
      },
      {
        id: 'health_3',
        name: 'PowerFit Gym',
        description: 'Modern gym with certified trainers',
        address: 'Salt Lake City, Kolkata',
        latitude: 22.5726,
        longitude: 88.3639,
        distance: '1.9 km',
        category: 'Gyms',
        rating: 4.3,
        price: '₹₹',
        image: 'https://via.placeholder.com/300x200?text=Gym',
        source: 'Health Directory'
      }
    ];

    return subcategory 
      ? baseHealth.filter(health => health.category === subcategory)
      : baseHealth;
  }

  // Remove duplicate results
  removeDuplicates(results) {
    const seen = new Set();
    return results.filter(item => {
      const key = `${item.name}_${item.latitude}_${item.longitude}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  // Get appropriate search parameters for category/subcategory
  getSearchParams(category, subcategory = null, apiType = 'google') {
    const categoryData = this.categoryMapping[category];
    if (!categoryData) return [];

    // If subcategory is specified, use its specific parameters
    if (subcategory && categoryData.subcategories && categoryData.subcategories[subcategory]) {
      const subcatData = categoryData.subcategories[subcategory];
      return subcatData[apiType] || categoryData[apiType] || [];
    }

    // Otherwise use main category parameters
    return categoryData[apiType] || [];
  }

  // Format Google Places results
  formatGoogleResults(results) {
    return results.map(place => ({
      id: place.place_id,
      name: place.name,
      address: place.vicinity || place.formatted_address,
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      rating: place.rating || 0,
      priceLevel: place.price_level || 0,
      types: place.types,
      photoReference: place.photos?.[0]?.photo_reference,
      isOpen: place.opening_hours?.open_now,
      source: 'google'
    }));
  }

  // Format Foursquare results
  formatFoursquareResults(results) {
    return results.map(place => ({
      id: place.fsq_id,
      name: place.name,
      address: place.location?.formatted_address,
      latitude: place.geocodes?.main?.latitude,
      longitude: place.geocodes?.main?.longitude,
      rating: place.rating || 0,
      priceLevel: place.price || 0,
      types: place.categories?.map(cat => cat.name) || [],
      photoReference: null,
      isOpen: null,
      source: 'foursquare'
    }));
  }

  // Format Overpass results
  formatOverpassResults(results) {
    return results.map(place => ({
      id: place.id.toString(),
      name: place.tags?.name || 'Unknown',
      address: this.formatOverpassAddress(place.tags),
      latitude: place.lat,
      longitude: place.lon,
      rating: 0,
      priceLevel: 0,
      types: Object.keys(place.tags || {}),
      photoReference: null,
      isOpen: null,
      source: 'overpass'
    }));
  }

  formatOverpassAddress(tags) {
    const parts = [];
    if (tags?.['addr:street']) parts.push(tags['addr:street']);
    if (tags?.['addr:city']) parts.push(tags['addr:city']);
    return parts.join(', ') || 'Address not available';
  }

  // Get place photo URL (Google Places)
  getPhotoUrl(photoReference, maxWidth = 400) {
    if (!photoReference) return null;
    return `${this.APIs.GOOGLE_PLACES.baseUrl}/photo?` +
      `maxwidth=${maxWidth}&` +
      `photoreference=${photoReference}&` +
      `key=${this.APIs.GOOGLE_PLACES.key}`;
  }

  // Calculate distance between two points
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}

export default new PlacesApiService();

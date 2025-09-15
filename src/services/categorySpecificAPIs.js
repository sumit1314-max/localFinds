// 🎯 CATEGORY-SPECIFIC FREE APIs SERVICE
// ======================================

class CategorySpecificAPIs {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 60 * 60 * 1000; // 1 hour
  }

  // 🎉 EVENTS & ENTERTAINMENT APIs
  // ===============================

  // Eventbrite API - 1,000 requests/hour FREE
  async searchEventbriteEvents(latitude, longitude, radius, subcategory = null) {
    const cacheKey = `eventbrite_${latitude}_${longitude}_${radius}_${subcategory}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      // Eventbrite uses public events endpoint (no auth required for public events)
      let url = `https://www.eventbriteapi.com/v3/events/search/?` +
        `location.latitude=${latitude}&` +
        `location.longitude=${longitude}&` +
        `location.within=${radius}km&` +
        `expand=venue,category&` +
        `sort_by=distance`;

      // Add category filters
      if (subcategory) {
        const categoryMap = {
          'Festivals': '110', // Festivals & Fairs
          'Workshops': '101', // Business & Professional
          'Exhibitions': '105', // Performing & Visual Arts
          'Sports Events': '108' // Sports & Fitness
        };
        const categoryId = categoryMap[subcategory];
        if (categoryId) {
          url += `&categories=${categoryId}`;
        }
      }

      console.log('🎪 Searching Eventbrite events...');
      
      // Since Eventbrite requires authentication, we'll use a mock response
      // In production, you'd need to register for API key
      const mockEvents = this.getMockEventbriteData(subcategory);
      
      this.setCachedData(cacheKey, mockEvents);
      return mockEvents;

    } catch (error) {
      console.error('Eventbrite API error:', error);
      return [];
    }
  }

  getMockEventbriteData(subcategory) {
    const baseEvents = [
      {
        id: 'evt_1',
        name: 'Kolkata Book Fair 2024',
        description: 'Annual international book fair featuring local and international publishers',
        venue: 'Salt Lake Central Park',
        address: 'Sector V, Salt Lake City, Kolkata',
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
        venue: 'TechHub Kolkata',
        address: 'Sector V, Salt Lake City, Kolkata',
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
        venue: 'Deshapriya Park',
        address: 'Kalighat, Kolkata',
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

  // 🎵 MUSIC & CONCERTS APIs
  // ========================

  // Bandsintown API - Rate limited FREE
  async searchBandsintownConcerts(latitude, longitude, radius, subcategory = null) {
    const cacheKey = `bandsintown_${latitude}_${longitude}_${radius}_${subcategory}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      console.log('🎵 Searching Bandsintown concerts...');
      
      // Bandsintown API endpoint (requires app_id)
      // For demo, using mock data
      const mockConcerts = this.getMockBandsintownData(subcategory);
      
      this.setCachedData(cacheKey, mockConcerts);
      return mockConcerts;

    } catch (error) {
      console.error('Bandsintown API error:', error);
      return [];
    }
  }

  getMockBandsintownData(subcategory) {
    const baseConcerts = [
      {
        id: 'concert_1',
        name: 'Jazz Night at Blue Note',
        artist: 'Kolkata Jazz Ensemble',
        venue: 'Blue Note Cafe',
        address: 'Park Street, Kolkata',
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
        id: 'concert_2',
        name: 'Electronic Dance Night',
        artist: 'DJ Nucleya',
        venue: 'Aqua Club',
        address: 'Salt Lake City, Kolkata',
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
        id: 'concert_3',
        name: 'Live Rock Concert',
        artist: 'Fossils Band',
        venue: 'Netaji Indoor Stadium',
        address: 'Eden Gardens, Kolkata',
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

  // 🍎 FOOD & GROCERY APIs
  // ======================

  // OpenFoodFacts API - Unlimited FREE
  async searchOpenFoodFacts(latitude, longitude, radius, subcategory = null) {
    const cacheKey = `openfoodfacts_${latitude}_${longitude}_${radius}_${subcategory}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      console.log('🍎 Searching OpenFoodFacts data...');
      
      // OpenFoodFacts doesn't have location-based search
      // So we'll provide relevant food stores/markets
      const mockFoodData = this.getMockFoodData(subcategory);
      
      this.setCachedData(cacheKey, mockFoodData);
      return mockFoodData;

    } catch (error) {
      console.error('OpenFoodFacts API error:', error);
      return [];
    }
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
        source: 'OpenFoodFacts',
        types: ['organic', 'vegetables', 'grocery']
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
        source: 'OpenFoodFacts',
        types: ['bakery', 'bread', 'cakes']
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
        source: 'OpenFoodFacts',
        types: ['supermarket', 'grocery', 'household']
      }
    ];

    return subcategory 
      ? baseFoodStores.filter(store => store.category === subcategory)
      : baseFoodStores;
  }

  // 🔧 SERVICES & REPAIR APIs
  // =========================

  // Yelp API - 5,000 calls/month FREE
  async searchYelpServices(latitude, longitude, radius, subcategory = null) {
    const cacheKey = `yelp_services_${latitude}_${longitude}_${radius}_${subcategory}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      console.log('🔧 Searching Yelp services...');
      
      // Yelp API requires authentication
      // Using mock data for demo
      const mockServices = this.getMockYelpServicesData(subcategory);
      
      this.setCachedData(cacheKey, mockServices);
      return mockServices;

    } catch (error) {
      console.error('Yelp API error:', error);
      return [];
    }
  }

  getMockYelpServicesData(subcategory) {
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
        types: ['electronics', 'mobile', 'laptop'],
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
        types: ['automotive', 'car', 'repair'],
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
        types: ['beauty', 'salon', 'hair'],
        phone: '+91 98765 43212'
      }
    ];

    return subcategory 
      ? baseServices.filter(service => service.category === subcategory)
      : baseServices;
  }

  // 🏨 HOTELS & ACCOMMODATION APIs
  // ==============================

  // Amadeus Travel API - 1,000 requests/month FREE
  async searchAmadeusHotels(latitude, longitude, radius, subcategory = null) {
    const cacheKey = `amadeus_${latitude}_${longitude}_${radius}_${subcategory}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      console.log('🏨 Searching Amadeus hotels...');
      
      // Amadeus API requires authentication
      // Using mock data for demo
      const mockHotels = this.getMockAmadeusData(subcategory);
      
      this.setCachedData(cacheKey, mockHotels);
      return mockHotels;

    } catch (error) {
      console.error('Amadeus API error:', error);
      return [];
    }
  }

  getMockAmadeusData(subcategory) {
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
        amenities: ['spa', 'pool', 'restaurant', 'wifi'],
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
        amenities: ['wifi', 'restaurant', 'parking'],
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
        amenities: ['wifi', 'shared_kitchen', 'common_area'],
        priceRange: '₹800 - ₹1,500'
      }
    ];

    return subcategory 
      ? baseHotels.filter(hotel => hotel.category === subcategory)
      : baseHotels;
  }

  // 🎓 EDUCATION & TUITION APIs
  // ===========================

  async searchEducationServices(latitude, longitude, radius, subcategory = null) {
    const cacheKey = `education_${latitude}_${longitude}_${radius}_${subcategory}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      console.log('🎓 Searching education services...');
      
      const mockEducation = this.getMockEducationData(subcategory);
      
      this.setCachedData(cacheKey, mockEducation);
      return mockEducation;

    } catch (error) {
      console.error('Education API error:', error);
      return [];
    }
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
        subjects: ['Mathematics', 'Physics', 'Chemistry'],
        batch_size: '20-25 students'
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
        subjects: ['Guitar', 'Piano', 'Vocal'],
        batch_size: '5-8 students'
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
        subjects: ['Cricket', 'Football', 'Fitness'],
        batch_size: '10-15 students'
      }
    ];

    return subcategory 
      ? baseEducation.filter(edu => edu.category === subcategory)
      : baseEducation;
  }

  // 🏥 HEALTH & WELLNESS APIs
  // =========================

  async searchHealthServices(latitude, longitude, radius, subcategory = null) {
    const cacheKey = `health_${latitude}_${longitude}_${radius}_${subcategory}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      console.log('🏥 Searching health services...');
      
      const mockHealth = this.getMockHealthData(subcategory);
      
      this.setCachedData(cacheKey, mockHealth);
      return mockHealth;

    } catch (error) {
      console.error('Health API error:', error);
      return [];
    }
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
        specialties: ['Cardiology', 'Neurology', 'Oncology'],
        emergency: true
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
        source: 'Health Directory',
        services: ['Prescription', 'OTC', 'Home Delivery'],
        hours: '8 AM - 10 PM'
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
        source: 'Health Directory',
        facilities: ['Cardio', 'Weights', 'Personal Training'],
        hours: '5 AM - 11 PM'
      }
    ];

    return subcategory 
      ? baseHealth.filter(health => health.category === subcategory)
      : baseHealth;
  }

  // 💾 CACHE MANAGEMENT
  // ===================

  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      console.log(`📦 Using cached data for ${key}`);
      return cached.data;
    }
    return null;
  }

  setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clearCache() {
    this.cache.clear();
    console.log('🗑️ Cache cleared');
  }
}

const categorySpecificAPIs = new CategorySpecificAPIs();
export default categorySpecificAPIs;

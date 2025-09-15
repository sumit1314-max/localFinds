// 🎉 EVENTBRITE API SERVICE FOR EVENTS & ENTERTAINMENT
// =====================================================

class EventbriteAPI {
  constructor() {
    // Eventbrite API Configuration
    this.baseUrl = 'https://www.eventbriteapi.com/v3';
    this.apiKey = 'YOUR_EVENTBRITE_API_KEY'; // Replace with actual API key
    this.cache = new Map();
    this.cacheExpiry = 30 * 60 * 1000; // 30 minutes cache
    
    // Indian cities mapping for better search
    this.indianCities = {
      'kolkata': { lat: 22.5726, lng: 88.3639, name: 'Kolkata' },
      'mumbai': { lat: 19.0760, lng: 72.8777, name: 'Mumbai' },
      'delhi': { lat: 28.7041, lng: 77.1025, name: 'Delhi' },
      'bangalore': { lat: 12.9716, lng: 77.5946, name: 'Bangalore' },
      'chennai': { lat: 13.0827, lng: 80.2707, name: 'Chennai' },
      'hyderabad': { lat: 17.3850, lng: 78.4867, name: 'Hyderabad' },
      'pune': { lat: 18.5204, lng: 73.8567, name: 'Pune' },
      'ahmedabad': { lat: 23.0225, lng: 72.5714, name: 'Ahmedabad' }
    };

    // Event categories mapping
    this.eventCategories = {
      'Festivals': '110', // Festivals & Fairs
      'Workshops': '101', // Business & Professional
      'Exhibitions': '105', // Performing & Visual Arts
      'Sports Events': '108', // Sports & Fitness
      'Music': '103', // Music
      'Food & Drink': '110', // Food & Drink
      'Technology': '102', // Science & Technology
      'Health & Wellness': '108', // Health & Wellness
      'Education': '101', // Education
      'Community': '111' // Community & Culture
    };
  }

  // 🎯 Main search method for events
  async searchEvents(latitude, longitude, radius, subcategory = null) {
    const cacheKey = `eventbrite_${latitude}_${longitude}_${radius}_${subcategory}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      console.log('📦 Using cached Eventbrite data');
      return cached;
    }

    try {
      console.log(`🎪 Searching Eventbrite events near ${latitude}, ${longitude} within ${radius}km`);
      
      // Always use mock data for now (since API key not configured)
      console.log('⚠️ Using Eventbrite mock data for testing');
      const mockData = this.getMockEventbriteData(subcategory);
      
      // If no events found in current radius, try expanded radius
      if (mockData.length === 0 && radius < 50) {
        console.log(`🔍 No events found in ${radius}km, searching in expanded radius...`);
        const expandedData = this.getMockEventbriteData(subcategory, true);
        this.setCachedData(cacheKey, expandedData);
        return expandedData;
      }
      
      this.setCachedData(cacheKey, mockData);
      return mockData;

    } catch (error) {
      console.error('Eventbrite API error:', error);
      // Fallback to mock data
      const mockData = this.getMockEventbriteData(subcategory);
      return mockData;
    }
  }

  // 🌐 Real Eventbrite API call
  async fetchEventbriteEvents(latitude, longitude, radius, subcategory = null) {
    try {
      // Build search parameters
      const params = new URLSearchParams({
        'location.latitude': latitude.toString(),
        'location.longitude': longitude.toString(),
        'location.within': `${radius}km`,
        'expand': 'venue,category',
        'sort_by': 'distance',
        'status': 'live',
        'time_filter': 'current_future'
      });

      // Add category filter if specified
      if (subcategory && this.eventCategories[subcategory]) {
        params.append('categories', this.eventCategories[subcategory]);
      }

      const url = `${this.baseUrl}/events/search/?${params.toString()}`;
      
      console.log(`🔍 Eventbrite API URL: ${url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Eventbrite API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.events) {
        const formattedEvents = this.formatEventbriteResults(data.events);
        console.log(`✅ Found ${formattedEvents.length} events via Eventbrite API`);
        return formattedEvents;
      }

      return [];

    } catch (error) {
      console.error('Eventbrite fetch error:', error);
      throw error;
    }
  }

  // 🎨 Format Eventbrite API results
  formatEventbriteResults(events) {
    return events.map(event => {
      const venue = event.venue || {};
      const category = event.category || {};
      
      return {
        id: event.id,
        name: event.name?.text || 'Event',
        description: event.description?.text || '',
        address: this.formatAddress(venue),
        latitude: venue.latitude || 0,
        longitude: venue.longitude || 0,
        distance: this.calculateDistance(event),
        date: this.formatDate(event.start?.local),
        time: this.formatTime(event.start?.local),
        category: category.name || 'General',
        price: this.formatPrice(event),
        image: this.getEventImage(event),
        source: 'Eventbrite',
        rating: this.calculateEventRating(event),
        url: event.url || '',
        venue: venue.name || '',
        capacity: event.capacity || null,
        is_free: event.is_free || false,
        status: event.status || 'live'
      };
    });
  }

  // 🏠 Format venue address
  formatAddress(venue) {
    if (!venue) return 'Venue not specified';
    
    const parts = [];
    if (venue.address?.address_1) parts.push(venue.address.address_1);
    if (venue.address?.address_2) parts.push(venue.address.address_2);
    if (venue.address?.city) parts.push(venue.address.city);
    if (venue.address?.region) parts.push(venue.address.region);
    if (venue.address?.postal_code) parts.push(venue.address.postal_code);
    
    return parts.join(', ') || venue.name || 'Address not available';
  }

  // 📅 Format event date
  formatDate(dateString) {
    if (!dateString) return 'Date TBD';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Date TBD';
    }
  }

  // ⏰ Format event time
  formatTime(dateString) {
    if (!dateString) return 'Time TBD';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Time TBD';
    }
  }

  // 💰 Format event price
  formatPrice(event) {
    if (event.is_free) return 'Free';
    
    if (event.ticket_availability?.is_sold_out) return 'Sold Out';
    
    // Try to get price from ticket classes
    if (event.ticket_classes && event.ticket_classes.length > 0) {
      const prices = event.ticket_classes
        .filter(ticket => ticket.cost)
        .map(ticket => {
          const cost = ticket.cost.display;
          return cost.includes('₹') ? cost : `₹${cost}`;
        });
      
      if (prices.length > 0) {
        return prices[0]; // Return first available price
      }
    }
    
    return 'Price varies';
  }

  // 🖼️ Get event image
  getEventImage(event) {
    if (event.logo?.url) {
      return event.logo.url;
    }
    
    // Fallback based on category
    const category = event.category?.name?.toLowerCase() || '';
    if (category.includes('music')) return 'https://via.placeholder.com/300x200?text=Music+Event';
    if (category.includes('workshop')) return 'https://via.placeholder.com/300x200?text=Workshop';
    if (category.includes('festival')) return 'https://via.placeholder.com/300x200?text=Festival';
    if (category.includes('sports')) return 'https://via.placeholder.com/300x200?text=Sports+Event';
    
    return 'https://via.placeholder.com/300x200?text=Event';
  }

  // ⭐ Calculate event rating (mock for now)
  calculateEventRating(event) {
    // Eventbrite doesn't provide ratings, so we'll generate based on other factors
    let rating = 4.0;
    
    if (event.is_free) rating += 0.3;
    if (event.venue?.name) rating += 0.2;
    if (event.description?.text && event.description.text.length > 100) rating += 0.2;
    if (event.capacity && event.capacity > 100) rating += 0.1;
    
    return Math.min(5.0, Math.max(3.0, rating));
  }

  // 📏 Calculate distance (mock for now)
  calculateDistance(event) {
    // This would normally calculate distance from user location
    const distances = ['0.5 km', '1.2 km', '2.1 km', '3.5 km', '4.8 km'];
    return distances[Math.floor(Math.random() * distances.length)];
  }

  // 🎭 Mock data for testing (when API key not available)
  getMockEventbriteData(subcategory, expandedRadius = false) {
    const baseEvents = [
      {
        id: 'evt_eb_1',
        name: 'Kolkata Tech Meetup 2024',
        description: 'Monthly tech meetup featuring latest trends in AI, ML, and web development',
        address: 'Tata Consultancy Services, Salt Lake City, Kolkata',
        latitude: 22.5726,
        longitude: 88.3639,
        distance: '1.2 km',
        date: '2024-01-25',
        time: '6:00 PM',
        category: 'Technology',
        price: 'Free',
        image: 'https://via.placeholder.com/300x200?text=Tech+Meetup',
        source: 'Eventbrite',
        rating: 4.6,
        url: 'https://eventbrite.com/e/tech-meetup',
        venue: 'TCS Salt Lake',
        capacity: 150,
        is_free: true,
        status: 'live'
      },
      {
        id: 'evt_eb_2',
        name: 'Startup Pitch Competition',
        description: 'Annual startup pitch competition with cash prizes and mentorship opportunities',
        address: 'IIM Calcutta, Joka, Kolkata',
        latitude: 22.5200,
        longitude: 88.3669,
        distance: '2.8 km',
        date: '2024-02-15',
        time: '10:00 AM',
        category: 'Workshops',
        price: '₹500',
        image: 'https://via.placeholder.com/300x200?text=Startup+Pitch',
        source: 'Eventbrite',
        rating: 4.4,
        url: 'https://eventbrite.com/e/startup-pitch',
        venue: 'IIM Calcutta',
        capacity: 200,
        is_free: false,
        status: 'live'
      },
      {
        id: 'evt_eb_3',
        name: 'Kolkata Food Festival',
        description: 'Celebrate local cuisine with food stalls, cooking demonstrations, and live music',
        address: 'Eco Park, New Town, Kolkata',
        latitude: 22.5800,
        longitude: 88.4500,
        distance: '4.2 km',
        date: '2024-03-10',
        time: '11:00 AM',
        category: 'Food & Drink',
        price: '₹200',
        image: 'https://via.placeholder.com/300x200?text=Food+Festival',
        source: 'Eventbrite',
        rating: 4.7,
        url: 'https://eventbrite.com/e/food-festival',
        venue: 'Eco Park',
        capacity: 500,
        is_free: false,
        status: 'live'
      },
      {
        id: 'evt_eb_4',
        name: 'Yoga & Wellness Workshop',
        description: 'Learn traditional yoga techniques and modern wellness practices',
        address: 'Vivekananda Park, Ballygunge, Kolkata',
        latitude: 22.5400,
        longitude: 88.3600,
        distance: '2.1 km',
        date: '2024-01-28',
        time: '7:00 AM',
        category: 'Health & Wellness',
        price: 'Free',
        image: 'https://via.placeholder.com/300x200?text=Yoga+Workshop',
        source: 'Eventbrite',
        rating: 4.5,
        url: 'https://eventbrite.com/e/yoga-workshop',
        venue: 'Vivekananda Park',
        capacity: 50,
        is_free: true,
        status: 'live'
      },
      {
        id: 'evt_eb_5',
        name: 'Art Exhibition: Modern Bengal',
        description: 'Contemporary art exhibition featuring works by emerging Bengali artists',
        address: 'Academy of Fine Arts, Cathedral Road, Kolkata',
        latitude: 22.5600,
        longitude: 88.3500,
        distance: '1.8 km',
        date: '2024-02-05',
        time: '2:00 PM',
        category: 'Exhibitions',
        price: '₹100',
        image: 'https://via.placeholder.com/300x200?text=Art+Exhibition',
        source: 'Eventbrite',
        rating: 4.3,
        url: 'https://eventbrite.com/e/art-exhibition',
        venue: 'Academy of Fine Arts',
        capacity: 100,
        is_free: false,
        status: 'live'
      },
      // Additional events for expanded radius
      {
        id: 'evt_eb_6',
        name: 'Kolkata Startup Weekend',
        description: '54-hour startup competition with mentors, investors, and prizes',
        address: 'IIT Kharagpur Extension Center, Salt Lake, Kolkata',
        latitude: 22.5800,
        longitude: 88.3800,
        distance: '3.2 km',
        date: '2024-02-20',
        time: '6:00 PM',
        category: 'Technology',
        price: '₹1500',
        image: 'https://via.placeholder.com/300x200?text=Startup+Weekend',
        source: 'Eventbrite',
        rating: 4.7,
        url: 'https://eventbrite.com/e/startup-weekend',
        venue: 'IIT Kharagpur Extension',
        capacity: 200,
        is_free: false,
        status: 'live'
      },
      {
        id: 'evt_eb_7',
        name: 'Bengali Film Festival',
        description: 'Screening of classic and contemporary Bengali films',
        address: 'Nandan Cinema, Kolkata',
        latitude: 22.5500,
        longitude: 88.3400,
        distance: '2.5 km',
        date: '2024-03-01',
        time: '7:00 PM',
        category: 'Exhibitions',
        price: '₹200',
        image: 'https://via.placeholder.com/300x200?text=Film+Festival',
        source: 'Eventbrite',
        rating: 4.5,
        url: 'https://eventbrite.com/e/film-festival',
        venue: 'Nandan Cinema',
        capacity: 300,
        is_free: false,
        status: 'live'
      },
      {
        id: 'evt_eb_8',
        name: 'Kolkata Marathon 2024',
        description: 'Annual marathon with 5K, 10K, and 21K categories',
        address: 'Red Road, Kolkata',
        latitude: 22.5400,
        longitude: 88.3300,
        distance: '2.8 km',
        date: '2024-03-15',
        time: '6:00 AM',
        category: 'Sports Events',
        price: '₹500',
        image: 'https://via.placeholder.com/300x200?text=Marathon',
        source: 'Eventbrite',
        rating: 4.6,
        url: 'https://eventbrite.com/e/marathon',
        venue: 'Red Road',
        capacity: 5000,
        is_free: false,
        status: 'live'
      },
      {
        id: 'evt_eb_9',
        name: 'Cooking Masterclass with Chef Sanjeev Kapoor',
        description: 'Learn authentic Bengali cuisine from celebrity chef',
        address: 'ITC Sonar, Kolkata',
        latitude: 22.5200,
        longitude: 88.3600,
        distance: '4.1 km',
        date: '2024-02-25',
        time: '11:00 AM',
        category: 'Food & Drink',
        price: '₹2500',
        image: 'https://via.placeholder.com/300x200?text=Cooking+Class',
        source: 'Eventbrite',
        rating: 4.8,
        url: 'https://eventbrite.com/e/cooking-class',
        venue: 'ITC Sonar',
        capacity: 50,
        is_free: false,
        status: 'live'
      },
      {
        id: 'evt_eb_10',
        name: 'Mental Health Awareness Workshop',
        description: 'Interactive workshop on stress management and mental wellness',
        address: 'Fortis Hospital, Anandapur, Kolkata',
        latitude: 22.5100,
        longitude: 88.3700,
        distance: '5.2 km',
        date: '2024-02-18',
        time: '3:00 PM',
        category: 'Health & Wellness',
        price: 'Free',
        image: 'https://via.placeholder.com/300x200?text=Mental+Health',
        source: 'Eventbrite',
        rating: 4.4,
        url: 'https://eventbrite.com/e/mental-health',
        venue: 'Fortis Hospital',
        capacity: 80,
        is_free: true,
        status: 'live'
      }
    ];

    // Filter by subcategory if specified
    let filteredEvents = baseEvents;
    if (subcategory) {
      filteredEvents = baseEvents.filter(event => 
        event.category.toLowerCase().includes(subcategory.toLowerCase()) ||
        subcategory.toLowerCase().includes(event.category.toLowerCase())
      );
    }

    // If expanded radius, return more events
    if (expandedRadius) {
      console.log('🔍 Returning expanded radius events (nearest available)');
      return filteredEvents.slice(0, 8); // Return more events for expanded search
    }

    // Return events based on radius (simulate distance filtering)
    const radiusFilteredEvents = filteredEvents.filter(event => {
      const eventDistance = parseFloat(event.distance);
      return eventDistance <= 5; // Show events within 5km for normal search
    });

    // If no events in radius, return nearest events
    if (radiusFilteredEvents.length === 0) {
      console.log('🔍 No events in radius, returning nearest events');
      return filteredEvents.slice(0, 3); // Return 3 nearest events
    }

    return radiusFilteredEvents;
  }

  // 💾 Cache management
  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
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

  // 🔧 API key configuration
  setApiKey(apiKey) {
    this.apiKey = apiKey;
    console.log('🔑 Eventbrite API key configured');
  }

  // 🧹 Clear cache
  clearCache() {
    this.cache.clear();
    console.log('🗑️ Eventbrite cache cleared');
  }

  // 📊 Get API usage stats
  getUsageStats() {
    return {
      cacheSize: this.cache.size,
      apiKeyConfigured: this.apiKey !== 'YOUR_EVENTBRITE_API_KEY',
      supportedCategories: Object.keys(this.eventCategories).length,
      supportedCities: Object.keys(this.indianCities).length
    };
  }
}

export default new EventbriteAPI();

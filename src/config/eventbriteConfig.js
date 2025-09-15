// 🎉 EVENTBRITE API CONFIGURATION
// =================================

export const EVENTBRITE_CONFIG = {
  // API Configuration
  API_KEY: 'YOUR_EVENTBRITE_API_KEY', // Replace with your actual API key
  BASE_URL: 'https://www.eventbriteapi.com/v3',
  
  // Rate Limits
  RATE_LIMITS: {
    FREE_TIER: '1,000 requests/hour',
    PAID_TIER: 'Higher limits available',
    CACHE_DURATION: '30 minutes'
  },

  // Indian Cities Coverage
  SUPPORTED_CITIES: {
    'kolkata': { lat: 22.5726, lng: 88.3639, name: 'Kolkata' },
    'mumbai': { lat: 19.0760, lng: 72.8777, name: 'Mumbai' },
    'delhi': { lat: 28.7041, lng: 77.1025, name: 'Delhi' },
    'bangalore': { lat: 12.9716, lng: 77.5946, name: 'Bangalore' },
    'chennai': { lat: 13.0827, lng: 80.2707, name: 'Chennai' },
    'hyderabad': { lat: 17.3850, lng: 78.4867, name: 'Hyderabad' },
    'pune': { lat: 18.5204, lng: 73.8567, name: 'Pune' },
    'ahmedabad': { lat: 23.0225, lng: 72.5714, name: 'Ahmedabad' }
  },

  // Event Categories Mapping
  EVENT_CATEGORIES: {
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
  },

  // Search Parameters
  SEARCH_PARAMS: {
    DEFAULT_RADIUS: 25, // km
    MAX_RADIUS: 50, // km
    MIN_RADIUS: 1, // km
    SORT_OPTIONS: ['distance', 'date', 'relevance'],
    STATUS_FILTERS: ['live', 'started', 'ended', 'canceled', 'draft']
  },

  // Data Fields
  EVENT_FIELDS: [
    'id',
    'name',
    'description',
    'start',
    'end',
    'venue',
    'category',
    'subcategory',
    'ticket_availability',
    'is_free',
    'logo',
    'url',
    'capacity',
    'status'
  ],

  // API Endpoints
  ENDPOINTS: {
    SEARCH_EVENTS: '/events/search/',
    GET_EVENT: '/events/{id}/',
    GET_VENUE: '/venues/{id}/',
    GET_CATEGORIES: '/categories/',
    GET_SUBCATEGORIES: '/subcategories/'
  }
};

// 🎯 How to get Eventbrite API Key
export const GET_API_KEY_INSTRUCTIONS = `
🔑 HOW TO GET EVENTBRITE API KEY:

1. Visit: https://www.eventbrite.com/platform/api-keys/
2. Sign up or log in to Eventbrite
3. Go to "API Keys" section
4. Click "Create API Key"
5. Fill in the form:
   - App Name: LocalFinds App
   - Description: Mobile app for finding local events
   - Website: Your website (optional)
6. Copy the generated API key
7. Replace 'YOUR_EVENTBRITE_API_KEY' in this file

📊 API LIMITS:
- Free Tier: 1,000 requests/hour
- Perfect for development and small apps
- No credit card required for free tier

🎯 COVERAGE IN INDIA:
- Major cities: Mumbai, Delhi, Bangalore, Chennai, Kolkata
- Event types: Workshops, meetups, conferences, festivals
- Good for: Tech events, business meetups, cultural events
- Coverage: Better in metro cities, limited in smaller towns
`;

// 🚀 Quick Setup Guide
export const QUICK_SETUP = {
  STEP_1: 'Get API key from Eventbrite',
  STEP_2: 'Replace YOUR_EVENTBRITE_API_KEY in eventbriteConfig.js',
  STEP_3: 'Test with a search in Events category',
  STEP_4: 'Monitor API usage in Eventbrite dashboard',
  
  TESTING: {
    LOCATION: 'Kolkata (22.5726, 88.3639)',
    RADIUS: '10 km',
    CATEGORY: 'Technology',
    EXPECTED_RESULTS: 'Tech meetups, workshops, conferences'
  }
};

console.log('🎉 Eventbrite API Configuration loaded!');
console.log('📊 Supported cities: 8 major Indian cities');
console.log('🎯 Event categories: 10 categories');
console.log('🔑 API key status: ' + (EVENTBRITE_CONFIG.API_KEY === 'YOUR_EVENTBRITE_API_KEY' ? 'Not configured' : 'Configured'));
console.log('💡 Run GET_API_KEY_INSTRUCTIONS for setup guide');

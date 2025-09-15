// Comprehensive Categories and Subcategories for LocalFinds App

export const CATEGORIES = [
  {
    id: 1,
    name: 'Markets & Shopping',
    icon: 'storefront',
    color: '#3b82f6',
    description: 'Local markets, shopping centers, and retail outlets',
    subcategories: [
      { id: 11, name: 'Farmers Market', icon: 'leaf', count: 0, keywords: ['farmers', 'organic', 'fresh produce', 'local food'] },
      { id: 12, name: 'Flea Market', icon: 'diamond', count: 0, keywords: ['flea', 'antique', 'vintage', 'second hand'] },
      { id: 13, name: 'Street Market', icon: 'car', count: 0, keywords: ['street market', 'outdoor market', 'bazaar'] },
      { id: 14, name: 'Night Market', icon: 'moon', count: 0, keywords: ['night market', 'evening', 'late night'] },
      { id: 15, name: 'Shopping Mall', icon: 'business', count: 0, keywords: ['mall', 'shopping center', 'plaza'] },
      { id: 16, name: 'Outlet Store', icon: 'pricetag', count: 0, keywords: ['outlet', 'discount', 'factory store'] },
      { id: 17, name: 'Department Store', icon: 'bag', count: 0, keywords: ['department store', 'retail', 'chain store'] },
      { id: 18, name: 'Wholesale Market', icon: 'cube', count: 0, keywords: ['wholesale', 'bulk', 'trade'] }
    ]
  },
  {
    id: 2,
    name: 'Food & Grocery',
    icon: 'basket',
    color: '#10b981',
    description: 'Grocery stores, supermarkets, and food outlets',
    subcategories: [
      { id: 21, name: 'Supermarket', icon: 'business', count: 0, keywords: ['supermarket', 'grocery', 'food store'] },
      { id: 22, name: 'Local Grocery', icon: 'home', count: 0, keywords: ['local store', 'neighborhood store', 'convenience'] },
      { id: 23, name: 'Organic Store', icon: 'nutrition', count: 0, keywords: ['organic', 'health food', 'natural'] },
      { id: 24, name: 'Convenience Store', icon: 'time', count: 0, keywords: ['convenience', '24/7', 'quick shop'] },
      { id: 25, name: 'Butcher Shop', icon: 'restaurant', count: 0, keywords: ['butcher', 'meat', 'fresh meat'] },
      { id: 26, name: 'Bakery', icon: 'cafe', count: 0, keywords: ['bakery', 'bread', 'pastry', 'fresh baked'] },
      { id: 27, name: 'Deli', icon: 'pizza', count: 0, keywords: ['deli', 'delicatessen', 'prepared food'] },
      { id: 28, name: 'Specialty Food', icon: 'wine', count: 0, keywords: ['specialty', 'gourmet', 'imported food'] }
    ]
  },
  {
    id: 3,
    name: 'Events & Entertainment',
    icon: 'calendar',
    color: '#f59e0b',
    description: 'Local events, festivals, and entertainment venues',
    subcategories: [
      { id: 31, name: 'Festivals', icon: 'star', count: 0, keywords: ['festival', 'celebration', 'cultural event'] },
      { id: 32, name: 'Workshops', icon: 'hammer', count: 0, keywords: ['workshop', 'training', 'skill learning'] },
      { id: 33, name: 'Exhibitions', icon: 'images', count: 0, keywords: ['exhibition', 'art show', 'display'] },
      { id: 34, name: 'Community Events', icon: 'people', count: 0, keywords: ['community', 'neighborhood', 'local event'] },
      { id: 35, name: 'Sports Events', icon: 'football', count: 0, keywords: ['sports', 'game', 'match', 'tournament'] },
      { id: 36, name: 'Cultural Events', icon: 'library', count: 0, keywords: ['culture', 'tradition', 'heritage'] },
      { id: 37, name: 'Kids Events', icon: 'happy', count: 0, keywords: ['kids', 'children', 'family'] },
      { id: 38, name: 'Conferences', icon: 'chatbubbles', count: 0, keywords: ['conference', 'seminar', 'meeting'] }
    ]
  },
  {
    id: 4,
    name: 'Music & Concerts',
    icon: 'musical-notes',
    color: '#8b5cf6',
    description: 'Live music venues, concerts, and entertainment',
    subcategories: [
      { id: 41, name: 'Live Music', icon: 'mic', count: 0, keywords: ['live music', 'band', 'performance'] },
      { id: 42, name: 'DJ Events', icon: 'disc', count: 0, keywords: ['dj', 'electronic', 'dance'] },
      { id: 43, name: 'Classical Music', icon: 'library', count: 0, keywords: ['classical', 'orchestra', 'symphony'] },
      { id: 44, name: 'Local Bands', icon: 'musical-note', count: 0, keywords: ['local band', 'indie', 'underground'] },
      { id: 45, name: 'Jazz Clubs', icon: 'wine', count: 0, keywords: ['jazz', 'blues', 'club'] },
      { id: 46, name: 'Rock Concerts', icon: 'flash', count: 0, keywords: ['rock', 'metal', 'concert'] },
      { id: 47, name: 'Folk Music', icon: 'leaf', count: 0, keywords: ['folk', 'acoustic', 'traditional'] },
      { id: 48, name: 'Music Festivals', icon: 'star', count: 0, keywords: ['music festival', 'outdoor concert'] }
    ]
  },
  {
    id: 5,
    name: 'Services & Repair',
    icon: 'build',
    color: '#06b6d4',
    description: 'Repair services, maintenance, and professional services',
    subcategories: [
      { id: 51, name: 'Electronics Repair', icon: 'phone-portrait', count: 0, keywords: ['electronics', 'phone repair', 'computer'] },
      { id: 52, name: 'Automotive', icon: 'car', count: 0, keywords: ['car repair', 'auto service', 'mechanic'] },
      { id: 53, name: 'Appliance Repair', icon: 'tv', count: 0, keywords: ['appliance', 'washing machine', 'refrigerator'] },
      { id: 54, name: 'Bike Repair', icon: 'bicycle', count: 0, keywords: ['bike', 'bicycle', 'cycle repair'] },
      { id: 55, name: 'Home Repair', icon: 'hammer', count: 0, keywords: ['home repair', 'handyman', 'maintenance'] },
      { id: 56, name: 'Tailoring', icon: 'shirt', count: 0, keywords: ['tailor', 'alteration', 'sewing'] },
      { id: 57, name: 'Shoe Repair', icon: 'walk', count: 0, keywords: ['shoe repair', 'cobbler', 'footwear'] },
      { id: 58, name: 'Beauty Services', icon: 'cut', count: 0, keywords: ['salon', 'barber', 'beauty'] }
    ]
  },
  {
    id: 6,
    name: 'Education & Tuition',
    icon: 'school',
    color: '#84cc16',
    description: 'Educational services, tutoring, and skill development',
    subcategories: [
      { id: 61, name: 'Academic Tutoring', icon: 'book', count: 0, keywords: ['tuition', 'academic', 'study', 'homework'] },
      { id: 62, name: 'Music Classes', icon: 'musical-notes', count: 0, keywords: ['music lesson', 'instrument', 'singing'] },
      { id: 63, name: 'Sports Training', icon: 'football', count: 0, keywords: ['sports', 'fitness', 'training', 'coach'] },
      { id: 64, name: 'Art & Craft', icon: 'brush', count: 0, keywords: ['art', 'painting', 'craft', 'drawing'] },
      { id: 65, name: 'Language Classes', icon: 'chatbubbles', count: 0, keywords: ['language', 'english', 'foreign language'] },
      { id: 66, name: 'Computer Training', icon: 'laptop', count: 0, keywords: ['computer', 'coding', 'IT', 'software'] },
      { id: 67, name: 'Dance Classes', icon: 'person', count: 0, keywords: ['dance', 'choreography', 'ballet'] },
      { id: 68, name: 'Cooking Classes', icon: 'restaurant', count: 0, keywords: ['cooking', 'culinary', 'chef'] }
    ]
  },
  {
    id: 7,
    name: 'Hotels & Accommodation',
    icon: 'bed',
    color: '#f97316',
    description: 'Hotels, guest houses, and accommodation services',
    subcategories: [
      { id: 71, name: 'Luxury Hotels', icon: 'star', count: 0, keywords: ['luxury', '5 star', 'premium hotel'] },
      { id: 72, name: 'Budget Hotels', icon: 'wallet', count: 0, keywords: ['budget', 'cheap', 'economy'] },
      { id: 73, name: 'Guest House', icon: 'home', count: 0, keywords: ['guest house', 'b&b', 'homestay'] },
      { id: 74, name: 'Hostels', icon: 'people', count: 0, keywords: ['hostel', 'backpacker', 'shared'] },
      { id: 75, name: 'Resorts', icon: 'sunny', count: 0, keywords: ['resort', 'vacation', 'holiday'] },
      { id: 76, name: 'Motels', icon: 'car', count: 0, keywords: ['motel', 'roadside', 'highway'] },
      { id: 77, name: 'Serviced Apartments', icon: 'business', count: 0, keywords: ['apartment', 'serviced', 'extended stay'] },
      { id: 78, name: 'Camping', icon: 'leaf', count: 0, keywords: ['camping', 'tent', 'outdoor'] }
    ]
  },
  {
    id: 8,
    name: 'Health & Wellness',
    icon: 'fitness',
    color: '#ef4444',
    description: 'Healthcare services, fitness, and wellness centers',
    subcategories: [
      { id: 81, name: 'Hospitals', icon: 'medical', count: 0, keywords: ['hospital', 'emergency', 'medical center'] },
      { id: 82, name: 'Clinics', icon: 'pulse', count: 0, keywords: ['clinic', 'doctor', 'healthcare'] },
      { id: 83, name: 'Pharmacies', icon: 'tablet-portrait', count: 0, keywords: ['pharmacy', 'medicine', 'drugstore'] },
      { id: 84, name: 'Gyms', icon: 'fitness', count: 0, keywords: ['gym', 'fitness', 'workout'] },
      { id: 85, name: 'Yoga Centers', icon: 'leaf', count: 0, keywords: ['yoga', 'meditation', 'wellness'] },
      { id: 86, name: 'Spas', icon: 'flower', count: 0, keywords: ['spa', 'massage', 'relaxation'] },
      { id: 87, name: 'Dental Clinics', icon: 'happy', count: 0, keywords: ['dentist', 'dental', 'teeth'] },
      { id: 88, name: 'Veterinary', icon: 'paw', count: 0, keywords: ['vet', 'animal', 'pet care'] }
    ]
  }
];

// Free APIs for Real Data
export const FREE_APIS = {
  // Google Places API (Free tier: 1000 requests/month)
  GOOGLE_PLACES: {
    name: 'Google Places API',
    url: 'https://developers.google.com/maps/documentation/places/web-service',
    freeTier: '1000 requests/month',
    features: ['Places search', 'Place details', 'Photos', 'Reviews'],
    example: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670,151.1957&radius=1500&type=restaurant&key=YOUR_API_KEY'
  },

  // Foursquare Places API (Free tier: 1000 calls/day)
  FOURSQUARE: {
    name: 'Foursquare Places API',
    url: 'https://developer.foursquare.com/places-api',
    freeTier: '1000 calls/day',
    features: ['Venue search', 'Venue details', 'Categories', 'Photos'],
    example: 'https://api.foursquare.com/v3/places/search?near=New%20York&categories=13065'
  },

  // OpenStreetMap Overpass API (Completely free)
  OVERPASS: {
    name: 'Overpass API (OpenStreetMap)',
    url: 'https://overpass-api.de/',
    freeTier: 'Completely free',
    features: ['POI search', 'Geographic data', 'Custom queries'],
    example: '[out:json];node[amenity=restaurant](around:1000,40.7128,-74.0060);out;'
  },

  // Yelp Fusion API (Free tier: 5000 calls/month)
  YELP: {
    name: 'Yelp Fusion API',
    url: 'https://www.yelp.com/developers/documentation/v3',
    freeTier: '5000 calls/month',
    features: ['Business search', 'Reviews', 'Photos', 'Business details'],
    example: 'https://api.yelp.com/v3/businesses/search?location=NYC&categories=restaurants'
  },

  // TomTom Places API (Free tier: 2500 requests/day)
  TOMTOM: {
    name: 'TomTom Places API',
    url: 'https://developer.tomtom.com/search-api/search-api-documentation',
    freeTier: '2500 requests/day',
    features: ['POI search', 'Fuzzy search', 'Category search'],
    example: 'https://api.tomtom.com/search/2/categorySearch/restaurant.json?key=YOUR_KEY&lat=37.7749&lon=-122.4194'
  },

  // HERE Places API (Free tier: 1000 requests/month)
  HERE: {
    name: 'HERE Places API',
    url: 'https://developer.here.com/documentation/places/dev_guide/topics/what-is.html',
    freeTier: '1000 requests/month',
    features: ['Place discovery', 'Place details', 'Categories'],
    example: 'https://places.ls.hereapi.com/places/v1/discover/search?at=40.7128,-74.0060&q=restaurant&apikey=YOUR_KEY'
  },

  // MapBox Places API (Free tier: 100,000 requests/month)
  MAPBOX: {
    name: 'MapBox Places API',
    url: 'https://docs.mapbox.com/api/search/geocoding/',
    freeTier: '100,000 requests/month',
    features: ['Geocoding', 'POI search', 'Category search'],
    example: 'https://api.mapbox.com/geocoding/v5/mapbox.places/restaurant.json?proximity=-74.0060,40.7128&access_token=YOUR_TOKEN'
  }
};

// Event APIs
export const EVENT_APIS = {
  // Eventbrite API (Free tier: 1000 requests/hour)
  EVENTBRITE: {
    name: 'Eventbrite API',
    url: 'https://www.eventbrite.com/platform/api',
    freeTier: '1000 requests/hour',
    features: ['Event search', 'Event details', 'Categories', 'Venues'],
    example: 'https://www.eventbriteapi.com/v3/events/search/?location.address=New%20York&categories=103'
  },

  // Meetup API (Free tier: 200 requests/hour)
  MEETUP: {
    name: 'Meetup API',
    url: 'https://www.meetup.com/api/',
    freeTier: '200 requests/hour',
    features: ['Event search', 'Group search', 'Event details'],
    example: 'https://api.meetup.com/find/events?lat=40.7128&lon=-74.0060&radius=25'
  },

  // Facebook Events API (Limited free access)
  FACEBOOK_EVENTS: {
    name: 'Facebook Events API',
    url: 'https://developers.facebook.com/docs/graph-api/reference/event/',
    freeTier: 'Limited free access',
    features: ['Public events', 'Event details', 'Location-based search'],
    note: 'Requires approval for location-based event search'
  }
};

// Recommended API Integration Strategy
export const API_INTEGRATION_STRATEGY = {
  PRIMARY: 'Google Places API - Most comprehensive data',
  SECONDARY: 'Foursquare - Good for venues and categories',
  FALLBACK: 'Overpass API - Free backup option',
  EVENTS: 'Eventbrite API - Best for events and activities',
  
  IMPLEMENTATION_NOTES: [
    'Start with Google Places API for POI search',
    'Use Eventbrite for events and activities',
    'Implement caching to reduce API calls',
    'Add error handling and fallback options',
    'Store frequently accessed data locally',
    'Use location-based caching strategy'
  ]
};

export default CATEGORIES;

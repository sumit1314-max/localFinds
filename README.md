# LocalFinds - React Native Expo App

A location-based mobile application that allows users to explore markets, grocery stores, events, concerts, malls, and service providers within a selected kilometer range.

## Features

- **Location-based Discovery**: Find nearby places within your selected distance range
- **Category Filtering**: Browse by Markets, Grocery, Events, Concerts, Malls, Repair, Tuition, Hotels
- **Distance Slider**: Adjust search radius from 1-50 km
- **Detailed Information**: View offers, promotions, and contact details
- **Save Places**: Bookmark your favorite locations
- **Modern UI**: Clean, student-friendly design with smooth animations

## Screens

1. **Splash Screen**: App logo and loading animation
2. **Onboarding**: Introduction to app features
3. **Location Access**: Permission request for location services
4. **Home Screen**: Search, distance slider, category grid, and featured banners
5. **Category Selection**: Filtered list of places with sorting options
6. **Detail Screen**: Detailed information, offers, and booking options
7. **Saved Screen**: Bookmarked places
8. **Profile Screen**: User profile and settings

## Installation

1. **Prerequisites**:
   - Node.js (v16 or higher)
   - Expo CLI (`npm install -g @expo/cli`)
   - iOS Simulator (for iOS development) or Android Studio (for Android development)

2. **Clone and Install**:
   ```bash
   git clone <repository-url>
   cd local-finds-app
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm start
   # or
   expo start
   ```

4. **Run on Device/Simulator**:
   - For iOS: `npm run ios` or press `i` in the terminal
   - For Android: `npm run android` or press `a` in the terminal
   - For Web: `npm run web` or press `w` in the terminal

## Project Structure

```
local-finds-app/
├── App.js                          # Main app component
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── src/
│   ├── screens/                    # Screen components
│   │   ├── SplashScreen.js
│   │   ├── OnboardingScreen.js
│   │   ├── LocationAccessScreen.js
│   │   ├── HomeScreen.js
│   │   ├── CategoriesScreen.js
│   │   ├── DetailScreen.js
│   │   ├── SavedScreen.js
│   │   └── ProfileScreen.js
│   ├── navigation/                 # Navigation components
│   │   ├── MainTabNavigator.js
│   │   └── HomeStack.js
│   ├── data/                      # Mock data
│   │   └── mockData.js
│   └── utils/                     # Utility functions
│       └── locationService.js
└── README.md
```

## Key Dependencies

- **Expo**: Development platform and tools
- **React Navigation**: Navigation between screens
- **Expo Location**: Location services and permissions
- **React Native Slider**: Distance range selector
- **Expo Vector Icons**: Icon library

## Location Services

The app requests location permission to:
- Show nearby places based on user's current location
- Calculate distances to various locations
- Filter results by distance range

## Customization

### Adding New Categories
1. Update `categories` array in `src/data/mockData.js`
2. Add corresponding icon and color
3. Update category grid in `HomeScreen.js`

### Adding New Data
1. Add new items to `marketData` array in `src/data/mockData.js`
2. Include location coordinates for distance calculation
3. Add offers and promotions as needed

### Styling
- Colors are defined in individual component styles
- Primary color: `#3b82f6` (blue)
- Accent color: `#f9f506` (yellow)
- Font family: System default (Spline Sans in HTML designs)

## Development Notes

- The app uses mock data for demonstration purposes
- Location services require physical device or simulator with location enabled
- All images are loaded from external URLs (Google Cloud Storage)
- The app follows React Native best practices and Expo guidelines

## Troubleshooting

1. **Location Permission Issues**:
   - Ensure location services are enabled on device/simulator
   - Check app permissions in device settings

2. **Build Issues**:
   - Clear Expo cache: `expo start -c`
   - Reset Metro bundler: `npx react-native start --reset-cache`

3. **Navigation Issues**:
   - Ensure all screen components are properly imported
   - Check navigation stack configuration

## Future Enhancements

- Real-time data integration
- User authentication
- Push notifications
- Offline support
- Social features (reviews, ratings)
- Payment integration for bookings

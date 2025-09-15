import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Animated,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleNext = () => {
    navigation.navigate('LocationAccess');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.imageContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ImageBackground
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYUklLT_cPIE0vJNuymgLb6LpuAmwhJD-yF3rTEy-9R8VSJ3qUa1snkPGNoG419FTlnymGhelDqBIP2zmVDxmGRGbP45hjuZtyGcCgOR6UiTNMgkMrmiUIf8LgX2JAA6Y4gAQJiAnpIZpx2DTRfMotPX651UNhMkyvAfzh-vZ-Ct30F98AhRdZLRzRv0Tx_4dqS8BR1T2jQ6thFYqTPtPqtBDw7_LQ6yRXz8aocrgNotXyA7mje2zhlJH-qWgCEuqS1G9JJChSBwg'
            }}
            style={styles.backgroundImage}
            imageStyle={styles.imageStyle}
          />
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>Discover Local Gems</Text>
          <Text style={styles.description}>
            Explore markets, grocery stores, events, concerts, malls, and service providers within your selected kilometer range.
          </Text>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          <View style={styles.activeDot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
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
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  imageContainer: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  backgroundImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  imageStyle: {
    borderRadius: 24,
  },
  textContainer: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 28,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  activeDot: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#111827',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
  },
  nextButton: {
    backgroundColor: '#000000',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default OnboardingScreen;

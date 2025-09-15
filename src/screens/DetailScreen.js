import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const DetailScreen = ({ navigation, route }) => {
  const { item } = route.params;

  const offers = [
    {
      id: 1,
      type: 'Limited Time',
      title: '20% Off on Designer Brands',
      subtitle: 'Valid until July 31st',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUoWjMM6pRsIwTccnviRxofrJ4MCXF1mF4IQ5MnfHdjb0ljCCl00Bx3TwJwbnyazt7PzQFjX7L43FhOUCH1Y2Fz0KGOnOBLe6Ne2RVpzLWOlxrJylLCe5MTGo0x0XdcKU7Co0DTyRqQFHNVWLKZR1FuE9C_HzsOOfpsZb5ao8Nu711SvS7oj5L_OpEcKpBZ9ihFd9txjFGDLP2eYOxhypBVrP2KmbEElLl10H_nBkv0jjeBUUMdx9RWI4UhC_1Fa46mTETXW1nbe0',
      color: '#fbbf24',
      bgColor: '#fef3c7',
    },
    {
      id: 2,
      type: 'Exclusive',
      title: 'Free Coffee with Purchase',
      subtitle: 'At participating cafes',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnDNkrxy24o2avGucnABTlu07jIlkh351ytRSVaSIhzSdkKzkXy1aoAIXxnbC6OCrYvIBWJud5PUDPDYVA9rr_bYSFlc7SzJjwIfkxGl3mILf2WUyaXmTPvXmk2X81DaXIlJuDPhGgSJ_bk9ep33vpfwxKs-aRTlA2giqlcnzd8GUiMX9y8vAe2viLuhonQ7_FDHr4eTwXtGVXyFk7LQiuLQg2V-E8Xaw3cuPy5Okns-6vuJyiLRpr_OyTKo7SqlUgXVK3F0aOL6U',
      color: '#06b6d4',
      bgColor: '#cffafe',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#475569" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADWYXP99dRvL6X7ouxriJJsXyJJkibrjsap79mEuy5HNb5Y5bQ3K0A8lcQ_80ywhbIdBQgqArIunsGIKrBBQrDc7qdm_QiU3rsMqcLe8iNKxreipJRxmo6LfM2669T1iCI95fsBF7izfYZGZQdbgRFQ1do5air9dk1Btfp5GaWx8pSKjsNx5TT7dAJO55qD6436BKMee1fV6-2RKDTy7spnAC0nN8FLjudXYbsf8nXcuvxp5NzxsitWWl6PRZ6HCM1I_eLYtpcRs0' }}
            style={styles.mainImage}
          />
          <View style={styles.imageOverlay} />
        </View>

        <View style={styles.content}>
          <View style={styles.titleSection}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>The Grand Emporium</Text>
              <Text style={styles.category}>Shopping Mall</Text>
            </View>
            <TouchableOpacity style={styles.favoriteButton}>
              <Ionicons name="heart" size={24} color="#ec4899" />
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>
            The Grand Emporium is a premier shopping destination, offering a wide array of high-end brands, dining options, and entertainment experiences. Located in the heart of the city, it's the perfect place for a day of leisure and luxury.
          </Text>

          <Text style={styles.offersTitle}>Offers & Promotions</Text>

          <View style={styles.offersContainer}>
            {offers.map((offer) => (
              <View key={offer.id} style={[styles.offerCard, { backgroundColor: offer.bgColor }]}>
                <View style={styles.offerContent}>
                  <Text style={[styles.offerType, { color: offer.color }]}>{offer.type}</Text>
                  <Text style={styles.offerTitle}>{offer.title}</Text>
                  <Text style={styles.offerSubtitle}>{offer.subtitle}</Text>
                </View>
                <Image source={{ uri: offer.image }} style={styles.offerImage} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Now / Contact</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 256,
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 24,
    minHeight: height * 0.6,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: -8,
  },
  description: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
    marginBottom: 32,
  },
  offersTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
  },
  offersContainer: {
    gap: 16,
  },
  offerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  offerContent: {
    flex: 1,
  },
  offerType: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  offerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  offerImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginLeft: 16,
  },
  footer: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  bookButton: {
    backgroundColor: '#f9f506',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#f9f506',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bookButtonText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default DetailScreen;

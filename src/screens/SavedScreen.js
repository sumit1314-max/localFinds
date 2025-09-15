import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SavedScreen = ({ navigation }) => {
  const [savedItems, setSavedItems] = useState([
    {
      id: 1,
      name: 'Farmers Market',
      category: 'Markets',
      distance: '1.2 km away',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQXnqImtWPRXWVYmtZFq_tz75-Eze5DVHjqZ-kIohKa_u9ZpQOCPuZoPwxOYr89IOlR9qWAMN_1DWiN3m3_ylDK9V7bjFrXQxp1d77BYqNh0MJ64bOfGZGDs93JXR33l-9oacGyijdUgIkAkIcFAXn6719ZHIOf-jAZQUJKGVzAo2fCkPvCGGWUQ2x5ZOg1G5vrVKr0IpQoGuvI4ehr8IiPVe7QnlkUMpAE7jwjfxp8I5J_zvRtXE2YCSTl1p_rqOUqnsIH_B6_jU',
      saved: true,
    },
    {
      id: 2,
      name: 'Weekend Music Fest',
      category: 'Events',
      distance: '3.5 km away',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGyTh-01Md-epe2qLbveW8jKZvsM4SFlYED3GP_JSPKSY9sOQA5cvvS7isC23tTMACkXAKLIs17tf7QfaJ4ZhbLWXN5wxB7n_zq3tOTsV1PWkgflbcdASsgyxs6WteJr0as3EQMjWyCmlPl_WLmRRIXLAKp3BRSHXrbiAgdrIZmIYVBLe9gv7yv_w6xnYmTqK8dLnWQYQtzBxmGq6BcrNxC_otlDwETbTteznB5CvIIdk9WvDT37iWmN71hmLDeoHA5AC-t9S9TdU',
      saved: true,
    },
    {
      id: 3,
      name: 'The Grand Emporium',
      category: 'Malls',
      distance: '2.1 km away',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADWYXP99dRvL6X7ouxriJJsXyJJkibrjsap79mEuy5HNb5Y5bQ3K0A8lcQ_80ywhbIdBQgqArIunsGIKrBBQrDc7qdm_QiU3rsMqcLe8iNKxreipJRxmo6LfM2669T1iCI95fsBF7izfYZGZQdbgRFQ1do5air9dk1Btfp5GaWx8pSKjsNx5TT7dAJO55qD6436BKMee1fV6-2RKDTy7spnAC0nN8FLjudXYbsf8nXcuvxp5NzxsitWWl6PRZ6HCM1I_eLYtpcRs0',
      saved: true,
    },
  ]);

  const removeSavedItem = (id) => {
    setSavedItems(savedItems.filter(item => item.id !== id));
  };

  const renderSavedItem = ({ item }) => (
    <View style={styles.savedItem}>
      <Image source={{ uri: item.image }} style={styles.savedImage} />
      <View style={styles.savedContent}>
        <Text style={styles.savedName}>{item.name}</Text>
        <Text style={styles.savedCategory}>{item.category}</Text>
        <Text style={styles.savedDistance}>{item.distance}</Text>
      </View>
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => removeSavedItem(item.id)}
      >
        <Ionicons name="close" size={20} color="#6b7280" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Places</Text>
        <Text style={styles.headerSubtitle}>
          {savedItems.length} {savedItems.length === 1 ? 'item' : 'items'} saved
        </Text>
      </View>

      {savedItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="bookmark-outline" size={64} color="#d1d5db" />
          <Text style={styles.emptyTitle}>No Saved Items</Text>
          <Text style={styles.emptySubtitle}>
            Save places you're interested in to see them here
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedItems}
          renderItem={renderSavedItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.savedList}
          showsVerticalScrollIndicator={false}
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
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 24,
  },
  savedList: {
    padding: 16,
  },
  savedItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  savedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  savedContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  savedName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  savedCategory: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  savedDistance: {
    fontSize: 14,
    color: '#9ca3af',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 8,
  },
});

export default SavedScreen;

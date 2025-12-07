import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDiscountedVendors } from '../../config/redux/actions/vendorActions';

const DiscountedVendorsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { discountedVendors, loading } = useSelector(state => state.vendors);
  const { data } = useSelector(state => state.local);

  useEffect(() => {
    if (data?.user?.shippingAddresses?.location?.coordinates) {
        const [long, lat] = data.user.shippingAddresses.location.coordinates;
        dispatch(fetchDiscountedVendors(lat, long));
    } else {
        dispatch(fetchDiscountedVendors());
    }
  }, [dispatch, data]);

  const renderVendor = ({ item }) => (
    <TouchableOpacity
      style={styles.vendorCard}
      onPress={() => navigation.navigate('VendorDetails', { vendor: item })}
    >
      <Image
        source={{ uri: item.shopImages && item.shopImages.length > 0 ? item.shopImages[0] : 'https://via.placeholder.com/150' }}
        style={styles.vendorImage}
      />
      <View style={styles.vendorInfo}>
        <Text style={styles.vendorName}>{item.name}</Text>
        <Text style={styles.vendorAddress}>{item.vendorInfo?.address?.addressLine1}, {item.vendorInfo?.address?.city}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={discountedVendors}
        renderItem={renderVendor}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 15 },
  vendorCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  vendorImage: { width: 80, height: 80, borderRadius: 10, marginRight: 15 },
  vendorInfo: { flex: 1, justifyContent: 'center' },
  vendorName: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  vendorAddress: { fontSize: 14, color: '#666' },
});

export default DiscountedVendorsScreen;

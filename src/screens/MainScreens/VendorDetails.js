import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorCategories, fetchVendorProducts } from '../../config/redux/actions/vendorActions';
import ProductCard from '../../components/ProductCard';

const VendorDetails = ({ route, navigation }) => {
  const { vendor } = route.params;
  const dispatch = useDispatch();
  const { vendorCategories, vendorProducts, loading } = useSelector(state => state.vendors);

  useEffect(() => {
    if (vendor?._id) {
      dispatch(fetchVendorCategories(vendor._id));
      dispatch(fetchVendorProducts(vendor._id));
    }
  }, [dispatch, vendor]);

  const handleCategoryPress = (categoryId) => {
    navigation.navigate('CategoryProducts', { categoryId, vendorId: vendor._id });
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity 
      style={styles.categoryItem}
      onPress={() => handleCategoryPress(item._id)}
    >
       <Image
          source={{ uri: item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/150' }}
          style={styles.categoryImage}
        />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.gridItem}
      onPress={() => navigation.navigate('Details', { product: item })}
    >
      <ProductCard item={item} />
    </TouchableOpacity>
  );

  const renderCategorisedProducts = () => {
    return vendorCategories.map(category => {
      const categoryProducts = vendorProducts.filter(p => p.category?._id === category._id).slice(0, 4);
      
      if (categoryProducts.length === 0) return null;

      return (
        <View key={category._id} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{category.name}</Text>
            <TouchableOpacity onPress={() => handleCategoryPress(category._id)}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.productGrid}>
            {categoryProducts.map(item => (
              <TouchableOpacity 
                key={item._id} 
                style={styles.gridItem}
                onPress={() => navigation.navigate('Details', { product: item })}
              >
                <ProductCard item={item} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    });
  };

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <Image
            source={{ uri: vendor.shopImages && vendor.shopImages.length > 0 ? vendor.shopImages[0] : 'https://via.placeholder.com/150' }}
            style={styles.vendorImage}
        />
        <View style={styles.vendorInfo}>
            <Text style={styles.vendorName}>{vendor.name}</Text>
            <Text style={styles.vendorAddress}>{vendor.vendorInfo?.address?.addressLine1}, {vendor.vendorInfo?.address?.city}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          data={vendorCategories}
          renderItem={renderCategory}
          keyExtractor={item => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {renderCategorisedProducts()}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Products</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={vendorProducts}
      renderItem={renderProduct}
      keyExtractor={item => item._id}
      numColumns={2}
      columnWrapperStyle={styles.productRow}
      ListHeaderComponent={renderHeader}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee' },
  vendorImage: { width: 80, height: 80, borderRadius: 40, marginRight: 15 },
  vendorInfo: { flex: 1 },
  vendorName: { fontSize: 20, fontWeight: 'bold' },
  vendorAddress: { fontSize: 14, color: '#666', marginTop: 5 },
  section: { padding: 15 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  viewAllText: { fontSize: 14, color: 'green', fontWeight: 'bold' },
  categoryItem: { marginRight: 15, alignItems: 'center', padding: 5, borderRadius: 10 },
  selectedCategoryItem: { backgroundColor: '#e0f2f1', borderColor: 'green', borderWidth: 1 },
  categoryImage: { width: 60, height: 60, borderRadius: 30, marginBottom: 5 },
  categoryName: { fontSize: 12 },
  selectedCategoryName: { fontWeight: 'bold', color: 'green' },
  productRow: { justifyContent: 'space-between', paddingHorizontal: 15 },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', marginBottom: 10 },
});

export default VendorDetails;

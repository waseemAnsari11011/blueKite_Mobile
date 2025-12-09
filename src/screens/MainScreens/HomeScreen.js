import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Loading from '../../components/Loading';
import Icon from '../../components/Icons/Icon';
import SearchBar from '../../components/SearchBar';
import CustomImageCarousal from '../../components/CustomImageCarousalLandscape';
import ProductCard from '../../components/ProductCard';
import {fetchRecentlyAddedProducts} from '../../config/redux/actions/recentlyAddedActions';
import {getBanners} from '../../config/redux/actions/bannerActions';
import {updateFcm} from '../../config/redux/actions/customerActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchVendorsNearMe} from '../../config/redux/actions/vendorActions';
import {fetchDiscountedProducts} from '../../config/redux/actions/discountedProductsActions';

const HomeScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {
    loading: vendorLoading,
    vendors,
    error: vendorError,
  } = useSelector(state => state.vendors);
  const {
    loading: bannerLoading,
    banners,
    error: bannerError,
  } = useSelector(state => state.banners);

  const {data} = useSelector(state => state?.local);

  const {
    loading: recentlyAddedLoading,
    products: recentlyAddedProducts,
    error: recentlyAddedError,
  } = useSelector(state => state.recentlyAddedProducts);

  const {
    loading: discountedProductsLoading,
    products: discountedProducts,
    error: discountedProductsError,
  } = useSelector(state => state.discountedProducts);

  useEffect(() => {
    const fetchAndUpdateFcm = async () => {
      const deviceToken = await AsyncStorage.getItem('deviceToken');
      if (deviceToken && data?.user?._id) {
        const deviceTokenData = JSON.parse(deviceToken);
        await updateFcm(data.user._id, deviceTokenData);
      }
    };

    fetchAndUpdateFcm();
  }, [data?.user?._id]);

  useEffect(() => {
    dispatch(getBanners());
  }, [dispatch]);

  useEffect(() => {
    // This effect runs only when the user data becomes available.
    const initializeAppData = async () => {
      if (data && data.user) {
        // 3. Get user's primary shipping address
        const userAddress = data.user.shippingAddresses?.address;

        // 4. Fetch all data that depends on user's location
        if (
          data.user.shippingAddresses?.location?.coordinates &&
          data.user.shippingAddresses?.location?.coordinates.length > 0
        ) {
          const [long, lat] = data.user.shippingAddresses.location.coordinates;
          dispatch(fetchVendorsNearMe(lat, long));
        }
      }
    };

    initializeAppData();
  }, [dispatch, data?.user]);

  useEffect(() => {
    if (vendors && vendors.length > 0) {
      const vendorIds = vendors.map(v => v._id).join(',');
      const userAddress = data?.user?.shippingAddresses?.address;
      
      dispatch(fetchDiscountedProducts(1, 4, userAddress, vendorIds));
      dispatch(fetchRecentlyAddedProducts(1, 4, userAddress, vendorIds));
    }
  }, [dispatch, vendors, data?.user]);





  const renderProduct = ({item}) => (
    <TouchableOpacity
      style={{width: '48%', marginBottom: 10}}
      onPress={() => navigation.navigate('Details', {product: item})}>
      <ProductCard item={item} />
    </TouchableOpacity>
  );

  const renderVendor = ({item}) => (
    <View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('VendorDetails', {
            vendor: item,
          })
        }>
        <View
          style={{
            alignSelf: 'baseline',
            alignItems: 'center',
            padding: 10,
            elevation: 10,
          }}>
          <Image
            source={{
              uri:
                item.shopImages && item.shopImages.length > 0
                  ? item.shopImages[0]
                  : 'https://via.placeholder.com/150',
            }}
            style={{width: 85, height: 85, borderRadius: 10}}
          />
          <Text
            style={{
              marginTop: 10,
              fontSize: 13,
              fontWeight: '400',
              color: '#000000',
            }}>
            {item.vendorInfo?.businessName || item.name}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const ListHeaderComponent = () => (
    <View style={{}}>
      <SearchBar />
      <View style={{marginTop: 15}}>
        <View style={{marginHorizontal: -20}}>
          <CustomImageCarousal
            data={banners}
            autoPlay={true}
            pagination={true}
          />
        </View>
      </View>
      <View style={{marginBottom: 5}}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            marginVertical: 5,
            color: '#000000',
          }}>
          Explore Vendors
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          directionalLockEnabled={true}
          alwaysBounceVertical={false}
          style={{marginHorizontal: -20}}>
          <FlatList
            contentContainerStyle={{alignSelf: 'flex-start'}}
            numColumns={Math.ceil(vendors.length / 2)}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={vendors}
            directionalLockEnabled={true}
            alwaysBounceVertical={false}
            renderItem={renderVendor}
          />
        </ScrollView>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            marginVertical: 5,
            color: '#000000',
          }}>
          On Sale
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Discounted Products')}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              color: 'green',
              marginRight: 5,
              fontSize: 15,
              fontWeight: '600',
            }}>
            View all
          </Text>
          <Icon.AntDesign name="right" color="#1e90ff" size={13} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={discountedProducts.slice(0, 4)}
        keyExtractor={(item, index) => item._id}
        renderItem={renderProduct}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          marginBottom: 5,
        }}
        contentContainerStyle={{padding: 15}}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            marginVertical: 5,
            color: '#000000',
          }}>
          New Arrivals
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('New Arrivals')}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              color: 'green',
              marginRight: 5,
              fontSize: 15,
              fontWeight: '600',
            }}>
            View all
          </Text>
          <Icon.AntDesign name="right" color="#1e90ff" size={13} />
        </TouchableOpacity>
      </View>


    </View>
  );

  return (
    <View style={{flex: 1}}>
      {vendorLoading && <Loading />}
      <FlatList
        data={recentlyAddedProducts.slice(0, 4)}
        keyExtractor={(item, index) => item._id}
        renderItem={renderProduct}
        ListHeaderComponent={ListHeaderComponent}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          marginBottom: 5,
        }}
        contentContainerStyle={{padding: 15}}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#F0F8FF50',
  },
  wrapper: {
    height: 160,
  },
  itemContainer: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
});

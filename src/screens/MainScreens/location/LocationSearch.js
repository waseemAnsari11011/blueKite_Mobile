import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  ActivityIndicator, // Import ActivityIndicator
} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import ManualLocationSearch from './ManualLocationSearch';
import ButtonComponent from '../../../components/Button';
import api from '../../../utils/api';
import {loadData, saveData} from '../../../config/redux/actions/storageActions';
import {GOOGLE_API_KEY} from '@env';

const LocationSearch = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {data} = useSelector(state => state?.local);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchLocation, setSearchLocation] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const [manualLocation, setManualLocation] = useState({
    description: '',
    pincode: '',
    state: '',
    country: '',
    city: '',
    lat: 0,
    lng: 0,
  });
  const googlePlacesRef = useRef(null);

  useEffect(() => {
    const loadLocalData = async () => {
      await dispatch(loadData('user'));
    };
    loadLocalData();
  }, []);

  // --- Helper: Geocode Address for Manual Entry ---
  const geocodeManualAddress = async addressString => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          addressString,
        )}&key=${GOOGLE_API_KEY}`,
      );
      const data = await response.json();
      if (data.status === 'OK' && data.results.length > 0) {
        const {lat, lng} = data.results[0].geometry.location;
        return {lat, lng};
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    return null;
  };

  const handleLocation = async () => {
    try {
      const locationData = searchLocation ? selectedLocation : manualLocation;
      if (!locationData) return;

      const {description, city, state, country, pincode} = locationData;

      // 1. Validation
      if (!description || !city || !state || !country || !pincode) {
        Alert.alert(
          'Missing Information',
          'Please fill in all address fields.',
        );
        return;
      }

      setLoading(true);

      // 2. Ensure Coordinates Exist
      let finalLat = locationData.lat;
      let finalLng = locationData.lng;

      // If manual entry or missing coords, try to geocode now
      if (!finalLat || !finalLng) {
        const fullAddress = `${description}, ${city}, ${state}, ${country}, ${pincode}`;
        const coords = await geocodeManualAddress(fullAddress);

        if (coords) {
          finalLat = coords.lat;
          finalLng = coords.lng;
        } else {
          setLoading(false);
          Alert.alert(
            'Location Error',
            'We could not determine the precise location of this address. Please try selecting it from the search bar.',
          );
          return; // STOP here if we don't have coordinates
        }
      }

      const availableLocalities = pincode;
      const userId = data?.user?._id;

      // 3. Send Data to Backend
      const response = await api.post(`/address/${userId}/`, {
        addressLine1: description,
        city,
        state,
        country,
        postalCode: pincode,
        availableLocalities,
        location: {
          type: 'Point',
          coordinates: [finalLng, finalLat], // Mongo expects [lng, lat]
        },
      });

      if (response.status === 200) {
        dispatch(saveData('user', response.data.user));
        if (route?.params?.isCheckOut || route?.params?.goBack) {
          dispatch(loadData('user'));
          navigation.goBack();
        } else {
          navigation.navigate('Main');
        }
      }
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Error', 'Failed to save address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (data, details) => {
    const getComponent = type =>
      details.address_components.find(c => c.types.includes(type))?.long_name;

    const pincode = getComponent('postal_code');
    const state = getComponent('administrative_area_level_1');
    const country = getComponent('country');
    const city = getComponent('locality');

    // Extract Lat/Lng directly from details
    const {lat, lng} = details.geometry.location;

    // Populate manual location state with whatever we found
    setManualLocation({
      description: data.description,
      pincode: pincode || '', // Allow empty pincode
      state: state || '',
      country: country || '',
      city: city || '',
      lat,
      lng,
    });

    // Switch to manual mode so user can edit/add details (like pincode)
    setSearchLocation(false);
    setSelectedLocation(null); // Clear selected location to show manual form
  };

  const handleManualLocationChange = (field, value) => {
    setManualLocation(prev => ({...prev, [field]: value}));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Select location</Text>
      <View style={styles.switchContainer}>
        <Text>Search Location</Text>
        <Switch value={searchLocation} onValueChange={setSearchLocation} />
      </View>

      {searchLocation ? (
        <GooglePlacesAutocomplete
          ref={googlePlacesRef}
          placeholder="Search for a location"
          minLength={2}
          fetchDetails={true}
          onPress={handleLocationSelect}
          query={{
            key: GOOGLE_API_KEY,
            language: 'en',
          }}
          styles={{
            container: styles.autocompleteContainer,
            textInputContainer: styles.textInputContainer,
            textInput: styles.textInput,
            listView: styles.listView,
            row: styles.row,
            description: styles.description,
          }}
          renderLeftButton={() => (
            <View style={styles.leftIconContainer}>
              <Icon name="search" size={20} color="#555" />
            </View>
          )}
          renderRightButton={() => (
            <TouchableOpacity
              onPress={() => googlePlacesRef.current?.clear()}
              style={styles.rightIconContainer}>
              <Icon name="close" size={20} color="#555" />
            </TouchableOpacity>
          )}
        />
      ) : (
        <ManualLocationSearch
          manualLocation={manualLocation}
          handleManualLocationChange={handleManualLocationChange}
        />
      )}

      {(selectedLocation ||
        (!searchLocation && manualLocation.description)) && (
        <View style={styles.selectedLocationContainer}>
          <Text style={styles.locationText}>
            Location:{' '}
            {searchLocation
              ? selectedLocation.description
              : manualLocation.description}
          </Text>
          <Text style={styles.pincodeText}>
            Pincode:{' '}
            {searchLocation ? selectedLocation.pincode : manualLocation.pincode}
          </Text>

          <View style={{marginTop: 30}}>
            {loading ? (
              <ActivityIndicator size="large" color="green" />
            ) : (
              <ButtonComponent
                title={'Confirm Location'}
                color={'green'}
                onPress={handleLocation}
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 10, backgroundColor: '#fff'},
  headerText: {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  autocompleteContainer: {flex: 0},
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    padding: 5,
    paddingLeft: 10,
  },
  textInput: {
    height: 40,
    flex: 1,
    color: '#5d5d5d',
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  listView: {backgroundColor: 'white'},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  description: {marginLeft: 10, fontSize: 14, color: '#000'},
  selectedLocationContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  locationText: {fontSize: 16, fontWeight: 'bold'},
  pincodeText: {fontSize: 14, color: '#555', marginTop: 5},
  leftIconContainer: {marginRight: 10},
  rightIconContainer: {marginLeft: 10},
});

export default LocationSearch;

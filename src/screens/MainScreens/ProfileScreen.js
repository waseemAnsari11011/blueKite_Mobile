import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  SafeAreaView,
  Pressable, // Import Pressable
} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LogoutButton from '../../utils/logout';
import {useSelector} from 'react-redux';
import Icon from '../../components/Icons/Icon';
import {baseURL} from '../../utils/api';

// The phone number you want to call
const phoneNumber = '8287076676';

const ProfileScreen = ({navigation}) => {
  const {data} = useSelector(state => state.local);
  let url = data.user.image;

  if (url?.startsWith('http:')) {
    // Replace "http" with "https"
    url = url.replace('http:', 'https:');
  }

  const openLink = () => {
    Linking.openURL('https://waizcom.netlify.app/');
  };

  const handlePhoneCall = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View>
          <View style={styles.header}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {url ? (
                <Image
                  style={styles.profileImage}
                  source={{uri: `${baseURL}${url}`}}
                />
              ) : (
                <Image
                  style={styles.profileImage}
                  source={require('../../assets/images/default_profile.png')}
                />
              )}
              <View>
                <Text style={styles.profileName}>{data.user.name}</Text>
              </View>
            </View>
            <LogoutButton />
          </View>
          <View style={{padding: 20}}>
            <Text style={{fontSize: 16, color: 'black', fontWeight: '600'}}>
              Your delivery address
            </Text>
            <View style={styles.addressContainer}>
              <View>
                <Text style={styles.addressText}>
                  {data.user.shippingAddresses.address}
                </Text>
              </View>
              <AntDesign
                onPress={() =>
                  navigation.navigate('Add Location', {goBack: true})
                }
                name="edit"
                style={{color: `green`}}
                size={20}
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={handlePhoneCall}
            style={styles.needHelpContainer}>
            <View style={styles.itemSubContainer}>
              <Image
                style={[styles.itemImage, {height: 30, width: 30}]}
                source={require('../../assets/images/headphone.png')}
              />
              <View>
                <Text
                  style={[styles.itemTitle, {fontWeight: '600', fontSize: 15}]}>
                  Need Help?
                </Text>
                <Text style={{fontWeight: '300', fontSize: 13}}>
                  We're here for you
                </Text>
              </View>
            </View>
            <AntDesign name="right" style={{color: 'black'}} size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Edit Profile')}
            style={styles.itemContainer}>
            <View style={styles.itemSubContainer}>
              <Icon.FontAwesome
                name="user"
                style={styles.itemIcon}
                size={24}
                color="green"
              />
              <Text style={styles.itemTitle}>Edit Profile</Text>
            </View>
            <AntDesign name="right" style={{color: 'green'}} size={20} />
          </TouchableOpacity>
          <View style={styles.borderBottom}></View>
          <TouchableOpacity
            onPress={() => navigation.navigate('My order')}
            style={styles.itemContainer}>
            <View style={styles.itemSubContainer}>
              <Icon.Entypo
                name="shopping-cart"
                style={styles.itemIcon}
                size={24}
                color="green"
              />
              <Text style={styles.itemTitle}>My orders</Text>
            </View>
            <AntDesign name="right" style={{color: 'green'}} size={20} />
          </TouchableOpacity>
          <View style={styles.borderBottom}></View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Submit Inquiry')}
            style={styles.itemContainer}>
            <View style={styles.itemSubContainer}>
              <Icon.FontAwesome
                name="inbox"
                style={styles.itemIcon}
                size={24}
                color="green"
              />
              <Text style={styles.itemTitle}>Inquiries</Text>
            </View>
            <AntDesign name="right" style={{color: 'green'}} size={20} />
          </TouchableOpacity>
          <View style={styles.borderBottom}></View>

          <TouchableOpacity
            onPress={() => navigation.navigate('Contact us')}
            style={styles.itemContainer}>
            <View style={styles.itemSubContainer}>
              <Icon.Ionicons
                name="call"
                style={styles.itemIcon}
                size={24}
                color="green"
              />
              <Text style={styles.itemTitle}>Contact Us</Text>
            </View>
            <AntDesign name="right" style={{color: 'green'}} size={20} />
          </TouchableOpacity>
          <View style={styles.borderBottom}></View>
        </View>
      </ScrollView>

      {/* Footer is now outside the ScrollView, so it remains fixed */}
      <Pressable
        onPress={openLink}
        style={({pressed}) => [styles.footer, {opacity: pressed ? 0.7 : 1}]}>
        <Text style={styles.footerText}>BlueKite</Text>
        <View style={styles.developerLinkContainer}>
          <Text style={styles.footerSubText}>Developed by Waizcom</Text>
          <Icon.FontAwesome
            name="external-link"
            size={16}
            color="blue"
            style={{marginLeft: 8}}
          />
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: `#f5fffa`,
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20, // Adjusted padding
  },
  profileImage: {
    height: 50,
    width: 50,
    resizeMode: 'contain',
    borderRadius: 25,
    marginRight: 15,
  },
  profileName: {
    color: 'black',
    fontSize: 20,
    fontWeight: '600',
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    alignItems: 'center',
  },
  addressText: {
    fontSize: 17,
    color: 'black',
    width: 250,
    fontWeight: '300',
  },
  borderBottom: {
    borderWidth: 0.7,
    marginLeft: 10,
    marginRight: 10,
    borderColor: `#d3d3d3`,
  },
  itemContainer: {
    padding: 20,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemIcon: {
    width: 24, // for alignment
  },
  itemImage: {
    height: 38,
    width: 38,
    marginRight: 10,
    resizeMode: 'contain',
    padding: 10,
  },
  itemTitle: {
    color: 'black',
    fontSize: 16,
    fontWeight: '400',
    marginLeft: 10,
  },
  itemSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  needHelpContainer: {
    padding: 15,
    backgroundColor: '#CF9FFF55',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  footerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  footerSubText: {
    fontSize: 17,
    color: 'blue',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  // Added style for the developer link
  developerLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
});

import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import * as NavigationService from './NavigationService';
import api from './api';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

export async function GetFCMToken() {
  let fcmtoken = await AsyncStorage.getItem('fcmtoken');
  console.log('fcmtoken new', fcmtoken);

  if (!fcmtoken) {
    try {
      let fcmtoken = await messaging().getToken();
      if (fcmtoken) {
        console.log('fcmtoken', fcmtoken);
        await AsyncStorage.setItem('fcmtoken', fcmtoken);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const handleNotificationNavigation = async remoteMessage => {
  console.log('handleNotificationNavigation:', remoteMessage?.data);
  if (remoteMessage?.data?.type === 'product_offer' && remoteMessage?.data?.productId) {
    try {
      console.log('Fetching product:', remoteMessage.data.productId);
      const response = await api.get(
        `/single-product/${remoteMessage.data.productId}`,
      );
      console.log('Product fetch response:', response.data);
      if (response.data && response.data.product) {
        console.log('Navigating to Details with product');
        NavigationService.navigate('Details', {
          product: response.data.product,
        });
      } else {
        console.log('Product not found in response');
      }
    } catch (error) {
      console.log('Error fetching product for notification:', error);
    }
  } else {
    console.log('Notification type is not product_offer or missing productId');
  }
};

export const checkInitialNotification = async () => {
  console.log('checkInitialNotification called');
  try {
    const remoteMessage = await messaging().getInitialNotification();
    console.log('getInitialNotification result:', remoteMessage);
    
    if (remoteMessage) {
      console.log(
        'Notification caused app to open from quit state (notification):',
        remoteMessage.notification,
      );
      console.log(
        'Notification caused app to open from quit state (data):',
        remoteMessage.data,
      );
      
      console.log('Calling handleNotificationNavigation...');
      await handleNotificationNavigation(remoteMessage);
      console.log('handleNotificationNavigation returned');
    } else {
      console.log('No initial notification found');
    }
  } catch (error) {
    console.log('Error checking initial notification:', error);
  }
};

export const notificationListener = () => {
  console.log('notificationListener');

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
    handleNotificationNavigation(remoteMessage);
  });

  messaging().onMessage(async remoteMessage => {
    console.log('foreground state::::::>', remoteMessage);
    alert(remoteMessage.notification.body);
  });
};

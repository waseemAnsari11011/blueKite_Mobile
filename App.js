import React, {useEffect, useState} from 'react';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import store from './src/config/redux/store';
import RootNavigator from './src/navigators/RootNavigator';
import firebase from '@react-native-firebase/app';
import {PaperProvider} from 'react-native-paper';
import {
  requestUserPermission,
  GetFCMToken as getToken,
  notificationListener,
} from './src/utils/pushNotification';
import {checkForUpdates} from './src/utils/checkUpdate';
import {PermissionsAndroid, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import crashlytics from '@react-native-firebase/crashlytics';
const App = () => {
  useEffect(() => {
    const setupMessaging = async () => {
      // Request notification permission
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission granted');
      } else {
        console.log('Notification permission denied');
      }
      await requestUserPermission();
      const token = await getToken();
      await AsyncStorage.setItem('deviceToken', JSON.stringify(token));

      await notificationListener();
    };

    setupMessaging();
    checkForUpdates();
  }, []);

  return (
    <Provider store={store}>
      <PaperProvider>
        <RootNavigator />
        {/* <Button title="Test Crash" onPress={() => crashlytics().crash()} /> */}
      </PaperProvider>
    </Provider>
  );
};

export default App;

//9jun

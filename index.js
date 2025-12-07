/**
 * @format
 */
import 'react-native-gesture-handler';
if (__DEV__) {
  import('./src/config/ReactotronConfig').then(() => console.log('Reactotron Configured'));
}
import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import {name as appName} from './app.json';


messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Background message handled:', remoteMessage);
  });
  

AppRegistry.registerComponent(appName, () => App);

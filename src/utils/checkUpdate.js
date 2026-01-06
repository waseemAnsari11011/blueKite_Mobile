import SpInAppUpdates, {
  IAUUpdateKind,
} from 'sp-react-native-in-app-updates';
import {Platform} from 'react-native';

const inAppUpdates = new SpInAppUpdates(
  false, // isDebug: set to true if you want to test locally (mock update)
);

export const checkForUpdates = () => {
  if (Platform.OS !== 'android') {
    return;
  }

  inAppUpdates
    .checkNeedsUpdate()
    .then(result => {
      console.log('Update info:', result);
      if (result.shouldUpdate) {
        let updateOptions = {};
        if (Platform.OS === 'android') {
          // android only, on iOS the user will be promped to go to your app store page
          updateOptions = {
            updateType: IAUUpdateKind.IMMEDIATE,
          };
        }
        inAppUpdates.startUpdate(updateOptions);
      }
    })
    .catch(error => {
      console.log('Error checking for updates:', error);
    });
};

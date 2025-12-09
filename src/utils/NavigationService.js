import {createNavigationContainerRef} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    console.log(`NavigationService: Navigating to ${name} with params:`, params);
    navigationRef.navigate(name, params);
  } else {
    console.log('NavigationService: Navigation container is not ready');
  }
}

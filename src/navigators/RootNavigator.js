import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import AuthNavigator from './AuthNavigator';
import StackNavigator from './StackNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {loadData} from '../config/redux/actions/storageActions';
import SplashScreen from '../components/SplashScreen';

import {navigationRef} from '../utils/NavigationService';
import {checkInitialNotification} from '../utils/pushNotification';

const RootNavigator = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const dispatch = useDispatch();
  const {data} = useSelector(state => state?.local);

  useEffect(() => {
    const loadLocalData = async () => {
      await dispatch(loadData('user'));
    };
    loadLocalData();
  }, []);

  // Check for initial notification when app is ready and user is logged in
  useEffect(() => {
    if (!isLoading && data?.user) {
      console.log('RootNavigator: App ready, calling checkInitialNotification');
      checkInitialNotification();
    }
  }, [isLoading, data?.user]);

  return (
    <NavigationContainer ref={navigationRef}>
      {isLoading ? (
        <SplashScreen />
      ) : data?.user ? (
        <StackNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
 
};

export default RootNavigator;

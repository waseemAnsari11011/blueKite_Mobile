import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const baseURL = 'http://10.0.2.2:8000/api';
export const serverURL = 'http://10.0.2.2:8000/';

// const baseURL = 'http://65.1.85.105/api/';

// const api = axios.create({
//   baseURL: 'http://65.1.85.105/api/', // Use http and local IP for development
// });

const api = axios.create({
  baseURL: baseURL,
});

api.interceptors.request.use(
  async config => {
    const tokenData = await AsyncStorage.getItem('token');
    const token = JSON.parse(tokenData);

    if (
      config.url !== '/customers/login' &&
      config.url !== '/customers/signup'
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default api;

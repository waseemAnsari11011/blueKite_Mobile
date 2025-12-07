import api from '../../../utils/api';
import {
  FETCH_VENDORS_NEAR_ME_REQUEST,
  FETCH_VENDORS_NEAR_ME_SUCCESS,
  FETCH_VENDORS_NEAR_ME_FAILURE,
  FETCH_VENDOR_CATEGORIES_REQUEST,
  FETCH_VENDOR_CATEGORIES_SUCCESS,
  FETCH_VENDOR_CATEGORIES_FAILURE,
  FETCH_VENDOR_PRODUCTS_REQUEST,
  FETCH_VENDOR_PRODUCTS_SUCCESS,
  FETCH_VENDOR_PRODUCTS_FAILURE,
  FETCH_DISCOUNTED_VENDORS_REQUEST,
  FETCH_DISCOUNTED_VENDORS_SUCCESS,
  FETCH_DISCOUNTED_VENDORS_FAILURE,
  FETCH_NEW_ARRIVAL_VENDORS_REQUEST,
  FETCH_NEW_ARRIVAL_VENDORS_SUCCESS,
  FETCH_NEW_ARRIVAL_VENDORS_FAILURE,
} from './types';



export const fetchNewArrivalVendors = (lat, long) => {
  return async dispatch => {
    dispatch({type: FETCH_NEW_ARRIVAL_VENDORS_REQUEST});
    try {
      const response = await api.get(`/vendors/new-arrivals`, {
        params: {lat, long},
      });
      dispatch({
        type: FETCH_NEW_ARRIVAL_VENDORS_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      console.error("fetchNewArrivalVendors error", error);
      dispatch({
        type: FETCH_NEW_ARRIVAL_VENDORS_FAILURE,
        payload: error.message,
      });
    }
  };
};

export const fetchVendorsNearMe = (lat, long) => {
  return async dispatch => {
    dispatch({type: FETCH_VENDORS_NEAR_ME_REQUEST});
    try {
      const response = await api.get(`/vendors/nearme`, {
        params: {lat, long},
      });
      dispatch({
        type: FETCH_VENDORS_NEAR_ME_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      console.error("fetchVendorsNearMe error", error);
      dispatch({
        type: FETCH_VENDORS_NEAR_ME_FAILURE,
        payload: error.message,
      });
    }
  };
};

export const fetchDiscountedVendors = (lat, long) => {
  return async dispatch => {
    dispatch({type: FETCH_DISCOUNTED_VENDORS_REQUEST});
    try {
      const response = await api.get(`/vendors/discounted`, {
        params: {lat, long},
      });
      dispatch({
        type: FETCH_DISCOUNTED_VENDORS_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      console.error("fetchDiscountedVendors error", error);
      dispatch({
        type: FETCH_DISCOUNTED_VENDORS_FAILURE,
        payload: error.message,
      });
    }
  };
};

export const fetchVendorCategories = (vendorId) => {
  return async dispatch => {
    dispatch({type: FETCH_VENDOR_CATEGORIES_REQUEST});
    try {
      const response = await api.get(`/category/vendor/${vendorId}`);
      dispatch({
        type: FETCH_VENDOR_CATEGORIES_SUCCESS,
        payload: response.data.categories,
      });
    } catch (error) {
      console.error("fetchVendorCategories error", error);
      dispatch({
        type: FETCH_VENDOR_CATEGORIES_FAILURE,
        payload: error.message,
      });
    }
  };
};

export const fetchVendorProducts = (vendorId) => {
  return async dispatch => {
    dispatch({type: FETCH_VENDOR_PRODUCTS_REQUEST});
    try {
      const response = await api.get(`/products/${vendorId}`);
      dispatch({
        type: FETCH_VENDOR_PRODUCTS_SUCCESS,
        payload: response.data.products,
      });
    } catch (error) {
      console.error("fetchVendorProducts error", error);
      dispatch({
        type: FETCH_VENDOR_PRODUCTS_FAILURE,
        payload: error.message,
      });
    }
  };
};

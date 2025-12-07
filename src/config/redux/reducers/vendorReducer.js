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
} from '../actions/types';

const initialState = {
  loading: false,
  vendors: [],
  discountedVendors: [],
  newArrivalVendors: [],
  vendorCategories: [],
  vendorProducts: [],
  error: '',
};

const vendorReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_VENDORS_NEAR_ME_REQUEST:
    case FETCH_VENDOR_CATEGORIES_REQUEST:
    case FETCH_VENDOR_PRODUCTS_REQUEST:
    case FETCH_DISCOUNTED_VENDORS_REQUEST:
    case FETCH_NEW_ARRIVAL_VENDORS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_VENDORS_NEAR_ME_SUCCESS:
      return {
        ...state,
        loading: false,
        vendors: action.payload,
        error: '',
      };
    case FETCH_DISCOUNTED_VENDORS_SUCCESS:
      return {
        ...state,
        loading: false,
        discountedVendors: action.payload,
        error: '',
      };
    case FETCH_NEW_ARRIVAL_VENDORS_SUCCESS:
      return {
        ...state,
        loading: false,
        newArrivalVendors: action.payload,
        error: '',
      };
    case FETCH_VENDOR_CATEGORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        vendorCategories: action.payload,
        error: '',
      };
    case FETCH_VENDOR_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        vendorProducts: action.payload,
        error: '',
      };
    case FETCH_VENDORS_NEAR_ME_FAILURE:
    case FETCH_VENDOR_CATEGORIES_FAILURE:
    case FETCH_VENDOR_PRODUCTS_FAILURE:
    case FETCH_DISCOUNTED_VENDORS_FAILURE:
    case FETCH_NEW_ARRIVAL_VENDORS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default vendorReducer;

import api from '../../../utils/api';
import {
  FETCH_CATEGORY_FAILURE,
  FETCH_CATEGORY_SUCCESS,
  FETCH_CATEGORY_REQUEST,
} from './types';

export const fetchCategories = userAddress => {
  console.log('userAddress==>>', userAddress);
  return async dispatch => {
    dispatch({type: FETCH_CATEGORY_REQUEST});
    try {
      const response = await api.get('/category', {
        params: {
          userAddress,
        },
      });
      dispatch({
        type: FETCH_CATEGORY_SUCCESS,
        payload: response.data.categories,
      });
    } catch (error) {
      console.log('err-->', error);
      dispatch({type: FETCH_CATEGORY_FAILURE, payload: error.message});
    }
  };
};

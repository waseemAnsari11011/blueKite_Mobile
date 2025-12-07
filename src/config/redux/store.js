import { createStore, applyMiddleware, compose } from 'redux';
import Reactotron from '../ReactotronConfig';
import { thunk } from 'redux-thunk';
import rootReducer from './reducers/index';

const store = createStore(rootReducer, compose(applyMiddleware(thunk), Reactotron.createEnhancer()));

export default store;

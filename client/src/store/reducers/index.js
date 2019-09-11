import {combineReducers} from 'redux';
import translateReducer from './translate';
import authReducer from './auth';

export default combineReducers({
  translate: translateReducer,
  user: authReducer
});
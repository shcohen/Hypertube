import {combineReducers} from 'redux';
import translateReducer from './translate';

export default combineReducers({
  translate: translateReducer
});

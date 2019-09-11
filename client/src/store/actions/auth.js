import cookies from '../../utils/cookies';
import setAuthToken from '../../utils/setAuthToken';

import {SET_CURRENT_USER} from './constants';

export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
};

export const logoutUser = () => dispatch => {
  if (cookies.get('jwtToken')) {
    cookies.delete('jwtToken');
  }
  setAuthToken(false);
  dispatch(setCurrentUser({}));
};
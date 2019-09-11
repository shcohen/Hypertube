import isEmpty from '../../utils/isEmpty';

import {SET_CURRENT_USER} from '../actions/constants';

const initialState = {
  isAuthenticated: false,
  user: {}
};

const authReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(payload),
        user: payload
      };
    default:
      return state;
  }
};

export default authReducer;
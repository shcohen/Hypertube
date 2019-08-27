import {GET_TRANSLATION} from '../actions/constants';

const translateReducer = (state = [], {type, payload}) => {
    switch (type) {
      case GET_TRANSLATION:
        return {
          ...payload
        };
      default:
        return state;
    }
};

export default translateReducer;
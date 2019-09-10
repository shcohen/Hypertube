import {GET_TRANSLATION, TRANSLATION_LOADING} from '../actions/constants';

const translateReducer = (state = [], {type, payload}) => {
    switch (type) {
      case GET_TRANSLATION:
        return {
          ...state,
          ...payload
        };
      case TRANSLATION_LOADING:
        return {
          ...state,
          loading: payload
        };
      default:
        return state;
    }
};

export default translateReducer;
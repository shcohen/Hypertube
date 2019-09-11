import {GET_TRANSLATION, TRANSLATION_LOADING, SET_LANGUAGE} from '../actions/constants';

const translateReducer = (state = {loading: false, lang: 'en'}, {type, payload}) => {
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
      case SET_LANGUAGE:
        return {
          ...state,
          lang: payload
        };
      default:
        return state;
    }
};

export default translateReducer;
import {GET_TRANSLATION, TRANSLATION_LOADING, SET_LANGUAGE} from './constants';

import axios from 'axios';

import store from '../index';
import english from '../../utils/english';

export const getTranslation = () => async dispatch => {
  const state = store.getState();
  const {lang} = state.translate || 'en';
  dispatch({
    type: TRANSLATION_LOADING,
    payload: true
  });
  if (lang === 'en') {
    dispatch({
      type: GET_TRANSLATION,
      payload: english
    });
    dispatch({
      type: TRANSLATION_LOADING,
      payload: false
    });
    return;
  }
  const storeToken = axios.defaults.headers.common['Authorization'];
  delete axios.defaults.headers.common['Authorization'];
  const tab = Object.entries(english);
  let res = {};
  await Promise.all(tab.map(async ([page, textObj]) => {
    let textArr = Object.entries(textObj);
    let tmp = {};
    await Promise.all(textArr.map(async ([textName, textContent]) => {
      let response = await axios.get('https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20190827T162414Z.8f955b0b6efe7dc0.af0b47eb7ccf2bdb8e1b3f93191aa497966ad560'
        + `&text=${'|' + textContent + '|'}&lang=en-${lang}`);
      let textTranslated = response.data.text[0];
      tmp = {...tmp, [textName]: textTranslated.replace(/[|]/gm, '')};
    }));
    res = {...res, [page]: tmp}
  }));
  dispatch({
    type: GET_TRANSLATION,
    payload: res
  });
  axios.defaults.headers.common['Authorization'] = storeToken;
  dispatch({
    type: TRANSLATION_LOADING,
    payload: false
  });
};

export const setLanguage = (lang) => dispatch => {
  dispatch({
    type: SET_LANGUAGE,
    payload: lang
  });
};
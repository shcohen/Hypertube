import {GET_TRANSLATION, TRANSLATION_LOADING} from './constants';

import axios from 'axios';

import english from '../../utils/english';

export const getTranslation = () => async dispatch => {
  //todo: CALL API TO CHANGE FAVORITE LANGUAGE
  dispatch({
    type: TRANSLATION_LOADING,
    payload: true
  });
  dispatch({
    type: GET_TRANSLATION,
    payload: english
  });
  const tab = Object.entries(english);
  let res = {};
  await Promise.all(tab.map(async ([page, textObj]) => {
    let textArr = Object.entries(textObj);
    let tmp = {};
    await Promise.all(textArr.map(async ([textName, textContent]) => {
      let response = await axios.get('https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20190827T162414Z.8f955b0b6efe7dc0.af0b47eb7ccf2bdb8e1b3f93191aa497966ad560'
        + `&text=${textContent}&lang=en-fr`);
      console.log(response.data);
      let textTranslated = response.data.text[0];
      tmp = {...tmp, [textName]: textTranslated};
    }));
    res = {...res, [page]: tmp}
  }));

  dispatch({
    type: GET_TRANSLATION,
    payload: res
  });
  dispatch({
    type: TRANSLATION_LOADING,
    payload: false
  });
};
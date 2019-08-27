import {GET_TRANSLATION} from './constants';

import axios from 'axios';

import english from '../../utils/english';

export const getTranslation = () => dispatch => {
  //todo: CALL API TO CHANGE FAVORITE LANGUAGE
  console.log(encodeURI(JSON.stringify(english)));
  axios.get('https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20190827T162414Z.8f955b0b6efe7dc0.af0b47eb7ccf2bdb8e1b3f93191aa497966ad560'
    + `text=${encodeURI(JSON.stringify(english))}&lang=en-fr`)
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
  dispatch({
    type: GET_TRANSLATION,
    payload: english
  })
};
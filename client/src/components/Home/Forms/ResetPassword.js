import React, {useState} from 'react';
import axios from 'axios';

import PasswordValidator from "../../Utilities/PasswordValidator/PasswordValidator";

const ResetPassword = (props) => {
  let [formData, setFormData] = useState({
    password: '',
    confirm: '',
    passwordError: '',
    confirmError: ''
  });

  const onInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/account/reset_password', {...formData, resetToken: props.token})
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  };

  const t = props.text || {};

  return (
    <form onSubmit={onFormSubmit}>
      <h4>{t._CHANGE_PWD_SUBTITLE}</h4>
      <label>{t._NEW_PASSWORD}</label><br/>
      <div className="pwd-validator">
        <input className="validation"
               name="password"
               type="password"
               placeholder={t._PASSWORD_PLACEHOLDER}
               minLength="1"
               maxLength="64"
               pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,64}$"
               required
               onChange={onInputChange}
               value={formData.password}/><br/>
        <PasswordValidator password={formData.password}/>
      </div>
      {formData.passwordError !== '' && <p><i className="fas fa-times"/> {formData.passwordError}</p>}
      <label>{t._CONFIRMATION}</label><br/>
      <input className="validation"
             name="confirm"
             type="password"
             placeholder={t._CONFIRMATION_PLACEHOLDER}
             minLength="1"
             maxLength="64"
             pattern={'^' + formData.password + '$'}
        // pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,64}$"
             required
             onChange={onInputChange}
             value={formData.confirm}/><br/>
      {formData.confirmError !== '' && <p><i className="fas fa-times"/> {formData.confirmError}</p>}
      <input type="submit" value={' ' + t._CHANGE_PWD_BUTTON + ' '}/>
    </form>
  );
};

export default ResetPassword;
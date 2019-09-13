import React, {useState} from 'react';
import axios from 'axios';

const ForgotPassword = (props) => {
  let [formData, setFormData] = useState({
    email: '',
    emailError: '',
  });

  const onInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/account/forgot_password', formData)
      .then((res) => {
        console.log('forgot password sent');
      })
      .catch((err) => {
        setFormData({...err.response.data});
      });
  };

  const t = props.text || {};

  return (
    <form onSubmit={onFormSubmit}>
      <h4>{t._FORGOT_PWD_SUBTITLE}</h4>
      <label>{t._EMAIL_ADDRESS}</label><br/>
      <input name="email"
             type="email"
             placeholder={t._FORGOT_PWD_EMAIL_PLACEHOLDER}
             onChange={onInputChange}
             value={formData.email}/><br/>
      {formData.emailError !== '' && <p><i className="fas fa-times"/> {formData.emailError}</p>}
      <input type="submit" value={' ' + t._FORGOT_PWD_BUTTON + ' '}/>
    </form>
  );
};

export default ForgotPassword;
import React, {useState} from 'react';
import axios from 'axios';

const Login = (props) => {
  let [formData, setFormData] = useState({
    username: '',
    password: '',
    loginError: ''
  });

  const onInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/account/login', formData)
      .then(res => {
          console.log('salut');
          window.location.reload(true);
      })
      .catch(err => {
        setFormData({...formData, ...err.response.data[0]});
      });
  };

  const t = props.text || {};

  return (
    <form onSubmit={onFormSubmit}>
      <h4>{t._LOGIN_SUBTITLE}</h4>
      <label>{t._EMAIL_OR_USERNAME}</label><br/>
      <input name="username"
             type="text"
             placeholder={t._EMAIL_OR_USERNAME_PLACEHOLDER}
             minLength="1"
             maxLength="64"
             required
             onChange={onInputChange}
             value={formData.username}/><br/>
      <label>{t._PASSWORD} <span onClick={props.goToForgotPwd}>({t._FORGOTTEN} ?)</span></label><br/>
      <input name="password"
             type="password"
             placeholder={t._LOGIN_PASSWORD_PLACEHOLDER}
             minLength="1"
             maxLength="64"
             required
             onChange={onInputChange}
             value={formData.password}/><br/>
      {formData.loginError !== '' && <p><i className="fas fa-times"/> {formData.loginError}</p>}
      <input type="submit" value={' ' + t._LOGIN_BUTTON + ' '}/>
    </form>
  );
};

export default Login;
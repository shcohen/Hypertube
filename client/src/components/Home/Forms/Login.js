import React, {useState} from 'react';

const Login = (props) => {
  let [formData, setFormData] = useState({
    login: '',
    password: '',
    loginError: '',
    passwordError: 'Identifiants incorrects.'
  });

  const onInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
  };

  const t = props.text || {};

  return (
    <form onSubmit={onFormSubmit}>
      <h4>{t._LOGIN_SUBTITLE}</h4>
      <label>{t._EMAIL_OR_USERNAME}</label><br/>
      <input name="login"
             type="text"
             placeholder={t._EMAIL_OR_USERNAME_PLACEHOLDER}
             minLength="1"
             maxLength="64"
             required
             onChange={onInputChange}
             value={formData.login}/><br/>
      {formData.loginError !== '' && <p><i className="fas fa-times"/> {formData.loginError}</p>}
      <label>{t._PASSWORD} <span onClick={props.goToForgotPwd}>({t._FORGOTTEN} ?)</span></label><br/>
      <input name="password"
             type="password"
             placeholder={t._LOGIN_PASSWORD_PLACEHOLDER}
             minLength="1"
             maxLength="64"
             required
             onChange={onInputChange}
             value={formData.password}/><br/>
      {formData.passwordError !== '' && <p><i className="fas fa-times"/> {formData.passwordError}</p>}
      <input type="submit" value={' ' + t._LOGIN_BUTTON + ' '}/>
    </form>
  );
};

export default Login;
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

  return (
    <form onSubmit={onFormSubmit}>
      <h4>Vous pouvez vous connecter avec vos identifiants :</h4>
      <label>Email ou nom d'utilisateur</label><br/>
      <input name="login"
             type="text"
             placeholder="Votre email ou nom d'utilisateur"
             minLength="1"
             maxLength="64"
             required
             onChange={onInputChange}
             value={formData.login}/><br/>
      {formData.loginError !== '' && <p><i className="fas fa-times"/> {formData.loginError}</p>}
      <label>Mot de passe <span onClick={props.goToForgotPwd}>(oublié ?)</span></label><br/>
      <input name="password"
             type="password"
             placeholder="Votre mot de passe"
             minLength="1"
             maxLength="64"
             required
             onChange={onInputChange}
             value={formData.password}/><br/>
      {formData.passwordError !== '' && <p><i className="fas fa-times"/> {formData.passwordError}</p>}
      <input type="submit" value="Se connecter"/>
    </form>
  );
};

export default Login;
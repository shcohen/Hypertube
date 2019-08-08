import React, {useState} from 'react';

import validation from '../../../utils/validation';

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
    if (!validation.login(formData)) {
      console.log('non non non');
    }
  };

  return (
    <form onSubmit={onFormSubmit}>
      <h4>Vous pouvez vous connecter avec vos identifiants :</h4>
      <label>Email ou nom d'utilisateur</label><br/>
      <input name="login"
             type="text"
             placeholder="Votre email ou nom d'utilisateur"
             onChange={onInputChange}
             value={formData.login}/><br/>
      {formData.loginError !== '' && <p><i className="fas fa-times"/> {formData.loginError}</p>}
      <label>Mot de passe <span onClick={props.goToForgotPwd}>(oublié ?)</span></label><br/>
      <input name="password"
             type="password"
             placeholder="Votre mot de passe"
             onChange={onInputChange}
             value={formData.password}/><br/>
      {formData.passwordError !== '' && <p><i className="fas fa-times"/> {formData.passwordError}</p>}
      <input type="submit" value="Se connecter"/>
    </form>
  );
};

export default Login;
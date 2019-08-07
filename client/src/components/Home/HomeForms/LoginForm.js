import React, {useState} from 'react';

import validation from '../../../utils/validation';

const LoginForm = () => {
  let [formData, setFormData] = useState({
    login: '',
    password: ''
  });

  const onInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const onFormSubmit = (e) => {
    if (!validation.login(formData)) {
      console.log('non non non');
    }
    e.preventDefault();
  };

  return (
    <form onSubmit={onFormSubmit}>
      <h4>Vous pouvez vous connecter avec vos identifiants :</h4>
      <label>Email ou nom d'utilisateur</label><br/>
      <input name="login" type="text" placeholder="Votre email ou nom d'utilisateur" onChange={onInputChange} value={formData.login}/><br/>
      <p> Erreur</p>
      <label>Mot de passe (oublié ?)</label><br/>
      <input name="password" type="password" placeholder="Votre mot de passe" onChange={onInputChange} value={formData.password}/><br/>
      <p></p>
      <input type="submit"/>
    </form>
  );
};

export default LoginForm;
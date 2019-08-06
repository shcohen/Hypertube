import React, {useState} from 'react';

const SigninForm = () => {
  let [formData, setFormData] = useState({
    login: '',
    password: ''
  });

  const onInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  return (
    <form>
      <label>Email ou nom d'utilisateur</label><br/>
      <input name="login" type="text" placeholder="example@hyper.com" onChange={onInputChange} value={formData.login}/><br/>
      <p></p>
      <label>Mot de passe</label><br/>
      <input name="password" type="password" placeholder="Votre mot de passe" onChange={onInputChange} value={formData.password}/><br/>
      <p></p>
      <input type="submit"/>
    </form>
  );
};

export default SigninForm;
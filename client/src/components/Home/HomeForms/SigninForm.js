import React, {useState} from 'react';

import PasswordValidator from '../../Utilities/PasswordValidator';

const SigninForm = () => {
  let [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirm: '',
    firstname: '',
    lastname: '',
    emailError: 'Email invalide.',
    usernameError: '',
    passwordError: '',
    confirmError: '',
    firstnameError: '',
    lastnameError: '',
  });

  const onInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  return (
    <form>
      <h4>Bienvenue ! Renseignez quelques informations pour vous inscrire :</h4>
      <label>Adresse email</label><br/>
      <input name="email" type="email" placeholder="ex : example@hyper.com" onChange={onInputChange} value={formData.email}/><br/>
      {formData.emailError !== '' && <p><i className="fas fa-times"/> {formData.emailError}</p>}
      <label>Nom d'utilisateur</label><br/>
      <input name="username" type="text" placeholder="ex : YannisCohen007" onChange={onInputChange} value={formData.username}/><br/>
      {formData.usernameError !== '' && <p><i className="fas fa-times"/> {formData.usernameError}</p>}
      <label>Prénom et nom</label><br/>
      <input className="half" name="firstname" type="text" placeholder="ex : Florent" onChange={onInputChange} value={formData.firstname}/>
      <input className="half last" name="lastname" type="text" placeholder="ex : Klein" onChange={onInputChange} value={formData.lastname}/><br/>
      {(formData.firstnameError !== '' || formData.lastnameError !== '') && <p><i className="fas fa-times"/> {formData.firstnameError}{formData.lastnameError}</p>}
      <label>Mot de passe</label><br/>
      <div className="pwd-validator">
        <input name="password" type="password" placeholder="Choisissez un mot de passe fort" onChange={onInputChange} value={formData.password}/><br/>
        <PasswordValidator password={formData.password}/>
      </div>
      {formData.passwordError !== '' && <p><i className="fas fa-times"/> {formData.passwordError}</p>}
      <label>Confirmation du mot de passe</label><br/>
      <input name="password" type="password" placeholder="Réécrivez le mot de passe choisi" onChange={onInputChange} value={formData.confirm}/><br/>
      {formData.confirmError !== '' && <p><i className="fas fa-times"/> {formData.confirmError}</p>}
      <input type="submit"/>
    </form>
  );
};

export default SigninForm;
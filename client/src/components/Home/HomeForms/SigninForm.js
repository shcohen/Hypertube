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

  const onFormSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={onFormSubmit}>
      <h4>Bienvenue ! Renseignez quelques informations pour vous inscrire :</h4>
      <label>Adresse email</label><br/>
      <input name="email"
             type="email"
             placeholder="ex : example@hyper.com"
             minLength="1"
             maxLength="64"
             required
             onChange={onInputChange}
             value={formData.email}/><br/>
      {formData.emailError !== '' && <p><i className="fas fa-times"/> {formData.emailError}</p>}
      <label>Nom d'utilisateur</label><br/>
      <input name="username"
             type="text"
             placeholder="ex : YannisCohen007"
             minLength="1"
             maxLength="32"
             pattern="^[a-zA-Z0-9]{1,32}$"
             required
             onChange={onInputChange}
             value={formData.username}/><br/>
      {formData.usernameError !== '' && <p><i className="fas fa-times"/> {formData.usernameError}</p>}
      <label>Prénom et nom</label><br/>
      <input className="half"
             name="firstname"
             type="text"
             placeholder="ex : Florent"
             minLength="1"
             maxLength="32"
             pattern="^([a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+)*)+([-]([a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+)*)+)*$"
             required
             onChange={onInputChange}
             value={formData.firstname}/>
      <input className="half last"
             name="lastname"
             type="text"
             placeholder="ex : Klein"
             minLength="1"
             maxLength="32"
             pattern="^([a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+)*)+([-]([a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+)*)+)*$"
             required
             onChange={onInputChange}
             value={formData.lastname}/><br/>
      {(formData.firstnameError !== '' || formData.lastnameError !== '') &&
      <p><i className="fas fa-times"/> {formData.firstnameError}{formData.lastnameError}</p>}
      <label>Mot de passe</label><br/>
      <div className="pwd-validator">
        <input name="password"
               type="password"
               placeholder="Choisissez un mot de passe fort"
               minLength="1"
               maxLength="64"
               pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,64}$"
               required
               onChange={onInputChange}
               value={formData.password}/><br/>
        <PasswordValidator password={formData.password}/>
      </div>
      {formData.passwordError !== '' && <p><i className="fas fa-times"/> {formData.passwordError}</p>}
      <label>Confirmation du mot de passe</label><br/>
      <input name="password"
             type="password"
             placeholder="Réécrivez le mot de passe choisi"
             minLength="1"
             maxLength="64"
             pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,64}$"
             required
             onChange={onInputChange}
             value={formData.confirm}/><br/>
      {formData.confirmError !== '' && <p><i className="fas fa-times"/> {formData.confirmError}</p>}
      <input type="submit"/>
    </form>
  );
};

export default SigninForm;
import React, {useState} from 'react';

import PasswordValidator from '../../Utilities/PasswordValidator/PasswordValidator';

const Register = (props) => {
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

  const t = props.text || {};

  return (
    <form onSubmit={onFormSubmit}>
      <h4>{t._REGISTER_SUBTITLE}</h4>
      <label>{t._EMAIL_ADDRESS}</label><br/>
      <input className="validation"
             name="email"
             type="email"
             placeholder="ex : example@hyper.com"
             minLength="1"
             maxLength="64"
             required
             onChange={onInputChange}
             value={formData.email}/><br/>
      {formData.emailError !== '' && <p><i className="fas fa-times"/> {formData.emailError}</p>}
      <label>{t._USERNAME}</label><br/>
      <input className="validation"
             name="username"
             type="text"
             placeholder="ex : YannisCohen007"
             minLength="1"
             maxLength="32"
             pattern="^[a-zA-Z0-9]{1,32}$"
             required
             onChange={onInputChange}
             value={formData.username}/><br/>
      {formData.usernameError !== '' && <p><i className="fas fa-times"/> {formData.usernameError}</p>}
      <label>{t._FIRSTNAME_LASTNAME}</label><br/>
      <input className="validation half"
             name="firstname"
             type="text"
             placeholder="ex : Florent"
             minLength="1"
             maxLength="32"
             pattern="^([a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+)*)+([-]([a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+)*)+)*$"
             required
             onChange={onInputChange}
             value={formData.firstname}/>
      <input className="validation half last"
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
      <label>{t._PASSWORD}</label><br/>
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
      <input type="submit" value={' ' + t._REGISTER_BUTTON + ' '}/>
    </form>
  );
};

export default Register;
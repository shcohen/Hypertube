import React, {useState} from 'react';

import PasswordValidator from "../../Utilities/PasswordValidator";

const ChangePassword = () => {
  let [formData, setFormData] = useState({
    password: '',
    confirm: '',
    passwordError: '',
    confirmError: ''
  });

  const onInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={onFormSubmit}>
      <h4>Vous pouvez changer votre mot de passe :</h4>
      <label>Nouveau mot de passe</label><br/>
      <div className="pwd-validator">
        <input className="validation"
               name="password"
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
      <input className="validation"
             name="confirm"
             type="password"
             placeholder="Réécrivez le mot de passe choisi"
             minLength="1"
             maxLength="64"
             pattern={'^' + formData.password + '$'}
        // pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,64}$"
             required
             onChange={onInputChange}
             value={formData.confirm}/><br/>
      {formData.confirmError !== '' && <p><i className="fas fa-times"/> {formData.confirmError}</p>}
      <input type="submit" value="Modifier"/>
    </form>
  );
};

export default ChangePassword;
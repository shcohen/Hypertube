import React, {useState} from 'react';

const ForgotPassword = () => {
  let [formData, setFormData] = useState({
    email: '',
    emailError: '',
  });

  const onInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={onFormSubmit}>
      <h4>Recevez un lien de réinitialisation de votre mot de passe par mail :</h4>
      <label>Adresse email</label><br/>
      <input name="email"
             type="email"
             placeholder="L'adresse email liée à votre compte"
             onChange={onInputChange}
             value={formData.email}/><br/>
      {formData.loginError !== '' && <p><i className="fas fa-times"/> {formData.loginError}</p>}
      <input type="submit" value="Envoyer"/>
    </form>
  );
};

export default ForgotPassword;
import React, {useState} from 'react';
import axios from 'axios';
import classnames from 'classnames';

import PasswordValidator from '../Utilities/PasswordValidator/PasswordValidator';

import '../Home/home.css';
import '../Home/Forms/home-forms.css';

const InfosForm = (props) => {
  let [formData, setFormData] = useState({
    email: props.user.email,
    username: props.user.username,
    password: '',
    confirm: '',
    firstname: props.user.firstname,
    lastname: props.user.lastname,
    oldProfilePic: props.user.profilePic,
    profilePic: '',
    emailError: '',
    usernameError: '',
    passwordError: '',
    confirmError: '',
    firstnameError: '',
    lastnameError: '',
    profilePicError: ''
  });

  const onInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    let form = new FormData();
    form.append('email', formData.email);
    form.append('username', formData.username);
    form.append('password', formData.password);
    form.append('confirm', formData.confirm);
    form.append('firstname', formData.firstname);
    form.append('lastname', formData.lastname);
    form.append('profilePic', formData.profilePic);
    axios.put('/api/account/modify', form)
      .then((res) => {
        console.log(res.data);
        setFormData({...formData, ...res.data});
      })
      .catch((err) => {
        setFormData({...formData, ...err.response.data});
      });
  };

  const previewProfilePic = (e) => {
    const input = e.target;
    if (input.files && input.files[0]) {
      let reader = new FileReader();
      reader.onload = (evt) => {
        const preview = document.getElementById('profile_pic_preview');
        preview.src = evt.target.result;
        console.log(input.files[0]);
        setFormData({
          ...formData,
          profilePic: input.files[0]
        });
      };
      reader.readAsDataURL(input.files[0]);
    }
  };

  const t = props.text || {};

  return (
    <form onSubmit={onFormSubmit}>
      <label>{t._EMAIL_ADDRESS}</label><br/>
      <input className="validation"
             name="email"
             type="email"
             placeholder="ex : example@hyper.com"
             minLength="1"
             maxLength="64"
             onChange={onInputChange}
             value={formData.email}/><br/>
      {formData.emailError !== '' && <p><i className="fas fa-times"/> {formData.emailError}</p>}
      <div className="hf__grid">
        <div className="hf__picture">
          <input id="profile_pic"
                 type="file"
                 name="profile_pic"
                 hidden
                 onChange={previewProfilePic}/>
          <label htmlFor="profile_pic">
            {formData.profilePic === '' && <img src={formData.oldProfilePic} alt="profile pic"/>}
            <img id="profile_pic_preview" src='' alt="profile pic"/>
          </label>
        </div>
        <div>
          <label>{t._USERNAME}</label><br/>
          <input className="validation"
                 name="username"
                 type="text"
                 placeholder="ex : YannisCohen007"
                 minLength="1"
                 maxLength="32"
                 pattern="^[a-zA-Z0-9]{1,32}$"
                 onChange={onInputChange}
                 value={formData.username}/><br/>
          {formData.usernameError !== '' && <p><i className="fas fa-times"/> {formData.usernameError}</p>}
        </div>
      </div>
      {formData.profilePicError !== '' && <p><i className="fas fa-times"/> {formData.profilePicError}</p>}
      <label>{t._FIRSTNAME_LASTNAME}</label><br/>
      <input className="validation half"
             name="firstname"
             type="text"
             placeholder="ex : Florent"
             minLength="1"
             maxLength="32"
             pattern="^([a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+)*)+([-]([a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+)*)+)*$"
             onChange={onInputChange}
             value={formData.firstname}/>
      <input className="validation half last"
             name="lastname"
             type="text"
             placeholder="ex : Klein"
             minLength="1"
             maxLength="32"
             pattern="^([a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+)*)+([-]([a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[a-zA-Zàáâäçèéêëìíîïñòóôöùúûü]+)*)+)*$"
             onChange={onInputChange}
             value={formData.lastname}/><br/>
      {formData.firstnameError !== ''  && <p><i className="fas fa-times"/> {formData.firstnameError}</p>}
      {formData.lastnameError !== '' && <p><i className="fas fa-times"/> {formData.lastnameError}</p>}
      <label>{t._PASSWORD}</label><br/>
      <div className="pwd-validator">
        <input className={classnames('', {
          'validation': !!formData.password.length
        })}
               name="password"
               type="password"
               placeholder={t._PASSWORD_PLACEHOLDER}
               minLength="1"
               maxLength="64"
               pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,64}$"
               onChange={onInputChange}
               value={formData.password}/><br/>
        <PasswordValidator password={formData.password}/>
      </div>
      {formData.passwordError !== '' && <p><i className="fas fa-times"/> {formData.passwordError}</p>}
      <label>{t._CONFIRMATION}</label><br/>
      <input className={classnames('', {
        'validation': !!formData.password.length
      })}
             name="confirm"
             type="password"
             placeholder={t._CONFIRMATION_PLACEHOLDER}
             minLength="1"
             maxLength="64"
             required={!!formData.password.length}
             pattern={'^' + formData.password + '$'}
             onChange={onInputChange}
             value={formData.confirm}/><br/>
      {formData.confirmError !== '' && <p><i className="fas fa-times"/> {formData.confirmError}</p>}
      <input type="submit" value={' ' + t._UPDATE_INFOS + ' '}/>
    </form>
  );
};

export default InfosForm;
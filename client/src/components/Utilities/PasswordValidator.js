import React from 'react';
import classnames from 'classnames';

import './password-validator.css';

const PasswordValidator = (args) => {
  const pwd = args.password;
  const length = pwd.length >= 8;
  const min = pwd.match(/[a-z]/g);
  const maj = pwd.match(/[A-Z]/g);
  const num = pwd.match(/[0-9]/g);

  return (
    <div className="pwd-val__window">
      <div className={classnames('pwd-val__line', {
        'valid': length
      })}>
        <i className="fas fa-check"></i> Au moins 8 caractères
      </div>
      <div className={classnames('pwd-val__line', {
        'valid': min
      })}>
        <i className="fas fa-check"></i> Au moins 1 lettre minuscule
      </div>
      <div className={classnames('pwd-val__line', {
        'valid': maj
      })}>
        <i className="fas fa-check"></i> Au moins 1 lettre majuscule
      </div>
      <div className={classnames('pwd-val__line', {
        'valid': num
      })}>
        <i className="fas fa-check"></i> Au moins 1 chiffre
      </div>
    </div>
  );
};

export default PasswordValidator;
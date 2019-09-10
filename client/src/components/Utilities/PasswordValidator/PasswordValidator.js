import React from 'react';
import {connect} from 'react-redux';
import classnames from 'classnames';

import './password-validator.css';

const PasswordValidator = (props) => {
  const pwd = props.password;
  const length = pwd.length >= 8;
  const min = pwd.match(/[a-z]/g);
  const maj = pwd.match(/[A-Z]/g);
  const num = pwd.match(/[0-9]/g);

  const t = props.text || {};

  return (
    <div className="pwd-val__window">
      <div className={classnames('pwd-val__line', {
        'valid': length
      })}>
        <i className="fas fa-check"/> {t._8_CHARS}
      </div>
      <div className={classnames('pwd-val__line', {
        'valid': min
      })}>
        <i className="fas fa-check"/> {t._LOWERCASE}
      </div>
      <div className={classnames('pwd-val__line', {
        'valid': maj
      })}>
        <i className="fas fa-check"/> {t._UPPERCASE}
      </div>
      <div className={classnames('pwd-val__line', {
        'valid': num
      })}>
        <i className="fas fa-check"/> {t._NUMBER}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  text: state.translate._PASSWORD_VALIDATOR
});

export default connect(mapStateToProps)(PasswordValidator);
import React, {Component} from 'react';
import classnames from 'classnames';
import queryString from 'query-string';
import {connect} from 'react-redux';
import axios from 'axios';

import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import ChangePassword from './ResetPassword';

import './home-forms.css';

class Forms extends Component {
  state = {
    step: 0
  };

  componentWillMount() {
    const params = queryString.parse(this.props.location.search);
    if (params.action === 'forgot-password') {
      this.setState({
        step: 3,
        params: params
      });
    }
    if (params.action === 'validate') {
      axios.patch('/api/account/validate', params)
        .then(() => {
          this.setState({
            step: 'validateSuccess'
          });
        })
        .catch(() => {
          this.setState({
            step: 'validateError'
          });
        });
    }
  }

  goToStep = (s) => {
    this.setState({
      step: s
    });
  };

  render() {
    const {step} = this.state;
    const t = this.props.text || {};
    const params = queryString.parse(this.props.location.search);

    return (
      <div className="right-side">
        <div className="hf__tabs">
          <button className={classnames('hf__tab left', {
            'active': step === 0
          })} onClick={() => this.goToStep(0)}>
            {t._REGISTER_TITLE}
          </button>
          <button className={classnames('hf__tab right', {
            'active': step === 1
          })} onClick={() => this.goToStep(1)}>
            {t._LOGIN_TITLE}
          </button>
        </div>
        <hr/>
        <div className="hf__content">
          {step === 0 && <Register text={t}/>}
          {step === 1 && <Login goToForgotPwd={() => this.goToStep(2)} text={t}/>}
          {step === 2 && <ForgotPassword text={t}/>}
          {step === 3 && <ChangePassword text={t} token={params.token}/>}
          {step === 'validateSuccess' && <h4 style={{color: 'var(--color-headings)', fontSize: '0.9rem'}}>
            {t._VALIDATE_SUCCESS}
          </h4>}
          {step === 'validateError' && <h4 style={{color: 'red', fontSize: '0.9rem'}}>
            {t._VALIDATE_ERROR}
          </h4>}
          {step === 'forgotSuccess' && <h4 style={{color: 'var(--color-headings)', fontSize: '0.9rem'}}>
            {t._FORGOT_SUCCESS}
          </h4>}
        </div>
        <hr className="or"/>
        <div className="hf__content">
          <h4>{t._SOCIALS_SUBTITLE}</h4>
          <div className="hf__socials">
            <a href="http://localhost:5000/api/account/google" className="custom google"> </a>
            <a href="http://localhost:5000/api/account/42" className="custom api42"> </a>
            <a href="http://localhost:5000/api/account/github" className="custom github"> </a>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  text: state.translate._FORMS
});

export default connect(mapStateToProps)(Forms);
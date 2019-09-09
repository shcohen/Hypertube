import React, {Component} from 'react';
import classnames from 'classnames';
import queryString from 'query-string';
import {connect} from 'react-redux';
import axios from 'axios';

import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import ChangePassword from './ChangePassword';

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
  }

  goToStep = (s) => {
    this.setState({
      step: s
    });
  };

  loginGithub = () => {
    axios.get('/api/account/github')
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
  };

  loginGoogle = () => {
    axios.get('/api/account/google')
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
  };

  login42 = () => {
    axios.get('/api/account/42')
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
  };

  render() {
    const {step} = this.state;
    const t = this.props.text || {};

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
          {step === 3 && <ChangePassword text={t}/>}
        </div>
        <hr className="or"/>
        <div className="hf__content">
          <h4>{t._SOCIALS_SUBTITLE}</h4>
          <div className="hf__socials">
            <a href="http://localhost:5000/api/account/google" className="custom google"/>
            <a href="http://localhost:5000/api/account/42" className="custom api42"/>
            <a href="http://localhost:5000/api/account/github" className="custom github"/>
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
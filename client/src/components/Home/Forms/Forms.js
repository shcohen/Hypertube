import React, {Component} from 'react';
import classnames from 'classnames';

import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';

import './home-forms.css';

class Forms extends Component {
  state = {
    step: 0
  };

  goToStep = (s) => {
    this.setState({
      step: s
    });
  };

  render() {
    const {step} = this.state;

    return (
      <div className="right-side">
        <div className="hf__tabs">
          <button className={classnames('hf__tab left', {
            'active': step === 0
          })} onClick={() => this.goToStep(0)}>
            Inscription
          </button>
          <button className={classnames('hf__tab right', {
            'active': step === 1
          })} onClick={() => this.goToStep(1)}>
            Connexion
          </button>
        </div>
        <hr/>
        <div className="hf__content">
          {step === 0 && <Register/>}
          {step === 1 && <Login goToForgotPwd={() => this.goToStep(2)}/>}
          {step === 2 && <ForgotPassword/>}
        </div>
        <hr className="or"/>
        <div className="hf__content">
          <h4>Vous pouvez vous connecter avec vos réseaux sociaux :</h4>
          <div className="hf__socials">
            <button className="custom twitter"/>
            <button className="custom google"/>
            <button className="custom api42"/>
            <button className="custom github"/>
          </div>
        </div>
      </div>
    );
  }
}

export default Forms;
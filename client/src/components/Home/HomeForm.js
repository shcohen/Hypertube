import React, {Component} from 'react';
import classnames from 'classnames';

import LoginForm from './HomeForms/LoginForm';
import SigninForm from './HomeForms/SigninForm';

import './home-form.css';

class HomeForm extends Component {
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
        <div className="hf__content">
          {step === 0 && <SigninForm/>}
          {step === 1 && <LoginForm/>}
        </div>
      </div>
    );
  }
}

export default HomeForm;
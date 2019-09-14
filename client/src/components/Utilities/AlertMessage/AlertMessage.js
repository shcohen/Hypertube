import React, {Component} from 'react';
import classnames from "classnames";

import alertImg from "../../../assets/img/input-valid.svg";
import './alert-message.css';

class AlertMessage extends Component {
  state = {
    shown: false
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        shown: true
      });
      setTimeout(() => {
        this.setState({
          shown: false
        });
        setTimeout(() => {
          if (this.props.cb) {
            this.props.cb();
          }
        }, 500);
      }, 5000);
    }, 100);
  }

  render() {
    return (
      <div className={classnames('alert-message', {
        'in': this.state.shown
      })}>
        <img src={alertImg} alt="loading"/>
        <span>{this.props.message}</span>
      </div>
    );
  }
}

export default AlertMessage;
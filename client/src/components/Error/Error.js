import React, {Component} from 'react';
import {connect} from 'react-redux';

import './error.css';
import noSignal from '../../assets/img/no-signal.jpg';

class Error extends Component {
  render() {
    const t = this.props.text || {};

    return (
      <div className="error-page">
        <div className="error__image">
          <img src={noSignal} alt="error"/>
        </div>
        {t._ERROR_TEXT}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  text: state.translate._ERROR
});

export default connect(mapStateToProps)(Error);
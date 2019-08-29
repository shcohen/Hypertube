import React, {Component} from 'react';
import {connect} from 'react-redux';
import classnames from 'classnames';

import {getTranslation} from '../../store/actions/translate';

import './translation.css';
import loadingImg from '../../assets/img/translation-loading.svg';

class Translation extends Component {
  componentDidMount() {
    this.props.getTranslation();
  }

  render() {
    return (
      <div className={classnames('translation', {
        'in': this.props.loading
      })}>
        <img src={loadingImg} alt="loading"/>
        <span>Hyper is translating...</span>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.translate.loading
});

export default connect(mapStateToProps, {getTranslation})(Translation);
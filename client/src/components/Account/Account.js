import React, {Component} from 'react';
import {connect} from 'react-redux';

import InfosForm from './InfosForm';

import './account.css';

class Account extends Component {
  state = {

  };

  render() {
    const u = this.props.user || {};
    const t = this.props.text || {};

    return (
      <div className="account centered">
        <div className="account__grid">
          <div className="account__infos">
            <div className="account__title">{t._A_INFOS_TITLE}</div>
            <div className="hf__content">
             <InfosForm text={t} user={u}/>
            </div>
          </div>
          <div className="account__movies">
            <div className="account__title">{t._A_MOVIES_TITLE}</div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  text: {...state.translate._ACCOUNT, ...state.translate._FORMS}
});

export default connect(mapStateToProps)(Account);
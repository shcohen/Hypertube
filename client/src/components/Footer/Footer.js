import React, {Component} from 'react';
import {connect} from 'react-redux';

import './footer.css';

class Footer extends Component {
  render() {
    const {isAuthenticated, user} = this.props.user;
    const t = this.props.text || {};

    return (
      <div id="footer">
        <div>{t._WELCOME}{isAuthenticated && ` ${user.firstname} ${user.lastname}`}.</div>
        <div><a className="logo" href="#HYPER">HYPER</a></div>
        <div>{t._BY} Shana, Yannis, Florent.</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  text: state.translate._FOOTER
});

export default connect(mapStateToProps)(Footer);
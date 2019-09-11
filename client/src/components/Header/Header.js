import React, {Component} from 'react';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';
import classnames from 'classnames';

import RightButtons from './RightButtons';

import './header.css';

class Header extends Component {
  state = {
    hidden: false,
    old: 0
  };

  componentDidMount() {
    window.onscroll = () => {
      if (window.scrollY > 150 && window.scrollY > this.state.old) {
        if (window.innerWidth < 800) {
          this.setState({hidden: true});
        }
      } else {
        this.setState({hidden: false});
      }
      this.setState({old: window.scrollY});
    }
  }

  getLinks = (t) => {
    if (this.props.user.isAuthenticated) {
      return (<React.Fragment>
        <NavLink to="/movies">
          {t._ALL_MOVIES}
        </NavLink>
        <NavLink to="/account">
          {t._MY_ACCOUNT}
        </NavLink>
      </React.Fragment>)
    } else {
      return (<React.Fragment>
        {/*<NavLink to="/" exact>*/}
        {/*  {t._HOME}*/}
        {/*</NavLink>*/}
      </React.Fragment>)
    }
  };

  render() {
    const {hidden} = this.state;
    const t = this.props.text || {};

    return (
      <header className={classnames('centered', {
        'hidden': hidden
      })}>
        <div>
          <div className="logo">
            <NavLink className="logo" to="/">H<span className="broken">y</span>pe<span
              className="broken2">r</span></NavLink>
          </div>
          <div className="left">
            {this.getLinks(t)}
          </div>
          <div className="right">
            <RightButtons text={t}/>
          </div>
        </div>
      </header>
    );
  }
}

const mapStateToProps = (state) => ({
  text: state.translate._HEADER,
  user: state.user
});

export default connect(mapStateToProps)(Header);
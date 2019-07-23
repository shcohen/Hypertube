import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import classnames from 'classnames';

import RightButtons from './RightButtons';

import './header.css';

class Header extends Component {
  state = {
    hidden: false,
    old: 0,
    loggedIn: true
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

  getLinks = () => {
    if (this.state.loggedIn) {
      return (<React.Fragment>
        <NavLink to="/" exact>
          Accueil
        </NavLink>
        <NavLink to="/library">
          Bibliothèque
        </NavLink>
        <NavLink to="/trending">
          Tendances
        </NavLink>
      </React.Fragment>)
    } else {
      return (<React.Fragment>

      </React.Fragment>)
    }
  };

  render() {
    const {hidden} = this.state;
    const links = this.getLinks();

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
            {links}
          </div>
          <div className="right">
            <RightButtons/>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
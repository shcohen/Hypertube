import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import classnames from 'classnames';

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

  toggleMode = (e) => {
    document.documentElement.classList.add('transition');
    if (e.target.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    setTimeout(() => {
      document.documentElement.classList.remove('transition');
    }, 500);
  };

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

  getButtons = () => {
    if (this.state.loggedIn) {
      return (<React.Fragment>
        <div className="settings">
          <button/>
          <div className="dropdown">
            <div className="dropdown__title">
              <i className="fas fa-palette"></i> Thème
            </div>
            <div className="dropdown__section">

            </div>
            <div className="dropdown__section">

            </div>
          </div>
        </div>
        <div className="account">
          <button/>
          <div className="dropdown">

          </div>
        </div>
        <div className="logout">
          <button/>
        </div>
      </React.Fragment>)
    } else {
      return (<React.Fragment>
        <div>
          <button className="account"/>
        </div>
      </React.Fragment>)
    }
  };

  render() {
    const {hidden} = this.state;
    const links = this.getLinks();
    const buttons = this.getButtons();

    return (
      <header className={classnames('centered', {
        'hidden': hidden
      })}>
        <div>
          <div className="logo">
            <input className="custom" type="checkbox" name="theme" onChange={this.toggleMode}/>
            <NavLink className="logo" to="/">H<span className="broken">y</span>pe<span
              className="broken2">r</span></NavLink>
          </div>
          <div className="left">
            {links}
          </div>
          <div className="right">
            {buttons}
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
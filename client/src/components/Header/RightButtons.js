import React, {Component} from 'react';
import classnames from 'classnames';
import {connect} from 'react-redux';

import {logoutUser} from '../../store/actions/auth';
import cookies from '../../utils/cookies';
import LanguagePicker from './LanguagePicker';

class RightButtons extends Component {
  state = {
    opened1: false,
    opened2: false,
  };

  componentDidMount() {
    if (cookies.get('color')) {
      document.documentElement.style.setProperty('--color-headings', cookies.get('color'));
    }
    if (cookies.get('transparent')) {
      document.documentElement.style.setProperty('--color-headings-transparent', cookies.get('transparent'));
    }
    if (cookies.get('theme')) {
      document.documentElement.setAttribute('data-theme', cookies.get('theme'));
      this.setState({
        theme: cookies.get('theme')
      });
    }
  }

  openDropdown = (n) => {
    if (n === 0) {
      this.setState({
        opened1: false,
        opened2: false
      });
    } else {
      this.setState({
        ['opened' + n]: !this.state['opened' + n]
      });
    }
  };

  toggleMode = (e) => {
    document.documentElement.classList.add('transition');
    if (e.target.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
      cookies.set('theme', 'dark');
      this.setState({
        theme: 'dark'
      });
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      cookies.set('theme', 'light');
      this.setState({
        theme: 'light'
      });
    }
    setTimeout(() => {
      document.documentElement.classList.remove('transition');
    }, 500);
  };

  toggleNeon = (e) => {
    document.documentElement.classList.add('transition');
    document.querySelector('a.logo').classList.toggle('neon');
    setTimeout(() => {
      document.documentElement.classList.remove('transition');
    }, 500);
  };

  changeColor = (e) => {
    // const color = getComputedStyle(document.documentElement).getPropertyValue('--color-headings');
    document.documentElement.style.setProperty('--color-headings', e.target.value);
    document.documentElement.style.setProperty('--color-headings-transparent', e.target.value + '80');
    cookies.set('color', e.target.value);
    cookies.set('transparent', e.target.value + '80');
  };

  render() {
    const {opened1, opened2, theme} = this.state;
    const {isAuthenticated} = this.props.user;
    const t = this.props.text || {};

      return (<React.Fragment>
        <div className={classnames('dropdown__overlay', {
          'shown': opened1 || opened2
        })} onClick={() => this.openDropdown(0)}/>
        <div className={classnames('settings', {
          'opened': opened1
        })}>
          <button onClick={() => this.openDropdown(1)}/>
          <div className="dropdown">
            <div className="dropdown__title">
              <i className="fas fa-palette"/> {t._THEME}
            </div>
            <div className="dropdown__section dark-mode">
              {t._DARK_MODE}
              <input className="custom" type="checkbox" name="theme" onChange={this.toggleMode}
                     checked={theme === 'dark'}/>
            </div>
            <div className="dropdown__section dark-mode">
              {t._NEON_EFFECT}
              <input className="custom" type="checkbox" name="neon" onChange={this.toggleNeon}/>
            </div>
            <div className="dropdown__section">
              {t._SECONDARY_COLOR}
              <form className="color-picker">
                <input type="radio" name="color" className="red" value="#ff2200" onChange={this.changeColor}/>
                <input type="radio" name="color" className="orange" value="#ff7540" onChange={this.changeColor}/>
                <input type="radio" name="color" className="yellow" value="#ffd500" onChange={this.changeColor}/>
                <input type="radio" name="color" className="green" value="#73d15c" onChange={this.changeColor}/>
                <input type="radio" name="color" className="blue" value="#0077ff" onChange={this.changeColor}/>
                <input type="radio" name="color" className="indigo" value="#3F51B5" onChange={this.changeColor}/>
                <input type="radio" name="color" className="purple" value="#c800ff" onChange={this.changeColor}/>
                <input type="radio" name="color" className="pink" value="#ff66d4" onChange={this.changeColor}/>
              </form>
            </div>
          </div>
        </div>
        <div className={classnames('language', {
          'opened': opened2
        })}>
          <button onClick={() => this.openDropdown(2)}/>
          <div className="dropdown">
            <div className="dropdown__title">
              <i className="fas fa-globe-europe"/> Language
            </div>
            <LanguagePicker/>
          </div>
        </div>
        {isAuthenticated && <div className="logout">
          <button onClick={this.props.logoutUser}/>
        </div>}
      </React.Fragment>);
    }
}

const mapStateToProps = (state) => ({
  user: state.user
});

export default connect(mapStateToProps, {logoutUser})(RightButtons);
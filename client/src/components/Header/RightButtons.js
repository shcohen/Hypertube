import React, {Component} from 'react';
import classnames from 'classnames';

class RightButtons extends Component {
  state = {
    loggedIn: true,
    opened1: false,
    opened2: false,
  };

  componentDidMount() {
    const tab = document.cookie.split(';');
    let obj = {};
    let tab2 = [];
    tab.forEach(elem => {
      tab2 = elem.split('=');
      obj = {...obj, [tab2[0].trim()]:tab2[1].trim()}
    });
    document.documentElement.style.setProperty('--color-headings', obj.color);
    document.documentElement.style.setProperty('--color-headings-transparent', obj.transparent);
    document.documentElement.setAttribute('data-theme', obj.theme);
    this.setState({
      theme: obj.theme
    });
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
    const d = new Date();
    d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    if (e.target.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.cookie = "theme=dark;" + expires + ";path=/";
      this.setState({
        theme: 'dark'
      });
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.cookie = "theme=light;" + expires + ";path=/";
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
    const d = new Date();
    d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = "color=" + e.target.value + ";" + expires + ";path=/";
    document.cookie = "transparent=" + e.target.value + "80;" + expires + ";path=/";
  };

  render() {
    const {loggedIn, opened1, opened2, theme} = this.state;

    if (loggedIn) {
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
              <i className="fas fa-palette"/> Thème
            </div>
            <div className="dropdown__section dark-mode">
              Mode sombre
              <input className="custom" type="checkbox" name="theme" onChange={this.toggleMode} checked={theme === 'dark'}/>
            </div>
            <div className="dropdown__section dark-mode">
              Effet néon
              <input className="custom" type="checkbox" name="neon" onChange={this.toggleNeon}/>
            </div>
            <div className="dropdown__section">
              Couleur secondaire
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
        <div className={classnames('account', {
          'opened': opened2
        })}>
          <button onClick={() => this.openDropdown(2)}/>
          <div className="dropdown">
            <div className="dropdown__title">
              <i className="fas fa-user-alt"/> Mon compte
            </div>
          </div>
        </div>
        <div className="logout">
          <button/>
        </div>
      </React.Fragment>);
    } else {
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
              <i className="fas fa-palette"/> Thème
            </div>
            <div className="dropdown__section dark-mode">
              Mode sombre
              <input className="custom" type="checkbox" name="theme" onChange={this.toggleMode} checked={theme === 'dark'}/>
            </div>
            <div className="dropdown__section dark-mode">
              Effet néon
              <input className="custom" type="checkbox" name="neon" onChange={this.toggleNeon}/>
            </div>
            <div className="dropdown__section">
              Couleur secondaire
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
      </React.Fragment>);
    }
  }
}

export default RightButtons;
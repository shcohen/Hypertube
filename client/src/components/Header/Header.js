import React, {Component} from 'react';

import './header.css';

class Header extends Component {
  toggleMode = () => {
    document.documentElement.classList.add('transition');
    if (document.querySelector('input[name=theme]').checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    setTimeout(() => {
      document.documentElement.classList.remove('transition');
    }, 500);
  };

  render() {
    return (
      <header>
        <div>

        </div>
        <div className="logo">
          <a className="logo" href="#">H<span className="broken">y</span>pe<span className="broken2">r</span></a>
        </div>
        <div>
          <input className="custom" type="checkbox" name="theme" onChange={this.toggleMode}/>
        </div>
      </header>
    );
  }
}

export default Header;
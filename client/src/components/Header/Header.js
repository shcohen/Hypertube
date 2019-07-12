import React, {Component} from 'react';
import classnames from 'classnames';

import './header.css';

class Header extends Component {
  state = {
    hidden: false,
    old: 0
  };

  componentDidMount() {
    // window.onscroll = () => {
    //   if (window.scrollY > 150 && window.scrollY > this.state.old) {
    //     this.setState({hidden: true});
    //   } else {
    //     this.setState({hidden: false});
    //   }
    //   this.setState({old: window.scrollY});
    // }
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

  render() {
    return (
      <header className={classnames('', {
        'hidden': this.state.hidden
      })}>
        <div>
          HB
        </div>
        <div className="logo">
          <a className="logo" href="/">H<span className="broken">y</span>pe<span className="broken2">r</span></a>
        </div>
        <div>
          <input className="custom" type="checkbox" name="theme" onChange={this.toggleMode}/>
        </div>
      </header>
    );
  }
}

export default Header;
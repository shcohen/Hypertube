import React, {Component} from 'react';
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
        <span>
          Accueil
        </span>
        <span>
          Recherche
        </span>
        <span>
          Mon Hyper
        </span>
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
          <div>
            {links}
          </div>
          <div className="logo">
            <a className="logo" href="/">H<span className="broken">y</span>pe<span className="broken2">r</span></a>
          </div>
          <div>
            <input className="custom" type="checkbox" name="theme" onChange={this.toggleMode}/>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
import React, {Component} from 'react';
import classnames from 'classnames';

import Gallery from './Gallery';

import './home.css';

class Home extends Component {
  state = {
    part: 0
  };

  scroll = () => {
    this.setState({
      part: (this.state.part + 1) % 3
    });
  };

  render() {
    const {part} = this.state;

    return (
      <div className={classnames('triptych', {
        'zero': part === 0,
        'one': part === 1,
        'two': part === 2,
      })}>
        <div className="triptych__scroll">
          <div className="with-toolbox" onClick={this.scroll}>
            <div className="toolbox">{part === 2 ? 'Revenir en haut' : 'En savoir plus'}</div>
          </div>
          <button className={classnames('', {
            'rotated': part === 2
          })}/>
        </div>
        <div className="triptych__part gallery__container">
          <Gallery/>
          <div className="triptych__panel centered">
            <div className="triptych__grid">
              <div className="left-side">
                <div className="ls__title-bar">
                  <a className="logo">HYPER</a>
                </div>
                <p className="ls__content">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores corporis dicta fuga praesentium quisquam quod, rerum saepe vero. Quibusdam, quis.
                </p>
                <p className="ls__content signatures">
                  signature
                </p>
              </div>
              <div className="right-side">
                <div className="rs__title-bar">
                  dsadadsa
                </div>
                <div className="rs__content">
                  dfadsadad
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="triptych__part">
          Two
        </div>
        <div className="triptych__part">
          Three
        </div>
      </div>
    );
  }
}

export default Home;
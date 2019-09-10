import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import classnames from 'classnames';
import {connect} from 'react-redux';

import Gallery from './Gallery/Gallery';
import Forms from './Forms/Forms';

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
    const t = this.props.text || {};

    return (
      <div className={classnames('triptych', {
        'zero': part === 0,
        'one': part === 1,
        'two': part === 2,
      })}>
        <div className="triptych__scroll">
          <div className="with-toolbox" onClick={this.scroll}>
            <div className="toolbox">{part === 2 ? t._BACK_TO_THE_TOP : t._LEARN_MORE}</div>
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
                  <NavLink className="logo" to="/#HYPER">HYPER</NavLink>
                </div>
                <p className="ls__content">
                  {t._INTRO}
                </p>
                <p className="ls__content signatures">
                  Shana Yannis Florent
                </p>
              </div>
              <Forms location={this.props.location}/>
            </div>
          </div>
        </div>
        <div className="triptych__part">

        </div>
        <div className="triptych__part">
          Three
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  text: state.translate._HOME
});

export default connect(mapStateToProps)(Home);
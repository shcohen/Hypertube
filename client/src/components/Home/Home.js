import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import classnames from 'classnames';
import {connect} from 'react-redux';

import Gallery from './Gallery/Gallery';
import Forms from './Forms/Forms';

import './home.css';
import {asyncForEach, sleep} from "../../utils/f";

class Home extends Component {
  state = {
    part: 0,
    auto: '',
    dash: false,
  };

  autoTyper = async () => {
    const tab = [
      'Spider-man',
      'Avengers',
      'Bienvenue chez les Chtis'
    ];
    const typingTime = 200;
    const deleteTime = 100;
    const pauseTime = 1000;

    while (this._isMounted) {
      await asyncForEach(tab, async (str) => {
        for (let i = 0; i <= str.length; i++) {
          if (this._isMounted) {
            this.setState({
              auto: str.substr(0, i),
              dash: true
            });
          }
          await sleep(typingTime);
        }
        await sleep(pauseTime * 2);
        for (let i = str.length; i >= 0; i--) {
          if (this._isMounted) {
            this.setState({
              auto: str.substr(0, i),
              dash: true
            });
          }
          await sleep(deleteTime);
        }
        if (this._isMounted) {
          this.setState({
            dash: false
          });
        }
        await sleep(pauseTime);
      });
    }
  };

  scroll = () => {
    this.setState({
      part: (this.state.part + 1) % 3
    });
  };

  componentDidMount() {
    this._isMounted = true;
    this.autoTyper();
    this.interval = setInterval(() => {
      this.setState({
        dash: true
      });
      this.timeout = setTimeout(() => {
        this.setState({
          dash: false
        });
      }, 750);
    }, 1500);
  }

  componentWillUnmount() {
    this._isMounted = false;
    clearInterval(this.interval);
    clearTimeout(this.timeout);
  }

  render() {
    const {part, auto, dash} = this.state;
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
        <div className="triptych__part two">
          <div className="background"/>
          <div className="window">
            <h1>{auto + (dash ? '|' : ' ')}&nbsp;?</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi harum minus non officiis quidem ratione, reiciendis temporibus ullam vitae? Deserunt.
            </p>
          </div>
        </div>
        <div className="triptych__part three">
          <div className="background"/>
          <div className="window">
            <h1>Lorem Ipsum</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi harum minus non officiis quidem ratione, reiciendis temporibus ullam vitae? Deserunt.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  text: state.translate._HOME
});

export default connect(mapStateToProps)(Home);
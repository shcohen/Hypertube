import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import classnames from 'classnames';
import axios from 'axios';

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
                  <NavLink className="logo" to="/#HYPER">HYPER</NavLink>
                </div>
                <p className="ls__content">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores corporis dicta fuga praesentium quisquam quod, rerum saepe vero. Quibusdam, quis.
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
          <video crossOrigin="anonymous" controls>
            <source
              src="/api/torrent/download_torrent?movieId=&magnet=bWFnbmV0Oj94dD11cm46YnRpaDo1QTMzRkU2MzA1OTUxQTQyMENBMzBBNkE1RkYyRTQ4QzZGQjRDN0YxJmRuPURqYW5nbytVbmNoYWluZWQrJTI4MjAxMiUyOSsxMDgwcCtCclJpcCt4MjY0Ky0rWUlGWSZ0cj11ZHAlM0ElMkYlMkZ0cmFja2VyLnlpZnktdG9ycmVudHMuY29tJTJGYW5ub3VuY2UmdHI9dWRwJTNBJTJGJTJGdHJhY2tlci4xMzM3eC5vcmclM0E4MCUyRmFubm91bmNlJnRyPXVkcCUzQSUyRiUyRmV4b2R1cy5kZXN5bmMuY29tJTNBNjk2OSZ0cj11ZHAlM0ElMkYlMkZ0cmFja2VyLmlzdG9sZS5pdCUzQTgwJnRyPXVkcCUzQSUyRiUyRnRyYWNrZXIuY2NjLmRlJTNBODAlMkZhbm5vdW5jZSZ0cj1odHRwJTNBJTJGJTJGZnIzM2RvbS5oMzN0LmNvbSUzQTMzMTAlMkZhbm5vdW5jZSZ0cj11ZHAlM0ElMkYlMkZ0cmFja2VyLnB1YmxpY2J0LmNvbSUzQTgwJnRyPXVkcCUzQSUyRiUyRmNvcHBlcnN1cmZlci50ayUzQTY5NjklMkZhbm5vdW5jZSZ0cj11ZHAlM0ElMkYlMkZ0cmFja2VyLm9wZW5iaXR0b3JyZW50LmNvbSUzQTgwJTJGYW5ub3VuY2UmdHI9dWRwJTNBJTJGJTJGdHJhY2tlci56ZXIwZGF5LnRvJTNBMTMzNyUyRmFubm91bmNlJnRyPXVkcCUzQSUyRiUyRnRyYWNrZXIubGVlY2hlcnMtcGFyYWRpc2Uub3JnJTNBNjk2OSUyRmFubm91bmNlJnRyPXVkcCUzQSUyRiUyRmNvcHBlcnN1cmZlci50ayUzQTY5NjklMkZhbm5vdW5jZQ"/>
              {/*<track label="French" kind="subtitles" src="./Subtitles/tt1853728/tt1853728.fr.vtt" srcLang="fr"/>*/}
          </video>
        </div>
        <div className="triptych__part">
          Three
        </div>
      </div>
    );
  }
}

export default Home;
import React, {Component} from 'react';

import {sleep, asyncForEach} from '../../utils/f';

class SearchBar extends Component {
  state = {
    auto: '',
    dash: false
  };

  autoTyper = async () => {
    const tab = [
      'Spider-man',
      'Avengers',
      'Bienvenue chez les Chtis'
    ];
    const typingTime = 200;
    const deleteTime = 100;
    const pauseTime = 2000;

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
    const {auto, dash} = this.state;

    return (
      <input name="title"
             className="search-bar"
             type="text"
             placeholder={auto + (dash ? '|' : ' ')}
             minLength="1"
             maxLength="32"/>
    );
  }
}

export default SearchBar;
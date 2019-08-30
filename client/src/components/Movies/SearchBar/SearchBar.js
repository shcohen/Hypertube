import React, {Component} from 'react';

import {sleep, asyncForEach} from '../../../utils/f';

import './search-bar.css';

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
      <form className="custom" onSubmit={(e) => {
        e.preventDefault();
        this.props.submitForm();
      }}>
        <input name="title"
               className="search-bar"
               type="search"
               placeholder={auto + (dash ? '|' : ' ')}
               minLength="1"
               maxLength="32"
               onChange={(e) => this.props.changeTitle(e.target.value)}/>
      </form>
    );
  }
}

export default SearchBar;
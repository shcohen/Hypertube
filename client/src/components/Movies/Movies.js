import React, {Component} from 'react';

import SearchBar from './SearchBar';
import Card from './Cards/Card';

import './movies.css';

class Movies extends Component {
  render() {
    return (
      <div id="movies">
        <div className="sidebar">
          <div className="sidebar__icon"/>
          <div className="sidebar__container">
            <div className="sidebar__scrollable">
              <div className="sidebar__title">
                Filtres et tri
              </div>
              <hr/>
              <form>
                <label>Genre</label><br/>
                <input/><br/>
                <label>Genre</label><br/>
                <input/><br/>
                <label>Genre</label><br/>
                <input/><br/>
                <label>Genre</label><br/>
                <input/><br/>
                <label>Genre</label><br/>
                <input/><br/>
                <label>Genre</label><br/>
                <input/><br/>
                <label>Genre</label><br/>
                <input/><br/>
              </form>
            </div>
          </div>
        </div>
        <div className="movies">
          <SearchBar/>
          <div className="movie__cards">
            <Card/>
            <Card/>
            <Card/>
            <Card/>
            <Card/>
            <Card/>
            <Card/>
            <Card/>
          </div>
        </div>
      </div>
    );
  }
}

export default Movies;
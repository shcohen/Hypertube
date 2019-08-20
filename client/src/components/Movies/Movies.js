import React, {Component} from 'react';
import axios from 'axios';

import SearchBar from './SearchBar/SearchBar';
import Card from './Cards/Card';

import './movies.css';

class Movies extends Component {
  state = {
    movies: [],
    title: ''
  };

  submitForm = () => {
    console.log(this.state.title);
    axios.post('/api/library/find_movie', {name: this.state.title})
      .then((res) => {
        console.log(res.data);
        this.setState({
          movies: res.data
        });
      })
      .catch((err) => {
        console.log(err);
      })
  };

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
          <SearchBar changeTitle={(t) => this.setState({title: t})} submitForm={this.submitForm}/>
          <div className="movie__cards">
            {this.state.movies.map((movie, i) => (
              <Card key={i} movie={movie}/>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Movies;
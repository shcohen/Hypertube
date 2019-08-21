import React, {Component} from 'react';
import axios from 'axios';

import SearchBar from './SearchBar/SearchBar';
import Card from './Cards/Card';
import Loading from './../Utilities/Loading/Loading';

import './movies.css';

class Movies extends Component {
  state = {
    movies: [],
    title: '',
    loadingSearch: false,
    loadingInfinite: false,
    quantity: 45
  };

  submitForm = () => {
    this.setState({
      loadingSearch: true,
      quantity: 45
    });
    axios.post('/api/library/find_movie', {...this.state, name: this.state.title, quantity: 30})
      .then((res) => {
        console.log(res.data);
        this.setState({
          movies: res.data,
          loadingSearch: false
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          loadingSearch: false
        });
      })
  };

  infiniteScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
      this.setState({
        loadingInfinite: true
      });
      axios.post('/api/library/find_movie', {...this.state, name: this.state.title})
        .then((res) => {
          console.log(res.data);
          this.setState({
            movies: res.data,
            quantity: this.state.quantity + 15,
            loadingInfinite: false
          });
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            loadingInfinite: false
          });
        });
    }
  };

  componentDidMount() {
    window.addEventListener('scroll', this.infiniteScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.infiniteScroll);
  }

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
          {this.state.loadingSearch && <div className="movie__loading">
            <Loading/>
          </div>}
          <div className="movie__cards">
            {this.state.movies.map((movie, i) => (
              <Card key={i} movie={movie}/>
            ))}
          </div>
          {this.state.loadingInfinite && <div className="movie__loading">
            <Loading/>
          </div>}
        </div>
      </div>
    );
  }
}

export default Movies;
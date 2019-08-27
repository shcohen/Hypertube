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
    quantity: 20
  };

  submitForm = () => {
    this.setState({
      loadingSearch: true,
      quantity: 20
    });
    axios.post('/api/library/find_movie', {...this.state, search: this.state.title, quantity: 10})
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
      axios.post('/api/library/find_movie', {...this.state, search: this.state.title})
        .then((res) => {
          console.log(res.data);
          this.setState({
            movies: res.data,
            quantity: this.state.quantity + 10,
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
    this.submitForm();
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
                Classement
              </div>
              <hr/>
              <form>
                <div className="sidebar__group">
                  <label htmlFor="sort">Trier les films par</label>
                  <select id="sort" name="sort" defaultValue="name">
                    <option value="" disabled>Trier par...</option>
                    <option value="name">Titre (ordre alphabétique)</option>
                    <option value="genre">Genre</option>
                    <option value="" disabled>En premier...</option>
                    <option value="rating-asc">Les moins bien notés</option>
                    <option value="rating-desc">Les mieux notés</option>
                    <option value="year-asc">Les plus anciens</option>
                    <option value="year-desc">Les plus récents</option>
                  </select><br/>
                </div>
                <br/>
                <div className="sidebar__title">
                  Filtrer par...
                </div>
                <hr/>
                <div className="sidebar__group genres">
                  <label htmlFor="genres">Genre</label>
                  <input hidden type="checkbox" id="genres" name="genres"/>
                  <div className="sidebar__group-genres">
                    <input hidden type="checkbox" id="Action" name="Action"/><label htmlFor="Action">Action</label>
                    <input hidden type="checkbox" id="Adventure" name="Adventure"/><label htmlFor="Adventure">Adventure</label>
                    <input hidden type="checkbox" id="Animation" name="Animation"/><label htmlFor="Animation">Animation</label>
                    <input hidden type="checkbox" id="Biography" name="Biography"/><label htmlFor="Biography">Biography</label>
                    <input hidden type="checkbox" id="Comedy" name="Comedy"/><label htmlFor="Comedy">Comedy</label>
                    <input hidden type="checkbox" id="Crime" name="Crime"/><label htmlFor="Crime">Crime</label>
                    <input hidden type="checkbox" id="Documentary" name="Documentary"/><label htmlFor="Documentary">Documentary</label>
                    <input hidden type="checkbox" id="Drama" name="Drama"/><label htmlFor="Drama">Drama</label>
                    <input hidden type="checkbox" id="Family" name="Family"/><label htmlFor="Family">Family</label>
                    <input hidden type="checkbox" id="Fantasy" name="Fantasy"/><label htmlFor="Fantasy">Fantasy</label>
                    <input hidden type="checkbox" id="FilmNoir" name="Film Noir"/><label htmlFor="FilmNoir">Film Noir</label>
                    <input hidden type="checkbox" id="History" name="History"/><label htmlFor="History">History</label>
                    <input hidden type="checkbox" id="Horror" name="Horror"/><label htmlFor="Horror">Horror</label>
                    <input hidden type="checkbox" id="Music" name="Music"/><label htmlFor="Music">Music</label>
                    <input hidden type="checkbox" id="Musical" name="Musical"/><label htmlFor="Musical">Musical</label>
                    <input hidden type="checkbox" id="Mystery" name="Mystery"/><label htmlFor="Mystery">Mystery</label>
                    <input hidden type="checkbox" id="Romance" name="Romance"/><label htmlFor="Romance">Romance</label>
                    <input hidden type="checkbox" id="Sci-Fi" name="Sci-Fi"/><label htmlFor="Sci-Fi">Sci-Fi</label>
                    <input hidden type="checkbox" id="ShortFilm" name="Short Film"/><label htmlFor="ShortFilm">Short Film</label>
                    <input hidden type="checkbox" id="Sport" name="Sport"/><label htmlFor="Sport">Sport</label>
                    <input hidden type="checkbox" id="Superhero" name="Superhero"/><label htmlFor="Superhero">Superhero</label>
                    <input hidden type="checkbox" id="Thriller" name="Thriller"/><label htmlFor="Thriller">Thriller</label>
                    <input hidden type="checkbox" id="War" name="War"/><label htmlFor="War">War</label>
                    <input hidden type="checkbox" id="Western" name="Western"/><label htmlFor="Western">Western</label>
                  </div>
                </div>
                <div className="sidebar__group">
                  <label>Genre</label>
                  <input/><br/>
                </div>
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
import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import classnames from 'classnames';

import SearchBar from './SearchBar/SearchBar';
import Card from './Cards/Card';
import Loading from './../Utilities/Loading/Loading';
import LoadingCards from './LoadingCards/LoadingCards';

import './movies.css';

class Movies extends Component {
  state = {
    old: 0,
    up: false,
    movies: [],
    title: '',
    loadingSearch: false,
    loadingInfinite: false,
    quantity: 20,
    sort: 'alphabetical',
    genres: [],
    ratingMin: 0.0,
    ratingMax: 10.0,
    yearMin: 0,
    yearMax: 2020
  };

  submitForm = (e) => {
    if (e) {
      e.preventDefault();
    }
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
    if (this.state.title !== '' && window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
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

  topbarGoUp = () => {
    if (window.scrollY > 150 && window.scrollY > this.state.old) {
      if (window.innerWidth < 800) {
        this.setState({up: true});
      }
    } else {
      this.setState({up: false});
    }
    this.setState({old: window.scrollY});
  };

  componentDidMount() {
    window.addEventListener('scroll', this.infiniteScroll);
    window.addEventListener('scroll', this.topbarGoUp);
    this.submitForm();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.infiniteScroll);
    window.removeEventListener('scroll', this.topbarGoUp);
  }

  changeGenre = (e) => {
    const genre = e.target.name;
    const {genres} = this.state;
    if (genres.find((g) => (g === genre))) {
      this.setState({
        genres: genres.filter((g) => (g !== genre))
      });
    } else {
      this.setState({
        genres: [...genres, e.target.name]
      });
    }
  };

  changeSort = (e) => {
    this.setState({
      sort: e.target.value
    });
  };

  render() {
    const t = this.props.text || {};

    return (
      <div id="movies">
        <div className="movies">
          <div className={classnames('topbar', {
            'up': this.state.up
          })}>
            <SearchBar changeTitle={(t) => this.setState({title: t})} submitForm={this.submitForm}/>
            <form onSubmit={this.submitForm}>
              <div className="sidebar">
                <div className="sidebar__container">
                  <div className="sidebar__scrollable">
                    <div>
                      <div className="sidebar__group">
                        <label htmlFor="sort">{t._SORT_TITLE}</label>
                        <select id="sort" name="sort" defaultValue="name" onChange={this.changeSort}>
                          <option value="" disabled>{t._S_SORT_BY}</option>
                          <option value="alphabetical">{t._S_ALPHA}</option>
                          <option value="relevance">{t._S_RELEVANCE}</option>
                          <option value="" disabled>{t._S_FIRST}</option>
                          <option value="rating-desc">{t._S_BEST_RATED}</option>
                          <option value="rating-asc">{t._S_LOWEST_RATED}</option>
                          <option value="year-asc">{t._S_OLDEST}</option>
                          <option value="year-desc">{t._S_MOST_RECENT}</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <div className="sidebar__group genres">
                        <label htmlFor="genres">{t._GENRE_TITLE}</label>
                        <input hidden type="checkbox" id="genres" name="genres"/>
                        <div className="sidebar__group-genres">
                          <input hidden type="checkbox" onChange={this.changeGenre} id="Action" name="Action"/>
                          <label htmlFor="Action">{t._G_ACTION}</label>
                          <input hidden type="checkbox" onChange={this.changeGenre} id="Adventure" name="Adventure"/>
                          <label htmlFor="Adventure">{t._G_ADVENTURE}</label>
                          <input hidden type="checkbox" onChange={this.changeGenre} id="Animation" name="Animation"/>
                          <label htmlFor="Animation">{t._G_ANIMATION}</label>
                          <input hidden type="checkbox" onChange={this.changeGenre} id="Biography" name="Biography"/>
                          <label htmlFor="Biography">{t._G_BIOGRAPHY}</label>
                          <input hidden type="checkbox" onChange={this.changeGenre} id="Comedy" name="Comedy"/>
                          <label htmlFor="Comedy">{t._G_COMEDY}</label>
                          <input hidden type="checkbox" onChange={this.changeGenre} id="Crime" name="Crime"/>
                          <label htmlFor="Crime">{t._G_CRIME}</label>
                          <input hidden type="checkbox" onChange={this.changeGenre} id="Documentary"
                                 name="Documentary"/>
                          <label htmlFor="Documentary">{t._G_DOCUMENTARY}</label>
                          <input hidden type="checkbox" onChange={this.changeGenre} id="Drama" name="Drama"/>
                          <label htmlFor="Drama">{t._G_DRAMA}</label>
                          <input hidden type="checkbox" onChange={this.changeGenre} id="Family" name="Family"/>
                          <label htmlFor="Family">{t._G_FAMILY}</label>
                          <input hidden type="checkbox" onChange={this.changeGenre} id="Fantasy" name="Fantasy"/>
                          <label htmlFor="Fantasy">{t._G_FANTASY}</label>
                          <input hidden type="checkbox" onChange={this.changeGenre} id="FilmNoir" name="Film Noir"/>
                          <label htmlFor="FilmNoir">{t._G_FILM_NOIR}</label>
                          <input hidden type="checkbox" onChange={this.changeGenre} id="History" name="History"/>
                          <label htmlFor="History">{t._G_HISTORY}</label>
                          <input hidden type="checkbox" onChange={this.changeGenre} id="Horror" name="Horror"/>
                          <label htmlFor="Horror">{t._G_HORROR}</label>
                          <input hidden type="checkbox" onChange={this.changeGenre} id="Music" name="Music"/>
                          <label htmlFor="Music">{t._G_MUSIC}</label>
                          <input hidden type="checkbox" onChange={this.changeGenre} id="Musical" name="Musical"/>
                          <label htmlFor="Musical">{t._G_MUSICAL}</label>
                          <input hidden type="checkbox" onChange={this.changeGenre} id="Mystery" name="Mystery"/>
                          <label htmlFor="Mystery">{t._G_MYSTERY}</label>
                          <input hidden type="checkbox" onChange={this.changeGenre} id="Romance" name="Romance"/>
                          <label htmlFor="Romance">{t._G_ROMANCE}</label>
                          <input hidden type="checkbox" onChange={this.changeGenre} id="Sci-Fi" name="Sci-Fi"/>
                          <label htmlFor="Sci-Fi">{t._G_SCI_FI}</label>
                          <input hidden type="checkbox" onChange={this.changeGenre} id="ShortFilm" name="Short Film"/>
                          <label htmlFor="ShortFilm">{t._G_SHORT_FILM}</label>
                          <input hidden type="checkbox" onChange={this.changeGenre} id="Sport" name="Sport"/>
                          <label htmlFor="Sport">{t._G_SPORT}</label>
                          <input hidden type="checkbox" onChange={this.changeGenre} id="Superhero" name="Superhero"/>
                          <label htmlFor="Superhero">{t._G_SUPERHERO}</label>
                          <input hidden type="checkbox" onChange={this.changeGenre} id="Thriller" name="Thriller"/>
                          <label htmlFor="Thriller">{t._G_THRILLER}</label>
                          <input hidden type="checkbox" onChange={this.changeGenre} id="War" name="War"/>
                          <label htmlFor="War">{t._G_WAR}</label>
                          <input hidden type="checkbox" onChange={this.changeGenre} id="Western" name="Western"/>
                          <label htmlFor="Western">{t._G_WESTERN}</label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <input type="submit"/>
                    </div>
                    {/*<div className="sidebar__group">*/}
                    {/*  <label>Genre</label>*/}
                    {/*  <input/><br/>*/}
                    {/*</div>*/}
                  </div>
                </div>
              </div>
            </form>
          </div>
          {this.state.loadingSearch && <div className="movie__loading">
            <LoadingCards/>
            {/*<Loading/>*/}
          </div>}
          <div className="movie__cards">
            {this.state.movies.map((movie, i) => (
              <Card key={i} movie={movie}/>
            ))}
          </div>
          {this.state.loadingInfinite && <div className="movie__loading">
            <LoadingCards/>
            {/*<Loading/>*/}
          </div>}
        </div>
      </div>
    )
      ;
  }
}

const mapStateToProps = (state) => ({
  text: state.translate._MOVIES
});

export default connect(mapStateToProps)(Movies);
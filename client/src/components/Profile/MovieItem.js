import React, {Component} from 'react';
import axios from 'axios';

import './movie-item.css';
import notFound from '../../assets/img/movie-not-found.jpg';

class MovieItem extends Component {
  state = {
  };

  componentWillMount() {
    axios.get(`/api/profile/watched/infos?IMDBid=${this.props.movieId}`)
      .then(res => {
        console.log(res.data);
        this.setState({
          ...res.data
        });
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const m = this.state;
    return (
      <div className="movie-item">
        <img src={m.Poster || notFound} alt="poster" className="m-item__poster" onError={(e) => {e.target.src = notFound}}/>
        <div className="m-item__infos">
          <div className="m-item__title">{m.Title}</div>
          <div className="m-item__subtitle">{m.Director}, {m.Year}</div>
        </div>
      </div>
    );
  }
}

export default MovieItem;
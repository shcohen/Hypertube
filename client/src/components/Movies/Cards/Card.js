import React from 'react';
import {NavLink} from 'react-router-dom';
import classnames from 'classnames';
import {connect} from 'react-redux';

import './card.css';
import noImg from '../../../assets/img/movie-not-found.jpg';

const Card = (props) => {

  let image = props.movie.large_cover_image || props.movie.medium_cover_image;
  const t = props.text || {};

  return (props.movie &&
    <div className="movie__card">
      <NavLink to={`/movie/${props.movie.imdb_code}/${props.movie.id ? props.movie.id : 'no-id'}`}>
      <div className="movie__poster">
        <img className="movie__poster-background" src={image} alt="invisible"
             onError={(e) => {e.target.onerror = null; e.target.src = noImg}}/>
        <div className="movie__poster-infos top">
          {props.movie.genres && props.movie.genres.map((genre, i) => (
            <div key={i} className="movie__poster-info genre">
              {genre}
            </div>
          ))}
        </div>
        <div className={classnames('movie__poster-more with-toolbox', {
          'already-seen': props.movie.seen
        })}>
          <div className="toolbox">{props.movie.seen ? t._SEEN : t._NOT_SEEN}</div>
        </div>
        <div className="movie__poster-infos">
          <div className="movie__poster-info">{props.movie.year}</div>
          <div className="movie__poster-info rating">{props.movie.rating}<span>/10</span></div>
        </div>
      </div>
        <div className="movie__title">
          {props.movie.title}
        </div>
      </NavLink>
    </div>
  );
};

const mapStateToProps = (state) => ({
  text: state.translate._MOVIES
});

export default connect(mapStateToProps)(Card);
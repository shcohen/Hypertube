import React from 'react';
import {NavLink} from 'react-router-dom';

import './card.css';

const Card = (props) => {

  return (props.movie &&
    <div className="movie__card">
      <NavLink to={`/movie/${props.movie.imdb_code}/${props.movie.id}`}>
      <div className="movie__poster">
        <div className="movie__poster-background"
             style={props.movie.medium_cover_image && {backgroundImage: `url("${props.movie.large_cover_image}")`}}/>
        <div className="movie__poster-infos top">
          {props.movie.genres && props.movie.genres.map((genre, i) => (
            <div key={i} className="movie__poster-info genre">
              {genre}
            </div>
          ))}
        </div>
        <div className="movie__poster-more with-toolbox">
          <div className="toolbox">Aller sur la page du film</div>
        </div>
        <div className="movie__poster-infos">
          <div className="movie__poster-info">{props.movie.year}</div>
          <div className="movie__poster-info rating">{props.movie.rating}<span>/10</span></div>
        </div>
      </div>
      </NavLink>
      <div className="movie__title">
        {props.movie.title}
      </div>
    </div>
  );
};

export default Card;
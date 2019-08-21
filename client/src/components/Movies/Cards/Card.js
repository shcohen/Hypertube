import React from 'react';

import './card.css';

const Card = (props) => {

  console.log(props.movie);
  return (
    <div className="movie__card">
      <div className="movie__poster">
        <div className="movie__poster-background" style={props.movie.poster && {backgroundImage: `url("https://image.tmdb.org/t/p/w500${props.movie.poster}")`}}/>
        <div className="movie__poster-infos top">
          {props.movie.genre.map((genre) => (
            <div className="movie__poster-info genre">
              {genre}
            </div>
          ))}
        </div>
        <div className="movie__poster-infos">
          <div className="movie__poster-info">{props.movie.time}</div>
          <div className="movie__poster-info rating">{props.movie.note}<span>/10</span></div>
        </div>
      </div>
      <div className="movie__title">
        {props.movie.title}
      </div>
    </div>
  );
};

export default Card;
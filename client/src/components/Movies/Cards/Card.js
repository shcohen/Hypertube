import React from 'react';

import './card.css';

const Card = () => {
  return (
    <div className="movie__card">
      <div className="movie__poster">
        <div className="movie__poster-background">

        </div>
        <div className="movie__poster-infos">
          <div className="movie__poster-info">2018</div>
          <div className="movie__poster-info rating">5<span>/10</span></div>
        </div>
      </div>
      <div className="movie__title">
        Spiderman
      </div>
    </div>
  );
};

export default Card;
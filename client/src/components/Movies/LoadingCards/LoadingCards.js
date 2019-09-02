import React from 'react';

import './loading-cards.css';

const LoadingCards = () => {
  return (
    <div className="loading-cards">
      <div className="lc__card">
        <div className="lc__poster">
          <div className="lc__poster-background"/>
        </div>
        <div className="lc__title"/>
      </div>
      <div className="lc__card">
        <div className="lc__poster">
          <div className="lc__poster-background"/>
        </div>
        <div className="lc__title"/>
      </div>
      <div className="lc__card">
        <div className="lc__poster">
          <div className="lc__poster-background"/>
        </div>
        <div className="lc__title"/>
      </div>
      <div className="lc__card">
        <div className="lc__poster">
          <div className="lc__poster-background"/>
        </div>
        <div className="lc__title"/>
      </div>
    </div>
  );
};

export default LoadingCards;
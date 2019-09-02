import React from 'react';

import './loading-cards.css';

const LoadingCards = (props) => {
  let arr = [];
  for (let i = 0; i < props.n; i++) {
    arr.push(<div className="lc__card" key={i}>
      <div className="lc__poster">
        <div className="lc__poster-background"/>
      </div>
      <div className="lc__title"/>
    </div>);
  }
  return (
    <div className="loading-cards">
      {arr}
    </div>
  );
};

export default LoadingCards;
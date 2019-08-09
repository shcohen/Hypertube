import React, {Component} from 'react';

import './movies.css';

class Movies extends Component {
  render() {
    return (
        <div className="movies">
          <input className="search-bar" type="text"/>
        </div>
    );
  }
}

export default Movies;
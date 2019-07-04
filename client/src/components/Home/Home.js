import React, {Component} from 'react';

import './home.css';

class Home extends Component {
  render() {
    return (
      <div className="triptych">
        <div className="triptych__part">
          One
        </div>
        <div className="triptych__part">
          Two
        </div>
        <div className="triptych__part">
          Three
        </div>
      </div>
    );
  }
}

export default Home;
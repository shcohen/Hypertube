import React, {Component} from 'react';
import classnames from 'classnames';

import './home.css';

class Home extends Component {
  state = {
    part: 0
  };

  scroll = () => {
    this.setState({
      part: (this.state.part + 1) % 3
    });
  };

  render() {
    const {part} = this.state;

    return (
      <div className={classnames('triptych', {
        'zero': part === 0,
        'one': part === 1,
        'two': part === 2,
      })}>
        <div className="triptych__scroll">
          <div className="with-toolbox" onClick={this.scroll}>
            <div className="toolbox">{part === 2 ? 'Revenir en haut' : 'En savoir plus'}</div>
          </div>
          <button className={classnames('', {
            'rotated': part === 2
          })}/>
        </div>
        <div className="triptych__part gallery__container">
          <div className="gallery">

          </div>
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
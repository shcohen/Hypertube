import React, {Component} from 'react';
import axios from 'axios';

class MoviePage extends Component {
  componentWillUnmount() {
    axios.get('/')
  }

  render() {
    return (
      <div>
        {this.props.match.params.id}
        <iframe src='http://player.allocine.fr/19582892.html' style={{width: '480px', height:'270px'}}>    </iframe>

      </div>
    );
  }
}

export default MoviePage;
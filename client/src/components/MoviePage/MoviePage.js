import React, {Component} from 'react';

class MoviePage extends Component {
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
import React, {Component} from 'react';

class WatchMovie extends Component {
  render() {
    const {id, title, hash} = this.props.match.params;
    return (
      <div>
        <video crossOrigin="anonymous" controls width={'700px'} height={'500px'}>
          <source src={`http://localhost:5000/api/torrent/download_torrent?movieId=${id}&movieNameEncoded=${title}&movieHash=${hash}`} />
        </video>
      </div>
    );
  }
}

export default WatchMovie;
import React, {Component} from 'react';

class WatchMovie extends Component {
  render() {
    const {id, title, hash} = this.props.match.params;
    return (
      <div>
        <video src={`/api/torrent/download_torrent?movieId=${id}&movieNameEncoded=${title}&movieHash=${hash}`}></video>
      </div>
    );
  }
}

export default WatchMovie;
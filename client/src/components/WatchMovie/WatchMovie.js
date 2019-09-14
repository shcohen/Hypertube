import React, {Component} from 'react';
import axios from 'axios';

import './watch-movie.css';

class WatchMovie extends Component {
    state = {
        video: false,
        subtitles: []
    };

    componentWillMount() {
        axios.get(`/api/subtitles/get_subtitles?IMDBid=${this.props.match.params.id}`)
            .then((res) => {
                this.setState({
                    video: true,
                    subtitles: res.data
                })
            })
    }

    render() {
        const {video, subtitles} = this.state;
        const {id, title, hash} = this.props.match.params;
        return (
            <div className="watch-movie">
                {video && <video crossOrigin="anonymous" controls className="wm__player">
                    <source src={`/api/torrent/download_torrent?movieId=${id}&movieNameEncoded=${title}&movieHash=${hash}`}/>
                    <source src={`/api/torrent/download_torrent?movieId=tt4154796&movieNameEncoded=Avengers: Endgame&movieHash=414A6F933C48FC7543A9CDB42C854B5457C5BCC7`}/>
                    {subtitles.map((subtitle, i) => (
                      <track label={subtitle.label} kind="subtitles" src={subtitle.file} srcLang={subtitle.code} key={i}/>
                    ))}
                </video>}
            </div>
        );
    }
}

export default WatchMovie;
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
                console.log(res.data);
                this.setState({
                    video: true,
                    subtitles: res.data
                })
            })
    }

    componentWillUnmount() {

    }

    render() {
        const {video, subtitles} = this.state;
        const {id, title, hash} = this.props.match.params;
        return (
            <div className="watch-movie">
                {video && <video crossOrigin="anonymous" controls className="wm__player">
                    <source src={`http://localhost:5000/api/torrent/download_torrent?movieId=${id}&movieNameEncoded=${title}&movieHash=${hash}`}/>
                    {subtitles.map((subtitle, i) => (
                      <track label={subtitle.label} kind="subtitles" src={subtitle.file} srcLang={subtitle.code} key={i}/>
                    ))}
                </video>}
            </div>
        );
    }
}

export default WatchMovie;
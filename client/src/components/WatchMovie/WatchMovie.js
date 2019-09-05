import React, {Component} from 'react';
import axios from 'axios';

class WatchMovie extends Component {
    state = {
        sendVideo: false
    };

    componentWillMount() {
        axios.get(`/api/subtitles/get_subtitles?IMDBid=${this.props.match.params.id}`)
            .then(() => {
                this.setState({
                    sendVideo: true
                })
            })
    }

    render() {
        const {sendVideo} = this.state;
        const {id, title, hash} = this.props.match.params;
        return (
            sendVideo && <div>
                <video crossOrigin="anonymous" controls width={'700px'} height={'500px'}>
                    <source src={`http://localhost:5000/api/torrent/download_torrent?movieId=${id}&movieNameEncoded=${title}&movieHash=${hash}`}/>
                    <track label="French" kind="subtitles" src="/Subtitles/tt4154796/tt4154796.fr.vtt" srcLang="fr"/>
                </video>
            </div>
        );
    }
}

export default WatchMovie;
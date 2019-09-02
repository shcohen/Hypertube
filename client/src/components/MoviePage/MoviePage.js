import React, {Component} from 'react';
import axios from 'axios';
import classnames from 'classnames';

import Error from '../Error/Error';
import Loading from '../Utilities/Loading/Loading';

import './movie-page.css';

class MoviePage extends Component {
  state = {
    movie: 'empty',
    bigger: false
  };

  componentWillMount() {
    const {IMDBid, YTSid} = this.props.match.params;
    console.log(IMDBid);
    console.log(YTSid);
    axios.get(`/api/library/find_movie_info?IMDBid=${IMDBid}&YTSid=${YTSid}`)
      .then((res) => {
        console.log(res.data);
        this.setState({
          movie: res.data
        })
      })
      .catch((err) => {
        this.setState({
          movie: 'error'
        });
        console.log(err);
      });
  }

  render() {
    const {bigger} = this.state;
    const {movie} = this.state;
    if (movie === 'empty') {
      return (<Loading/>);
    }
    if (movie === 'error') {
      return (<Error/>);
    }
    return (
      <div id="movie">
        <div className={classnames('movie__trailer', {
          'bigger': bigger
        })}>
          <div className="trailer__overlay" onClick={() => {
            this.setState({bigger: !this.state.bigger})
          }}>
            {bigger ? 'Cliquer pour fermer' : 'Cliquer pour agrandir'}
          </div>
          {movie.yts.yt_trailer_code !== '' && <iframe width="360px" height="200px"
                  src={`https://www.youtube.com/embed/${movie.yts.yt_trailer_code}?playlist=${movie.yts.yt_trailer_code}&mute=${bigger ? '0' : '1'}&version=3&autoplay=1&controls=0&disablekb=1&fs=0&loop=1&modestbranding=1&showinfo=0&rel=0`}
                  frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen/>}
          <div className={classnames('trailer__title', {
            'hidden': bigger
          })}>
            {movie.Title}
          </div>
        </div>
        <div className="centered">
          <div className={classnames('movie__grid', {
            'video': bigger
          })}>
            <div className="movie__side">
              <div className="side__poster" style={{backgroundImage: `url("${movie.Poster}")`}}/>
              <div className="side__title">
                {movie.Title}
              </div>
              <div className="side__download">
                <div>jskdjaskljdlj</div>
                <div>jskdjaskljdlj</div>
                <div>jskdjaskljdlj</div>
                <div>jskdjaskljdlj</div>
                <div>jskdjaskljdlj</div>
                <div>jskdjaskljdlj</div>
              </div>
            </div>
            <div className="movie__main">

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MoviePage;
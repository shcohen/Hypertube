import React, {Component} from 'react';
import axios from 'axios';
import classnames from 'classnames';
import {connect} from 'react-redux';
import getAverageColor from 'get-average-color';
import {NavLink} from 'react-router-dom';

import Error from '../Error/Error';
import Loading from '../Utilities/Loading/Loading';
import Comments from './Comments';

import './movie-page.css';

class MoviePage extends Component {
  state = {
    movie: 'empty',
    bigger: false,
    rgb: {r: 0, g: 0, b: 0}
  };

  componentWillMount() {
    const {IMDBid, YTSid} = this.props.match.params;
    axios.get(`/api/library/find_movie_info?IMDBid=${IMDBid}&YTSid=${YTSid}`)
      .then((res) => {
        this.setState({
          movie: res.data
        });
        const img = res.data.Poster;
        if (img && img !== '' && img !== 'N/A') {
          getAverageColor(img)
            .then((rgb) => {
              this.setState({
                rgb: rgb
              });
            })
        }
      })
      .catch((err) => {
        this.setState({
          movie: 'error'
        });
      });
  }

  render() {
    const {bigger, movie, rgb} = this.state;
    const source = movie.popcornTime === undefined ? 'yts' : 'popcornTime';
    const t = this.props.text || {};
    const runtime = movie.Runtime === 'N/A' ? movie[source].runtime : movie.Runtime;
    if (movie === 'empty') {
      return (<div style={{height: '8rem'}}>
        <Loading/>
      </div>);
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
          {movie.yts && movie.yts.yt_trailer_code !== '' && <iframe width="360px" height="200px" title="video"
                                                       src={`https://www.youtube.com/embed/${movie.yts.yt_trailer_code}?playlist=${movie.yts.yt_trailer_code}&mute=${bigger ? '0' : '1'}&version=3&autoplay=1&controls=0&disablekb=1&fs=0&loop=1&modestbranding=1&showinfo=0&rel=0`}
                                                       frameBorder="0"
                                                       allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                                       allowFullScreen/>}
        </div>
        <div className="centered">
          <div className={classnames('movie__grid', {
            'video': bigger
          })}>
            <div className="movie__side">
              <div className="side__poster" style={{backgroundImage: movie.Poster !== 'N/A' && `url("${movie.Poster}")`}}/>
              <div className="side__title">
                {movie.Title}
              </div>
              <div className="side__download" style={{backgroundColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}}>
                <h1 className="download__label">{t._SIDE_LABEL}</h1>
                {movie.yts && movie.yts.torrents && movie.yts.torrents.map((torrent, i) => (
                  <NavLink key={i} to={`/watch/${movie.imdbID}/${encodeURIComponent(movie.Title)}/${torrent.hash}`}>
                    <div className="download__torrent">
                      {torrent.type} {torrent.quality} <span>({torrent.size})</span>
                      <div className="download__p2p">
                        <div className="download__seeds">{torrent.seeds}</div>
                        <div className="download__peers">{torrent.peers}</div>
                      </div>
                      <div className="download__play"/>
                    </div>
                  </NavLink>
                ))}
                  {movie.popcornTime && movie.popcornTime.torrents && movie.popcornTime.torrents.map((torrent, i) => (
                      <NavLink key={i} to={`/watch/${movie.imdbID}/${encodeURIComponent(movie.Title)}/${torrent.hash}`}>
                          <div className="download__torrent">
                              {torrent.type} {torrent.quality} <span>({torrent.size})</span>
                              <div className="download__p2p">
                                  <div className="download__seeds">{torrent.seeds}</div>
                                  <div className="download__peers">{torrent.peers}</div>
                              </div>
                              <div className="download__play"/>
                          </div>
                      </NavLink>
                  ))}
              </div>
            </div>
            <div className="movie__main">
              <div className={classnames('main__title', {
                'hidden': bigger
              })}>
                {movie.Title}
              </div>
              <div className={classnames('main__subtitle', {
                'hidden': bigger
              })}>
                {movie.Year} • {movie.Director} {runtime && `• ${Math.floor(parseInt(runtime) / 60)}h${parseInt(runtime) % 60 < 10 ? '0' : ''}${parseInt(runtime) % 60}`}
              </div>
              <h1 className="main__label">{t._MAIN_LABEL}</h1>
              <div className="main__content">
                <div className="main__group special">
                  <div>
                    <div className="main__g_name">{t._SYNOPSIS}</div>
                    <div className="main__g_text">{movie.Plot === 'N/A' ? movie[source].description_full : movie.Plot}</div>
                  </div>
                </div>
                <div className="main__group">
                  <div>
                    <div className="main__g_name">{t._ACTORS}</div>
                    <div className="main__g_text">{movie.Actors}</div>
                  </div>
                  <div>
                    <div className="main__g_name">{t._GENRES}</div>
                    <div className="main__g_text">{movie.Genre && movie.Genre.map((g, i) => (g + (i === movie.Genre.length - 1 || g === 'N/A' ? ' ' : ', ')))}</div>
                  </div>
                </div>
                <div className="main__group">
                  <div>
                    <div className="main__g_name">{t._RELEASE_DATE}</div>
                    <div className="main__g_text">{movie.Released === 'N/A' ? movie.Year : movie.Released}</div>
                  </div>
                  <div>
                    <div className="main__g_name">{t._RATINGS}</div>
                    <div className="main__g_text">{movie.Ratings && movie.Ratings.map((rating, i) => (
                      <div key={i}>{rating.Source} : {rating.Value}</div>
                    ))}{!movie.Ratings.length && ('N/A')}</div>
                  </div>
                </div>
                <div className="main__group">
                  <div>
                    <div className="main__g_name">{t._PRODUCTION}</div>
                    <div className="main__g_text">{movie.Production}</div>
                  </div>
                  <div>
                    <div className="main__g_name">{t._AWARDS}</div>
                    <div className="main__g_text">{movie.Awards}</div>
                  </div>
                </div>
              </div>
              <Comments movieId={movie.imdbID} t={t}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  text: state.translate._MOVIE_PAGE
});

export default connect(mapStateToProps)(MoviePage);
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
    // axios.get(`/api/library/find_movie_info?IMDBid=${IMDBid}&YTSid=${YTSid}`)
    //   .then((res) => {
    //     console.log(res.data);
    //     this.setState({
    //       movie: res.data
    //     })
    //   })
    //   .catch((err) => {
    //     this.setState({
    //       movie: 'error'
    //     });
    //     console.log(err);
    //   });
  }

  render() {
    const {bigger} = this.state;
    // const {movie} = this.state;
    // if (movie === 'empty') {
    //   return (<Loading/>);
    // }
    // if (movie === 'error') {
    //   return (<Error/>);
    // }
    return (
      <div>
        <div className={classnames('movie__trailer', {
          'bigger': bigger
        })}>
          <div className="trailer__overlay" onClick={() => {this.setState({bigger: !this.state.bigger})}}>
            {bigger ? 'Cliquer pour fermer' : 'Cliquer pour agrandir'}
          </div>
          <iframe width="100vw" height="100%" src="https://www.youtube.com/embed/TcMBFSGVi1c?autoplay=1&controls=0&disablekb=1&fs=0&loop=1&modestbranding=1&showinfo=0"
                  frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen/>
        </div>
        <div className="centered">
          <div className={classnames('movie__grid', {
            'video': bigger
          })}>
            <div className="movie__side">

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
import React, {Component} from 'react';
import axios from 'axios';

import Error from '../Error/Error';
import Loading from '../Utilities/Loading/Loading';

class MoviePage extends Component {
  state = {
    movie: 'empty'
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
    // const {movie} = this.state;
    // if (movie === 'empty') {
    //   return (<Loading/>);
    // }
    // if (movie === 'error') {
    //   return (<Error/>);
    // }
    return (
      <div>

      </div>
    );
  }
}

export default MoviePage;
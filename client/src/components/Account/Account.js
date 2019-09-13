import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';

import InfosForm from './InfosForm';
import MovieItem from '../Profile/MovieItem';

import './account.css';

class Account extends Component {
  state = {
    movies: []
  };

  componentWillMount() {
    axios.get(`/api/profile/watched?acc_id=${this.props.user.acc_id}`)
      .then(res => {
        this.setState({movies: res.data});
      });
  }

  render() {
    const u = this.props.user || {};
    const t = this.props.text || {};
    const {movies} = this.state;

    return (
      <div className="account centered">
        <div className="account__grid">
          <div className="account__infos">
            <div className="account__title">{t._A_INFOS_TITLE}</div>
            <div className="hf__content">
             <InfosForm text={t} user={u}/>
            </div>
          </div>
          <div className="account__movies">
            <div className="account__title">{t._A_MOVIES_TITLE}</div>
            <div className="account__movies_list">
              {movies.map((m, i) => (
                <MovieItem key={i} movieId={m.movieId}/>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  text: {...state.translate._ACCOUNT, ...state.translate._FORMS}
});

export default connect(mapStateToProps)(Account);
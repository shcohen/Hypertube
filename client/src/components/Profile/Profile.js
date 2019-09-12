import React, {Component} from 'react';
import axios from 'axios';
import classnames from 'classnames';
import {connect} from 'react-redux';

import MovieItem from './MovieItem';

import './profile.css';

class Profile extends Component {
  state = {
    step: 0,
    acc_id: '',
    username: '',
    lastname: '',
    firstname: '',
    profilePic: '',
    movies: []
  };

  componentWillMount() {
    axios.get(`/api/profile?user_id=${this.props.userId}`)
      .then(res => {
        this.setState({...res.data});
      });
    axios.get(`/api/profile/watched?acc_id=${this.props.userId}`)
      .then(res => {
        this.setState({movies: res.data});
      });
  }

  render() {
    const {step, movies, ...p} = this.state;
    const t = this.props.text || {};
    return (
      <div className="profile">
        <img className="profile__picture" src={p.profilePic} alt="profile"/>
        <div className="profile__window">
          <div className="profile__title-bar">
            <div className={classnames('profile__title-bar_tab', {
              'active': step === 0
            })} onClick={() => this.setState({step: 0})}>
              {t._TAB_INFOS}
            </div>
            <div className={classnames('profile__title-bar_tab', {
              'active': step === 1
            })} onClick={() => this.setState({step: 1})}>
              {t._TAB_MOVIES}
            </div>
          </div>
          <hr className="profile__hr"/>
          <div className="profile__content">
            {step === 0 && <div>
              <div className="profile__info_label">{t._USERNAME}</div>
              <div className="profile__info_content">{p.username}</div>
              <div className="profile__info_label">{t._FIRSTNAME}</div>
              <div className="profile__info_content">{p.firstname}</div>
              <div className="profile__info_label">{t._LASTNAME}</div>
              <div className="profile__info_content">{p.lastname}</div>
            </div>}
            {step === 1 && <div>
              {movies.map((m, i) => (
                <MovieItem key={i} movieId={m.movieId}/>
              ))}
            </div>}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  text: state.translate._PROFILE
});

export default connect(mapStateToProps)(Profile);
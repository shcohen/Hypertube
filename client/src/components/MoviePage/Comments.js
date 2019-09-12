import React, {Component} from 'react';
import axios from 'axios';

import Profile from '../Profile/Profile';

import './comments.css';

class Comments extends Component {
  state = {
    newComment: '',
    comments: []
  };

  submitForm = (e) => {
    e.preventDefault();
    console.log(this.state.newComment);
    axios.post('/api/comments/submit', {
      movie_id: this.props.movieId,
      message: this.state.newComment
    })
      .then(() => {
        this.getComments();
        this.setState({
          newComment: ''
        });
      });
  };

  onFormChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  getComments = () => {
    axios.get(`/api/comments?movie_id=${this.props.movieId}`)
      .then(res => {
        console.log(res.data);
        this.setState({
          comments: res.data
        })
      })
      .catch(err => {
        console.log(err);
      });
  };

  componentWillMount() {
    this.getComments();
  }

  render() {
    const {t} = this.props || {};
    const {comments, newComment} = this.state;

    return (
      <React.Fragment>
        <h1 className="main__label">{t._COMMENTS_LABEL}</h1>
        <div className="comments__panel">
          <form onSubmit={this.submitForm}>
            <label className="comments__label" htmlFor="newComment">{t._WRITE_COMMENT}</label>
            <textarea className="comments__input" id="newComment"
                      rows="3"
                      autoComplete="off"
                      minLength="1"
                      maxLength="200"
                      required
                      spellCheck="true"
                      value={newComment}
                      name="newComment"
                      onChange={this.onFormChange}
                      placeholder={t._COMMENTS_PLACEHOLDER}
            />
            <input className="comments__button" type="submit" value={' ' + t._COMMENTS_BUTTON + ' '} disabled={!newComment.length}/>
          </form>
          <hr className="comments__hr"/>
          <div className="comments__list">
            {comments.map((c, i) => (
              <div className="comment" key={i}>
                <Profile userId={c.acc_id}/>
                <div className="comment__content">
                  {c.message}
                </div>
                <div className="comment__date">
                  {c.date}
                </div>
              </div>
            ))}
            <div className="comments__none">{t._COMMENTS_NONE}</div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Comments;
import React, {Component} from 'react';

import './comments.css';

class Comments extends Component {
  state = {
    comments: [
      {
        user: 'michel',
        content: 'ceci est un commentaire'
      },
      {
        user: 'marie',
        content: 'lol mdr xd'
      },
    ]
  };

  render() {
    const {t} = this.props || {};
    const {comments} = this.state;

    return (
      <React.Fragment>
        <h1 className="main__label">{t._COMMENTS_LABEL}</h1>
        <div className="comments__panel">
          <label className="comments__label">{t._WRITE_COMMENT}</label>
          <textarea className="comments__input" rows="2"/>
          <div className="comments__list">
            {comments.map((c, i) => (
              <div className="comment" key={i}>{c.content}</div>
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Comments;
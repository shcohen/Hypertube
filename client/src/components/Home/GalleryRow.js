import React, {Component} from 'react';

class GalleryRow extends Component {
  state = {
    offset: false
  };

  timeout = setInterval(() => {
    const {row} = this.props;
    const gallery = document.querySelector('.gallery');
    const div = document.querySelector('.gallery__row.r' + row);
    if (!gallery || !div) {
      return;
    }
    this.setState({
      offset: (div.offsetTop + 1) % gallery.offsetHeight
    })
  }, 100);

  componentWillUnmount() {
    clearInterval(this.timeout);
  }

  render() {
    // const gallery = document.querySelector('.gallery');
    const {movies, row} = this.props;
    const {offset} = this.state;

    return (
      <div className={'gallery__row r' + row} style={{
        top: offset === false ? `calc(32vw * ${row})` : `${offset}px`
      }}>
        {movies.map((movie, i) => (
          <div key={i} className="gallery__image" style={{
            backgroundImage: `url("${movie}")`,
            // filter: `blur(calc(1px * (${gallery ? gallery.offsetHeight : 4000} - ${offset === false ? 0 : offset}) / 800))`
          }}/>
        ))}
      </div>
    );
  }
}

export default GalleryRow;
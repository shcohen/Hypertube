import React, {Component} from 'react';

import GalleryRow from './GalleryRow';

import './gallery.css';

class Gallery extends Component {
  state = {
    movies: [
      [
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg'
      ],
      [
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
      ],
      [
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg'
      ],
      [
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
      ],
      [
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg'
      ],
      [
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
      ],
      [
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg'
      ],
      [
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
      ],
      [
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg'
      ],
      [
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
      ],
      [
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg'
      ],
      [
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
      ],
      [
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg'
      ],
      [
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
      ],
      [
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg'
      ],
      [
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
      ],
    ],
    shown: true
  };

  componentDidMount() {
    window.onresize = () => {
      this.setState({
        shown: false
      });
      this.setState({
        shown: true
      })
    }
  }

  componentWillUnmount() {
    window.onresize = undefined;
  }

  render() {
    const {movies, shown} = this.state;

    return (shown &&
      <div className="gallery" style={{height: `calc(32vw * ${movies.length})`}}>
        {movies.map((moviesList, i) => {
          return (<GalleryRow key={i} row={i} movies={moviesList}/>)
        })}
      </div>
    );
  }
}

export default Gallery;
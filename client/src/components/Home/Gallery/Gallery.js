import React, {Component} from 'react';

import Row from './Row';

import './gallery.css';

class Gallery extends Component {
  state = {
    movies: [
      [
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://i.ebayimg.com/images/g/llEAAOSwY8BbkOdy/s-l640.jpg',
        'http://cdn.shopify.com/s/files/1/1148/8924/products/MPW-115495-a_1024x1024.jpg?v=1556255572',
        'https://images-na.ssl-images-amazon.com/images/I/51poKKV63GL.jpg'
      ],
      [
        'https://images-na.ssl-images-amazon.com/images/I/81UX9JdMUvL._SY450_.jpg',
        'https://www.bestmovieposters.co.uk/wp-content/uploads/2019/01/inCmCRl_.jpeg',
        'https://cdn.shopify.com/s/files/1/0969/9128/products/Movie_Poster_Art_-_Amelie_-_AudreyTautou-_Tallenge_Hollywood_Poster_Collection_a0238222-7985-459a-9889-0fc718d1580f.jpg?v=1519375668',
        'https://www.digitalartsonline.co.uk/cmsdata/slideshow/3662115/baby-driver-rory-hi-res.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/A1%2BFw58qbDL._SY606_.jpg',
      ],
      [
        'https://j.b5z.net/i/u/6127364/i/ec/Alita_55_i2.jpg',
        'http://cafmp.com/wp-content/uploads/2012/11/Avatar-608x900.jpg',
        'https://d13ezvd6yrslxm.cloudfront.net/wp/wp-content/images/2018-bestposters-spidermanspiderverse-700x1038.jpg',
        'https://www.washingtonpost.com/graphics/2019/entertainment/oscar-nominees-movie-poster-design/img/bohemian-rhapsody-web.jpg',
        'https://eu.movieposter.com/posters/archive/main/250/MPW-125051'
      ],
      [
        'https://images-na.ssl-images-amazon.com/images/I/71X6YzwV0gL._SY679_.jpg',
        'https://locchiodelcineasta.com/wp-content/uploads/2018/07/The-Neon-Demon-locchio-del-cineasta-locandina.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/81az0oR6izL._SY606_.jpg',
        'http://fr.web.img4.acsta.net/medias/nmedia/18/66/15/78/19254683.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/81UX9JdMUvL._SY450_.jpg',
      ],
      [
        'https://m.media-amazon.com/images/M/MV5BMmEzNTkxYjQtZTc0MC00YTVjLTg5ZTEtZWMwOWVlYzY0NWIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/51uuPeghaNL._SY450_.jpg',
        'http://ae01.alicdn.com/kf/HTB1hX8HaeSSBuNjy0Flq6zBpVXaV.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/51dNfU53lNL.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/51L%2BK22ZpeL._SY450_.jpg'
      ],
      [
        'https://www.geeksandcom.com/wp-content/uploads/2018/04/Avengers-Infinity-War-IMAX-Affiche-689x1000.jpg',
        'https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_310/v1552420872/amc-cdn/production/2/movies/50900/50869/PosterDynamic/74480.jpg',
        'https://i.ebayimg.com/images/g/llEAAOSwY8BbkOdy/s-l640.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/91J0KtuFMAL._SY679_.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/51poKKV63GL.jpg'
      ],
      [
        'https://images-na.ssl-images-amazon.com/images/I/81UX9JdMUvL._SY450_.jpg',
        'https://www.bestmovieposters.co.uk/wp-content/uploads/2019/01/inCmCRl_.jpeg',
        'https://cdn.shopify.com/s/files/1/0969/9128/products/Movie_Poster_Art_-_Amelie_-_AudreyTautou-_Tallenge_Hollywood_Poster_Collection_a0238222-7985-459a-9889-0fc718d1580f.jpg?v=1519375668',
        'https://www.digitalartsonline.co.uk/cmsdata/slideshow/3662115/baby-driver-rory-hi-res.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/A1%2BFw58qbDL._SY606_.jpg',
      ],
      [
        'https://j.b5z.net/i/u/6127364/i/ec/Alita_55_i2.jpg',
        'http://cafmp.com/wp-content/uploads/2012/11/Avatar-608x900.jpg',
        'https://d13ezvd6yrslxm.cloudfront.net/wp/wp-content/images/2018-bestposters-spidermanspiderverse-700x1038.jpg',
        'https://www.washingtonpost.com/graphics/2019/entertainment/oscar-nominees-movie-poster-design/img/bohemian-rhapsody-web.jpg',
        'https://eu.movieposter.com/posters/archive/main/250/MPW-125051'
      ],
      [
        'https://images-na.ssl-images-amazon.com/images/I/71X6YzwV0gL._SY679_.jpg',
        'https://locchiodelcineasta.com/wp-content/uploads/2018/07/The-Neon-Demon-locchio-del-cineasta-locandina.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/81az0oR6izL._SY606_.jpg',
        'http://fr.web.img4.acsta.net/medias/nmedia/18/66/15/78/19254683.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/81UX9JdMUvL._SY450_.jpg',
      ],
      [
        'https://m.media-amazon.com/images/M/MV5BMmEzNTkxYjQtZTc0MC00YTVjLTg5ZTEtZWMwOWVlYzY0NWIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/51uuPeghaNL._SY450_.jpg',
        'http://ae01.alicdn.com/kf/HTB1hX8HaeSSBuNjy0Flq6zBpVXaV.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/51dNfU53lNL.jpg',
        'https://images-na.ssl-images-amazon.com/images/I/51L%2BK22ZpeL._SY450_.jpg'
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
          return (<Row key={i} row={i} movies={moviesList}/>)
        })}
      </div>
    );
  }
}

export default Gallery;
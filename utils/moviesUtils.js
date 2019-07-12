const axios = require('axios');
const torrentSearch = require('torrent-search-api');
const {TMDB_API_KEY_V3} = require('../config/apiKey');

module.exports = {
    getImdbID: async movie_title => {
        let res = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY_V3}&query=${movie_title}`);
        return res.data.results[0] ? res.data.results[0].id : undefined;
    },
    removeTitleAndQualityDoublons: (movies) => {
        return movies.filter((first_movie, i) => {
            return movies.findIndex(second_movie => {
                if (first_movie.title && second_movie.title && first_movie.torrentInfo.quality && second_movie.torrentInfo.quality)
                    return second_movie.title === first_movie.title && second_movie.torrentInfo.quality === first_movie.torrentInfo.quality;
            }) === i;
        });
    },
    epurMovieObject: movie => {
        movie.provider = undefined;
        movie.time = undefined;
        movie.desc =  undefined;
        movie.magnet =  undefined;
    }
};
const axios = require('axios');
const torrentSearch = require('torrent-search-api');
const {TMDB_API_KEY_V3} = require('../config/apiKey');

module.exports = {
    getImdbInfo: async movie_title => {
        let res = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY_V3}&query=${movie_title}`);
        if (res.data.results[0]) {
            let imdbID = await axios.get(`https://api.themoviedb.org/3/movie/${res.data.results[0].id}/external_ids?api_key=${TMDB_API_KEY_V3}`);
            if (imdbID.data.imdb_id) {
                return await axios.get(`https://movie-database-imdb-alternative.p.rapidapi.com/?i=${imdbID.data.imdb_id}&r=json`, {
                    headers: {
                        "X-RapidAPI-Host": "movie-database-imdb-alternative.p.rapidapi.com",
                        "X-RapidAPI-Key": "d55529eb60msh01867715cf76d45p1d6249jsn579987700ad6"
                    }
                }).then(res => {
                    return res.data;
                })
            }
        }

    },
    removeTitleAndQualityDoublons: (movies) => {
        return movies.filter((first_movie, i) => {
            return movies.findIndex(second_movie => {
                if (first_movie.title && second_movie.title && first_movie.quality && second_movie.quality)
                    return second_movie.title === first_movie.title && second_movie.quality === first_movie.quality;
            }) === i;
        });
    },
    epurMovieObject: movie => {
        movie.magnet =  undefined;
    }
};
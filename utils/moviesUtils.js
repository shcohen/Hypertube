const axios = require('axios');
const torrentSearch = require('torrent-search-api');
const {TMDB_API_KEY_V3, RAPIDAPI_KEY} = require('../config/apiKey');

module.exports = {
    getMovieInfo: async (title, movie) => {
        let res = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY_V3}&query=${title}`);
            if (res.data.results[0]) {
            movie.title = res.data.results[0].title;
            movie.poster = res.data.results[0].poster_path ? res.data.results[0].poster_path : res.data.results[0].backdrop_path;
            movie.time = res.data.results[0].release_date;
            movie.note = res.data.results[0].vote_average;
            movie.overview = res.data.results[0].overview;
            movie.id = res.data.results[0].id;
            let result = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_API_KEY_V3}&language=en-US`);
            if (result.data) {
                movie.genre = [];
                result.data.genres.map(genre => {
                   movie.genre = [...movie.genre, genre.name];
                });
            }
        }
    },
    getImdbInfo: async id => {
        let imdbID = await axios.get(`https://api.themoviedb.org/3/movie/${id}/external_ids?api_key=${TMDB_API_KEY_V3}`);
        if (imdbID.data.imdb_id) {
            return await axios.get(`https://movie-database-imdb-alternative.p.rapidapi.com/?i=${imdbID.data.imdb_id}&r=json`, {
                headers: {
                    "X-RapidAPI-Host": "movie-database-imdb-alternative.p.rapidapi.com",
                    "X-RapidAPI-Key": RAPIDAPI_KEY
                }
            }).then(res => {
                return res.data;
            })
        }
    },
    removeMoviesWithoutInfo: (movies) => {
        return movies.filter((first_movie, i) => {
            return movies.findIndex(second_movie => {
                if (first_movie.note && second_movie.note)
                    return second_movie.note === first_movie.note;
            }) === i;
        });
    },
    removeDuplicatesMovies: (movies) => {
        return movies.filter((first_movie, i) => {
            return movies.findIndex(second_movie => {
                if (first_movie.title && second_movie.title)
                    return second_movie.title.toLowerCase() === first_movie.title.toLowerCase();
            }) === i;
        });
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
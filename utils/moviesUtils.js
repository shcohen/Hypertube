const axios = require('axios');
// const rateLimit = require('axios-rate-limit');
const {RAPIDAPI_KEY} = require('../config/apiKey');
// const limitedRequest = rateLimit(axios.create(), {maxRequests: 35, perMilliseconds: 10000});

module.exports = {
    getMovieInfo: async (id) => {
        return await axios.get(`https://movie-database-imdb-alternative.p.rapidapi.com/?i=${id}&r=json`, {
            headers: {
                "X-RapidAPI-Host": "movie-database-imdb-alternative.p.rapidapi.com",
                "X-RapidAPI-Key": RAPIDAPI_KEY
            }
        }).then(res => {
            return res.data;
        })
    },
    sortByName: (movies, name) => {
        return movies.filter(movie => {
            let title = movie.title.replace(/[:]/gm, '').toLowerCase();
            return title.indexOf(name) >= 0;
        });
    },
    sortByGenre: (movies, category) => {
        let checkGenre = [];
        movies.map(movie => {
            let movieGenre = [];
            let genres_length = movie.genres.length;
            movie.genres.map(genre => {
                category.filter(val => val === genre ? movieGenre.push(genre) : movieGenre);
            });
            if (movieGenre.length === genres_length) {
                return checkGenre.push(movie);
            }
        });
        return checkGenre;
    },
    sortByRatings: (movies, ratings) => {
        let checkRatings = [];
        movies.map(movie => {
            return parseInt(movie.rating) >= parseInt(ratings[0]) && parseInt(movie.rating) <= parseInt(ratings[1])
                && checkRatings.push(movie);
        });
        return checkRatings;
    },
    sortByYear: (movies, year) => {
        let checkYear = [];
        movies.map(movie => {
            return parseInt(movie.year) >= parseInt(year[0]) && parseInt(movie.year) <= parseInt(year[1])
                && checkYear.push(movie);
        });
        return checkYear;
    },
};
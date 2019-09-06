const axios = require('axios');
const fs = require('fs');
// const rateLimit = require('axios-rate-limit');
const {translateSentence} = require('./languageUtils');
const {RAPIDAPI_KEY} = require('../config/apiKey');
// const limitedRequest = rateLimit(axios.create(), {maxRequests: 35, perMilliseconds: 10000});

module.exports = {
    getMovieInfo: async (IMDBid, YTSid) => {
        return await axios.get(`https://movie-database-imdb-alternative.p.rapidapi.com/?i=${IMDBid}&r=json`, {
            headers: {
                "X-RapidAPI-Host": "movie-database-imdb-alternative.p.rapidapi.com",
                "X-RapidAPI-Key": RAPIDAPI_KEY
            }
        }).then(async res => {
            // let genres = await translateSentence(res.data.Genre);
            // res.data.Genre = genres.split(',').map((genre) => (genre.trim()));
            // res.data.Plot = await translateSentence(res.data.Plot);
            let yts = await axios.get(`https://yts.lt/api/v2/movie_details.json?movie_id=${YTSid}`);
            res.data.yts = yts ? yts.data.data.movie : {};
            return res.data.imdbID === res.data.yts.imdb_code ? res.data : null;
        })
    },
    isMovieDownloaded: async (file, filePath) => {
        try {
            fs.accessSync(filePath);
            let fileStat = fs.statSync(filePath);
            console.log(fileStat.size, file.length);
            return fileStat.size === file.length;
        } catch (err) {
            return false;
        }
    },
    filterByGenre: (movies, category) => {
        return movies.filter(movie => {
            return (movie.genres.filter(genre => category.find((g) => (g === genre))).length === category.length);
        });
    },
    filterByRatings: (movies, ratings) => {
        let checkRatings = [];
        movies.map(movie => {
            return parseFloat(movie.rating) >= parseFloat(ratings[0]) && parseFloat(movie.rating) <= parseFloat(ratings[1])
                && checkRatings.push(movie);
        });
        return checkRatings;
    },
    filterByYear: (movies, year) => {
        let checkYear = [];
        movies.map(movie => {
            return parseInt(movie.year) >= parseInt(year[0]) && parseInt(movie.year) <= parseInt(year[1])
                && checkYear.push(movie);
        });
        return checkYear;
    },
    sortMovies: (sort, movies) => {
        switch (sort) {
            case 'alphabetical':
                return movies.sort((current, next) => {
                    return current.title > next.title ? 1 : -1
                });
            case 'relevance':
                return movies;
            case 'rating-asc':
                return movies.sort((current, next) => {
                    return parseFloat(current.rating) > parseFloat(next.rating) ? 1 : -1
                });
            case 'rating-desc':
                return movies.sort((current, next) => {
                    return parseFloat(current.rating) > parseFloat(next.rating) ? -1 : 1
                });
            case 'year-asc':
                return movies.sort((current, next) => {
                    return parseInt(current.year) > parseInt(next.year) ? 1 : -1
                });
            case 'year-desc':
                return movies.sort((current, next) => {
                    return parseInt(current.year) > parseInt(next.year) ? -1 : 1
                });
            default:
                return movies;
        }
    },
};
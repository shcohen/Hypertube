const axios = require('axios');
const trendsSchema = require('../models/trends');
const {sortByName, sortByGenre, sortByRatings, sortByYear, getMovieInfo} = require('../utils/moviesUtils');
const {translateSentence, translateGenres} = require('../utils/languageUtils');
const {TMDB_API_KEY_V3} = require('../config/apiKey');

module.exports = {
    libraryManager: async (req, res) => {
        let {name, quantity, sorting} = req.body;
        let movies = [];

        if (name && name.length && quantity) {
            movies = await module.exports.findMovies(name, parseInt(quantity));
        } else {
            movies = await module.exports.getTrends();
        }
        if (sorting && sorting.length) {
            movies = await module.exports.sortMovies(movies, sorting);
        }
        await translateGenres(movies);
        return res.status(200).send(movies.sort((current, next) => {
            return current.title > next.title ? 1 : -1;
        }));
    },
    findMovies: async (name, quantity) => {
        let result = await axios.get(`https://yts.lt/api/v2/list_movies.json?query_term=${name}`);
        return result.data.data.movies && result.data.data.movies.length ?
            result.data.data.movies.slice(0, quantity).sort() : [];
    },
    findMovieInfo: async (req, res) => {
        let {id} = req.body;

        if (id !== undefined && id.length) {
            return res.status(200).send(await getMovieInfo(id));
        } else {
            return res.status(200).send(await translateSentence('No ID provided'));
        }
    },
    getTrends: async () => {
        let result = await axios.get(`https://yts.lt/api/v2/list_movies.json`);
        return result.data.data.movies.sort((current, next) => {
            return current.title > next.title ? 1 : -1;
        });
    },
    sortMovies: async (movies, sorting) => {
        if (sorting && sorting.name.length) {
            movies = await sortByName(movies, sorting.name.toLowerCase());
        } else if (sorting && sorting.genre.length && Array.isArray(sorting.genre)) {
            movies = await sortByGenre(movies, sorting.genre);
        } else if (sorting.rating && sorting.rating.length === 2 && Array.isArray(sorting.rating)) {
            movies = await sortByName(movies, sorting.rating);
        } else if (sorting.year && sorting.year.length === 2 && Array.isArray(sorting.year)) {
            movies = await sortByName(movies, sorting.year);
        }
        return movies;
    },
};
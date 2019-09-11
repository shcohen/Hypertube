const axios = require('axios');
const accentRemover = require('remove-accents');
const {filterByGenre, filterByRatings, filterByYear, sortMovies, getMovieInfo} = require('../utils/moviesUtils');
const {translateSentence, translateGenres} = require('../utils/languageUtils');
const {TMDB_API_KEY_V3} = require('../config/apiKey');

module.exports = {
    libraryManager: async (req, res) => {
        let {search, quantity, genres, ratingMin, ratingMax, yearMin, yearMax, sort} = req.body;
        let movies = [];

        if (search && search.length && quantity) {
            movies = await module.exports.findMovies(accentRemover(search));
        } else {
            movies = await module.exports.getTrends();
        }
        movies = await module.exports.filterMovies(movies, genres, ratingMin, ratingMax, yearMin, yearMax);
        await translateGenres(movies);
        movies = await sortMovies(sort, movies);
        return res.status(200).send(movies.slice(0, parseInt(quantity)));
    },
    findMovies: async (name) => {
        let result = await axios.get(`https://yts.lt/api/v2/list_movies.json?query_term=${name}`);
        return result.data.data.movies && result.data.data.movies.length ?
            result.data.data.movies: [];
    },
    findMovieInfo: async (req, res) => {
        let {IMDBid, YTSid} = req.query;

        if (IMDBid !== undefined && IMDBid.length && YTSid !== undefined && YTSid.length) {
            let data = await getMovieInfo(IMDBid, YTSid);
            return data ? res.status(200).send(data) : res.status(400).send('IMDB id doesn\'t match');
        } else {
            return res.status(400).send(await translateSentence('No ID provided'));
        }
    },
    getTrends: async () => {
        let result = await axios.get(`https://yts.lt/api/v2/list_movies.json`);
        return result.data ? result.data.data.movies : [];
    },
    filterMovies: async (movies, genres, ratingMin, ratingMax, yearMin, yearMax) => {
        if (genres && genres.length && Array.isArray(genres)) {
            movies = await filterByGenre(movies, genres);
        } if (ratingMin !== undefined && ratingMax !== undefined) {
            movies = await filterByRatings(movies, [ratingMin, ratingMax]);
        } if (yearMin !== undefined && yearMax !== undefined) {
            movies = await filterByYear(movies, [yearMin, yearMax]);
        }
        return movies;
    },
};
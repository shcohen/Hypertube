const axios = require('axios');
const accentRemover = require('remove-accents');
const popcornTime = require('../models/popcornTime');
const {getUserInfos} = require('../utils/jwt_check');
const {filterDuplicateMovies, filterByGenre, filterByRatings, filterByYear, sortMovies, getMovieInfo} = require('../utils/moviesUtils');
const {translateSentence, translateGenres} = require('../utils/languageUtils');
const {TMDB_API_KEY_V3} = require('../config/apiKey');

module.exports = {
    libraryManager: async (req, res) => {
        const connectedUser = await getUserInfos(req.headers.authorization);
        let {search, quantity, genres, ratingMin, ratingMax, yearMin, yearMax, sort} = req.body;
        let movies = [];

        if (connectedUser && connectedUser.acc_id.length) {
            if (search && search.length && quantity) {
                movies = await module.exports.findMovies(accentRemover(search));
            } else {
                movies = await module.exports.getTrends();
            }
            movies = await module.exports.filterMovies(movies, genres, ratingMin, ratingMax, yearMin, yearMax);
            await translateGenres(movies);
            movies = await sortMovies(sort, movies);
            return res.status(200).send(movies.slice(0, parseInt(quantity)));
        } else {
            res.status(403).send('Unauthorized');
        }
    },
    findMovies: async (name) => {
        let ytsMovies = await axios.get(`https://yts.lt/api/v2/list_movies.json?query_term=${name}`);
        let popcornTimeData = await popcornTime.find({});
        let popcornTimesMovies = [];
        popcornTimeData.map(movie => {
            movie.title.indexOf(name) !== -1 ? popcornTimesMovies = [...popcornTimesMovies, movie] : null;
        });
        return ytsMovies.data.data.movies && popcornTimesMovies ?
            await filterDuplicateMovies(ytsMovies.data.data.movies, popcornTimesMovies) : [];
    },
    findMovieInfo: async (req, res) => {
        const connectedUser = getUserInfos(req.headers.authorization);
        let {IMDBid, YTSid} = req.query;

        if (connectedUser && connectedUser.acc_id.length) {
            if (IMDBid !== undefined && IMDBid.length) {
                let data = await getMovieInfo(IMDBid, YTSid);
                return data ? res.status(200).send(data) : res.status(400).send('IMDB id doesn\'t match');
            } else {
                return res.status(400).send(await translateSentence('No ID provided'));
            }
        } else {
            res.status(403).send('Unauthorized');
        }
    },
    getTrends: async () => {
        let result = await axios.get(`https://yts.lt/api/v2/list_movies.json`);
        return result.data ? result.data.data.movies : [];
    },
    filterMovies: async (movies, genres, ratingMin, ratingMax, yearMin, yearMax) => {
        if (genres && genres.length && Array.isArray(genres)) {
            movies = await filterByGenre(movies, genres);
        }
        if (ratingMin !== undefined && ratingMax !== undefined) {
            movies = await filterByRatings(movies, [ratingMin, ratingMax]);
        }
        if (yearMin !== undefined && yearMax !== undefined) {
            movies = await filterByYear(movies, [yearMin, yearMax]);
        }
        return movies;
    },
};
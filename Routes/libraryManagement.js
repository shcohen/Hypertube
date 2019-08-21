const torrentSearch = require('torrent-search-api');
const accentRemover = require('remove-accents');
const axios = require('axios');
const trendsSchema = require('../models/trends');
const {getAllMovies, getImdbIdAndGenre, removeDuplicatesMovies, getMovieInfo, removeMoviesWithoutInfo} = require('../utils/moviesUtils');
const {TMDB_API_KEY_V3} = require('../config/apiKey');

module.exports = {
    libraryManager: async (req, res) => {
        let {name, quantity} = req.body;
        let movies = [];

        if (name && name.length && quantity) {
            movies = await module.exports.findMoviesTEST(name, parseInt(quantity));
        } else {
            movies = await module.exports.getTrends();
        }
        return res.status(200).send(movies);
    },
    findMoviesTEST: async (name, quantity) => {
        let result = await axios.get(`https://yts.lt/api/v2/list_movies.json?query_term=${name}`).data.data;
        if (result && result.length)
        return result.slice(0, quantity);
    },
    findMovies: async (name, quantity) => {
        if (name !== undefined && name.length) {
            name = await accentRemover(name.replace(/[:-]/gm, '').toLowerCase().trim());
            let search = await torrentSearch.search(name, 'Movies');
            let movies = search.filter(movie => {
                let found = movie.title.match(/^([A-Za-z:))\- .])+[1-9]{0,1}(?!0|9|8|7)(?!\()|^([0-9 ])+[A-Za-z:))\- .]*[1-9]{0,1}(?!0|9|8|7)(?!\()|[0-9]+(?=p)/gm);
                movie.title = found ? found[0].replace(/[:]/gm, '').replace(/[.-]/g, ' ').toLowerCase().trim() : undefined;
                console.log(movie.title);
                return movie.title;
            });
            await movies.sort((a, b) => {
                return b.seeds - a.seeds;
            });
            let result = await removeDuplicatesMovies(movies);
            await Promise.all(result.map(async movie => {
                await getMovieInfo(movie.title, movie);
            }));
            // result = await removeMoviesWithoutInfo(result);
            return result.slice(0, quantity);
        } else {
            return [];
        }
    },
    findMovieInfo: async (req, res) => {
        let {id} = req.body;

        if (id !== undefined && id.length) {
            return res.status(200).send(await getImdbInfo(id));
        } else {
            return res.status(200).send('Wrong data sent');
        }
    },
    getTrends: () => {
        return trendsSchema.find({}, (err, movies) => {
            return movies;
        });
    },
    updateTrends: () => {
        return trendsSchema.count(async (err, count) => {
            if (!err) {
                let query = await axios.get(`https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY_V3}`);
                if (query.data.results) {
                    query.data.results.map(async movie => {
                        let result = await torrentSearch.search(movie.title, 'Movies');
                        if (result.length) {
                            let info = await getImdbIdAndGenre(movie.id, movie.genre_ids);
                            if (count === 0) {
                                await trendsSchema.create({
                                    title: movie.title,
                                    poster: movie.poster_path,
                                    genre: info.genres,
                                    note: movie.vote_average,
                                    imdbID: info.imdbId,
                                    date: movie.release_date.substr(0, 4)
                                })
                            } else {
                                await trendsSchema.update({
                                    title: movie.title,
                                    poster: movie.poster_path,
                                    genre: info.genres,
                                    note: movie.vote_average,
                                    imdbID: info.imdbId,
                                    date: movie.release_date.substr(0, 4)
                                })
                            }
                        }
                    });
                } else {
                    return -1;
                }
            } else {
                return -1;
            }
        })
    },
};
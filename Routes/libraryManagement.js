const torrentSearch = require('torrent-search-api');
const accentRemover = require('remove-accents');
const axios = require('axios');
const trendsSchema = require('../models/trends');
const {getImdbInfo, removeDuplicatesMovies, getMovieInfo, removeMoviesWithoutInfo} = require('../utils/moviesUtils');
const {TMDB_API_KEY_V3} = require('../config/apiKey');

module.exports = {
    findMovies: async (req, res) => {
        let {name} = req.body;

        if (name !== undefined && name.length) {
            name = await accentRemover(name.replace(/[:-]/gm, '').toLowerCase().trim());
            let search = await torrentSearch.search(name, 'Movies');
            // let search2 = await torrentSearch.search(['ThePirateBay'], name, 'Videos');
            // search = [...search, ...search2];
            let movies = search.filter(movie => {
                let found = movie.title.match(/^([A-Za-z:))\- .])+[1-9]{0,1}(?!0|9|8|7)(?!\()|^([0-9 ])+[A-Za-z:))\- .]*[1-9]{0,1}(?!0|9|8|7)(?!\()|[0-9]+(?=p)/gm);
                movie.title = found ? found[0].replace(/[:]/gm, '').replace(/[.-]/g, ' ').toLowerCase().trim() : undefined;
                return movie.title;
            });
            await movies.sort((a, b) => {
                return b.seeds - a.seeds;
            });
            let result = await removeDuplicatesMovies(movies);
            await Promise.all(result.map(async movie => {
                await getMovieInfo(movie.title, movie);
            }));
            result = await removeMoviesWithoutInfo(result);
            return res.status(200).send(result);
        } else {
            return res.status(200).send('Wrong data sent');
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
    getTrends: async (req, res) => {
        return res.status(200).send('OK');
    },
    updateTrends: () => {
        return trendsSchema.count(async (err, count) => {
            if (!err) {
                let query = await axios.get(`https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY_V3}`);
                if (query.data.results) {
                    query.data.results.map(async el => {
                        let movie = await getImdbInfo(el.id);
                        if (count === 0) {
                            await trendsSchema.create({
                                title: movie.Title,
                                poster: movie.Poster,
                                genre: movie.Genre,
                                note: movie.imdbRating,
                                imdbID: movie.imdbID,
                                release_date: movie.Released
                            })
                        } else {
                            await trendsSchema.update({
                                title: movie.Title,
                                poster: movie.Poster,
                                genre: movie.Genre,
                                note: movie.imdbRating,
                                imdbID: movie.imdbID,
                                release_date: movie.Released
                            })
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
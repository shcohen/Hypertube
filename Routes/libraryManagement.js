const torrentSearch = require('torrent-search-api');
const accentRemover = require('remove-accents');
const axios = require('axios');
const {getImdbInfo, epurMovieObject, removeTitleAndQualityDoublons, removeDuplicatesMovies, getMovieInfo, removeMoviesWithoutInfo} = require('../utils/moviesUtils');
const {TMDB_API_KEY_V3} = require('../config/apiKey');

module.exports = {
    findMovies: async (req, res) => {
        let {name} = req.body;

        if (name !== undefined && name.length) {
            name = await accentRemover(name.replace(/[:-]/gm, '').toLowerCase());
            let search = await torrentSearch.search(name, 'Movies');
            // let search2 = await torrentSearch.search(name, 'Video');
            // search = [...search, ...search2];
            let movies = search.filter(movie => {
                let found = movie.title.match(/^([A-Za-z:))\- .])+[1-9]{0,1}(?!0|9|8|7)(?!\()|^([0-9 ])+[A-Za-z:))\- .]*[1-9]{0,1}(?!0|9|8|7)(?!\()|[0-9]+(?=p)/gm);
                movie.title = found ? found[0].replace(/[:]/gm, '').replace(/[.-]/g, ' ').trim() : undefined;
                name = name.toLowerCase().trim();
                return movie.title ? movie.title.toLowerCase().trim() : undefined;
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
        let {search} = req.body;

        if (search !== undefined && search.length) {
            return res.status(200).send(search);
        } else {
            return res.status(200).send('Wrong data sent');
        }
    }
};
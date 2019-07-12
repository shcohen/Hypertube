const torrentSearch = require('torrent-search-api');
const accentRemover = require('remove-accents');
const axios = require('axios');
const {getImdbID, epurMovieObject, removeTitleAndQualityDoublons} = require('../utils/moviesUtils');
const {TMDB_API_KEY_V3} = require('../config/apiKey');

module.exports = {
    findMovies: async (req, res) => {
        let {name} = req.body;

        if (name !== undefined && name.length) {
            name = await accentRemover(name);
            const search = await torrentSearch.search(name, 'Movies');
            let movies = search.filter(movie => {
                name = name.toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, "");
                return !movie.title.toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, "").indexOf(name);
            });
            await Promise.all(movies.map(async movie => {
                let found = movie.title.match(/^([A-Za-z:))\- .])+[1-9]{0,1}(?!0|9|8|7)(?!\()|^([0-9 ])+[A-Za-z:))\- .]*[1-9]{0,1}(?!0|9|8|7)(?!\()|[0-9]+(?=p)/gm);
                movie.title = found[0] ? found[0].replace(/[:]/gm, '').replace(/[.-]/g, ' ').trim() : undefined;
                movie.torrentInfo = {quality: found[1] ? found[1] : undefined, magnet_link: await torrentSearch.getMagnet(movie)};
            }));
            let result = await removeTitleAndQualityDoublons(movies);
            await Promise.all(result.map(async movie => {
                await epurMovieObject(movie);
                movie.imdbID = await getImdbID(movie.title);
            }));
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
    },
};
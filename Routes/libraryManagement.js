const torrentSearch = require('torrent-search-api');
const accentRemover = require('remove-accents');
const axios = require('axios');
const {getImdbInfo, epurMovieObject, removeTitleAndQualityDoublons} = require('../utils/moviesUtils');
const {TMDB_API_KEY_V3} = require('../config/apiKey');

module.exports = {
    findMovies: async (req, res) => {
        let {name} = req.body;

        if (name !== undefined && name.length) {
            name = await accentRemover(name);
            let search = await torrentSearch.search(name, 'Movies');
            let search2 = await torrentSearch.search(name, 'Video');
            search = [...search, ...search2];
            let movies = search.filter(movie => {
                name = name.toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, "");
                return !movie.title.toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, "").indexOf(name);
            });
            await movies.sort((a, b) => {
                return b.seeds - a.seeds;
            });
            await Promise.all(movies.map(async movie => {
                let found = movie.title.match(/^([A-Za-z:))\- .])+[1-9]{0,1}(?!0|9|8|7)(?!\()|^([0-9 ])+[A-Za-z:))\- .]*[1-9]{0,1}(?!0|9|8|7)(?!\()|[0-9]+(?=p)/gm);
                movie.title = found ? found[0].replace(/[:]/gm, '').replace(/[.-]/g, ' ').trim() : undefined;
                movie.quality = found ? found[1] : undefined;
            }));
            let result = await removeTitleAndQualityDoublons(movies);
            await Promise.all(result.map(async movie => {
                epurMovieObject(movie);
                movie.imdbInfo = await getImdbInfo(movie.title);
            }));
            return res.status(200).send(movies);
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
const torrentSearch = require('torrent-search-api');
const {removeTitleAndQualityDoublons, regroupTorrent} = require('../utils/moviesUtils');

module.exports = {
    findTorrent: async (req, res) => {
        let {title} = req.body;

        let movies = await torrentSearch.search(title, 'Movies');
        await movies.sort((a, b) => {
            return b.seeds - a.seeds;
        });
        await Promise.all(movies.map(async movie => {
            let found = await movie.title.match(/[0-9]+(?=p)/gm);
            movie.title = title;
            movie.torrent = found ? [{ quality: found[0], magnet: await torrentSearch.getMagnet(movie) }] : undefined;
        }));
        let result = await removeTitleAndQualityDoublons(movies);
        res.status(200).send(await regroupTorrent(result));
    }
};
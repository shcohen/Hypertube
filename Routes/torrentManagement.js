const torrentSearch = require('torrent-search-api');
const torrentStream = require('torrent-stream');
const md5 = require('reverse-md5');
const {removeTitleAndQualityDoublons, regroupTorrent} = require('../utils/moviesUtils');

module.exports = {
    findTorrent: async (req, res) => {
        let {title} = req.body;

        if (title !== undefined && title.length) {
            let movies = await torrentSearch.search(title, 'Movies');
            await movies.sort((a, b) => {
                return b.seeds - a.seeds;
            });
            await Promise.all(movies.map(async movie => {
                let found = await movie.title.match(/[0-9]+(?=p)/gm);
                movie.title = title;
                movie.torrent = found ? [{quality: found[0], magnet: await torrentSearch.getMagnet(movie)}] : undefined;
            }));
            let result = await removeTitleAndQualityDoublons(movies);
            res.status(200).send(await regroupTorrent(result));
        } else {
            return res.status(200).send('Wrong data sent');
        }
    },
    torrentManager: async (req, res) => {
        let {magnet} = req.params;
        let {range} = req.headers;

        if (magnet !== undefined && magnet.length || range === undefined) {
            let decoded = new Buffer(magnet, 'base64').toString();
            let parts = range.replace(/bytes=/,"").split("-");
            let start = parts[0];
            let end = parts[1] ? parts[1] : undefined;
            // let engine = torrentStream(magnet);
            // engine.on('ready', () => {
            //     engine.files.forEach(function(file) {
            //         console.log('filename:', file.name);
                    // let stream = file.createReadStream();
                    // let data = '';
                    // stream.on('data', chunk => {
                    //     data += chunk
                    // });
                    // stream.on('end', () => {
                    //     console.log(data)
                    // })
                // });
            // });
            // engine.on('download', piece => {
            //   console.log('Piece: ', piece);
            // });
        } else {
            return res.status(200).send('Wrong data sent');
        }
    },
};
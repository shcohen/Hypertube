const torrentSearch = require('torrent-search-api');
const crypto = require('crypto');
const mime = require('mime');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath('/usr/local/Cellar/ffmpeg/HEAD-4373bb4_1/bin/ffmpeg');
const pump = require('pump');
const torrentStream = require('torrent-stream');
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
                movie.torrent = [{quality: found ? found[0] : undefined, magnet: await torrentSearch.getMagnet(movie)}];
            }));
            let result = await removeTitleAndQualityDoublons(movies);
            res.status(200).send(await regroupTorrent(result));
        } else {
            return res.status(200).send('Wrong data sent');
        }
    },
    streamVideoWithConversion: (res, file, range, engine) => {
        console.log('Started video conversion');
        let parts = range.replace(/bytes=/, "").split("-");
        console.log('Parts extracted !', parts);
        let start = parts ? parseInt(parts[0], 10) : 0;
        console.log('Start extracted !', start);
        let end = parts && parts[1] ? parseInt(parts[1], 10) : file.length - 1;
        console.log('End extracted !', end);
        let stream = file.createReadStream({start, end});
        console.log('Stream created !');
        let video = ffmpeg(stream)
            .videoCodec('libx264')
            .audioCodec('aac')
            .format('mp4')
            .inputOption(['-movflags frag_keyframe+faststart'])
            .on('progress', function (progress) {
                console.log('Processing: ' + progress.percent + '% done');
            })
            .on('error', function (err, stdout, stderr) {
                console.log('Cannot process video: ' + err.message);
                console.log("ffmpeg stdout:\n" + stdout);
                console.log("ffmpeg stderr:\n" + stderr);
            })
            .on('end', function () {
                console.log('Processing finished successfully');
            });
        res.on('close', () => {
            engine.remove(true, () => { console.log('Engine cleared') } );
            engine.destroy();
            console.log('Engine cleared !');
        });
        const head = {
            'Accept-Ranges': 'bytes',
            'Content-Range': `bytes ${start}-${end}/${file.length}`,
            'Content-Length': parseInt(end - start) + 1,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        console.log('Header writted !');
        pump(video, res);
    },
    streamVideoWithoutConversion: (res, file, range, engine) => {
        console.log('Started streaming process !');
        let parts = range.replace(/bytes=/, "").split("-");
        console.log('Parts extracted !', parts);
        let start = parts ? parseInt(parts[0], 10) : 0;
        console.log('Start extracted !', start);
        let end = parts && parts[1] ? parseInt(parts[1], 10) : file.length - 1;
        console.log('End extracted !', end);
        let stream = file.createReadStream({start, end});
        res.on('close', () => {
            engine.remove(true, () => { console.log('Engine cleared') } );
            engine.destroy();
            console.log('Engine cleared !');
        });
        const head = {
            'Accept-Ranges': 'bytes',
            'Content-Range': `bytes ${start}-${end}/${file.length}`,
            'Content-Length': parseInt(end - start) + 1,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        console.log('Header writted !');
        pump(stream, res);
    },
    torrentDownloader: (res, range, directoryName, decoded, options) => {
        let engine = torrentStream(decoded, options);
        let fileSize;
        engine.on('ready', () => {
            engine.files.forEach(file => {
                if (mime.getType(file.path) === 'video/mp4' || mime.getType(file.path) === 'video/ogg' || mime.getType(file.path) === 'video/webm') {
                    file.select();
                    module.exports.streamVideoWithoutConversion(res, file, range, engine);
                } else if ((new RegExp(/video/)).test(mime.getType(file.path))) {
                    file.select();
                    module.exports.streamVideoWithConversion(res, file, range, engine);
                } else {
                    file.deselect();
                }
            });
            engine.on('torrent', () => {
                console.log('data fetched');
            });
            engine.on('download', () => {
                console.log(Math.round((engine.swarm.downloaded / fileSize) * 100) + '% downloaded');
            })
        });
    },
    torrentManager: async (req, res) => {
        let {magnet} = req.params;
        let {range} = req.headers;

        if (magnet !== undefined && magnet.length || range === undefined) {
            let decoded = new Buffer(magnet, 'base64').toString();
            if ((new RegExp(/magnet:\?xt=urn:.+/)).test(decoded)) {
                let directoryName = crypto.createHash('md5').update(decoded).digest('hex');
                let options = {
                    connections: 100,
                    uploads: 10,
                    verify: true,
                    dht: true,
                    tracker: true,
                    path: `/tmp/torrentStream/${directoryName}`
                };
                module.exports.torrentDownloader(res, range, directoryName, decoded, options);
            } else {
                return res.status(200).send('Wrong magnet link !')
            }
        } else {
            return res.status(200).send('Wrong data sent');
        }
    },
};
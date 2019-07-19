const torrentSearch = require('torrent-search-api');
const crypto = require('crypto');
const mime = require('mime');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
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
                movie.torrent = found ? [{quality: found[0], magnet: await torrentSearch.getMagnet(movie)}] : undefined;
            }));
            let result = await removeTitleAndQualityDoublons(movies);
            res.status(200).send(await regroupTorrent(result));
        } else {
            return res.status(200).send('Wrong data sent');
        }
    },
    streamVideoWithConversion: (res, file, fileSize, start, end) => {
        let stream = file.createReadStream({start, end});
        let video = ffmpeg(stream)
            .videoCodec('libvpx')
            .audioCodec('libvorbis')
            .format('mp4')
            .on('progress', function (progress) {
                console.log('Processing: ' + progress.percent + '% done');
            })
            .on('error', function (err) {
                console.log('Cannot process video: ' + err.message);
            })
            .on('end', function () {
                console.log('Processing finished successfully');
            });
        pump(video, res);
    },
    streamVideoWithoutConversion: (res, file, fileSize, start, end, chunksize) => {
        console.log('Streaming initialized...');
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        console.log('Header writted !');
        let stream = file.createReadStream(file, {start, end});
        console.log('Stream created !');
        stream.pipe(res);
        console.log('Stream pumped !');
    },
    torrentDownloader: (res, range, directoryName, decoded, options) => {
        let engine = torrentStream(decoded, options);
        let parts = range.replace(/bytes=/, "").split("-");
        let start = parseInt(parts[0], 10);
        let data = '';
        let fileSize;
        engine.on('ready', () => {
            engine.files.forEach(file => {
                if (mime.getType(file.path) === 'video/mp4' || mime.getType(file.path) === 'video/ogg' || mime.getType(file.path) === 'video/webm') {
                    console.log('Valid mimetype !');
                    fileSize = file.length;
                    let end = parts[1] ? parseInt(parts[1]) : fileSize - 1;
                    const chunksize = (end - start) + 1;
                    module.exports.streamVideoWithoutConversion(res, file, fileSize, start, end, chunksize);
                } else if ((new RegExp(/video/)).test(mime.getType(file.path))) {
                    fileSize = file.length;
                    let end = parts[1] ? parseInt(parts[1]) : fileSize - 1;
                    const chunksize = (end - start) + 1;
                    module.exports.streamVideoWithConversion(res, file, fileSize, start, end, chunksize);
                } else {
                    file.deselect();
                }
                // let stream = file.createReadStream();
                // stream.on('data', chunk => {
                //     data += chunk;
                // });
                // stream.on('end', () => {
                //     console.log(data);
                // })
            });
            engine.on('download', () => {
                console.log(engine.swarm.downloaded, fileSize);
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
                    trackers: [
                        'udp://tracker.openbittorrent.com:80',
                        'udp://tracker.ccc.de:80',
                        'udp://public.popcorn-tracker.org:6969/announce'
                    ],
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
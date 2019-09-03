const crypto = require('crypto');
const mime = require('mime');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath('/Users/yadouble/.brew/Cellar/ffmpeg/4.1.4_1/bin/ffmpeg');
const pump = require('pump');
const torrentStream = require('torrent-stream');
const {isMovieDownloaded} = require('../utils/moviesUtils');
const {subtitleManager} = require('./subtitleManagement');

module.exports = {
    streamVideoFromFile: (res, file, parts, start, end, range, directoryName) => {
        console.log('Started streaming process from file !');
        let stream = fs.createReadStream(`/tmp/torrentStream/${directoryName}/${file.path}`, {start, end});
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
    streamVideoWithConversion: (res, file, parts, start, end) => {
        let stream = file.createReadStream({start, end});
        console.log('Stream created !');
        let video = ffmpeg(stream)
            .format('webm')
            .videoCodec('libvpx')
            .audioCodec('libvorbis')
            .videoBitrate(1024)
            .audioBitrate(128)
            .outputOption(['-cpu-used 2',
                '-deadline realtime',
                '-error-resilient 1',
                '-threads 4'])
            .on('progress', () => {
                console.log('Processing...');
            })
            .on('error', function (err, stdout, stderr) {
                console.log('Cannot process video: ' + err.message);
                console.log("ffmpeg stdout:\n" + stdout);
                console.log("ffmpeg stderr:\n" + stderr);
            })
            .on('end', function () {
                console.log('Processing finished successfully');
            }
            .saveToFile('/tmp/torrentStream/'));
        const head = {
            'Cache-Control': 'no-cache, no-store',
            'Content-Length': file.length,
            'Content-Type': 'video/webm'
        };
        res.writeHead(200, head);
        console.log('Header writted !');
        pump(video, res);
    },
    streamVideoWithoutConversion: (res, file, parts, start, end) => {
        let stream = file.createReadStream({start, end});
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
    streamingCenter: (res, file, range, directoryName, filePath, movieId, options) => {
        let parts = range.replace(/bytes=/, "").split("-");
        let start = parts ? parseInt(parts[0], 10) : 0;
        let end = parts && parts[1] ? parseInt(parts[1], 10) : file.length - 1;
        if (parts && parts.length && start && start.length && end && end.length) {
            if (options.convert === false && options.downloaded === false) {
                module.exports.streamVideoWithoutConversion(res, file, parts, start, end)
            } else if (options.convert === true) {
                module.exports.streamVideoWithConversion(res, file, parts, start, end);
            } else if (options.convert === false && options.downloaded === true) {
                module.exports.streamVideoFromFile(res, file, parts, start, end, directoryName);
            }
        }
    },
    torrentDownloader: (res, range, directoryName, magnet, movieId, options) => {
        let engine = torrentStream(magnet, options);
        let fileSize;
        engine.on('ready', () => {
            engine.files.forEach(async file => {
                let mimeType = mime.getType(file.path);
                if ((new RegExp(/^video\//)).test(mimeType)) {
                    let filePath = '/tmp/torrentStream/' + directoryName + '/' + file.path;
                    if (await isMovieDownloaded(file, filePath) === true) {
                        console.log('TORRENT FULLY DOWNLOADED');
                        module.exports.streamingCenter(res, file, range, directoryName, filePath, movieId, {
                            convert: false,
                            downloaded: true
                        });
                    } else {
                        if (mimeType === 'video/mp4' || mimeType === 'video/ogg' || mimeType === 'video/webm') {
                            fileSize = file.length;
                            subtitleManager(movieId);
                            module.exports.streamingCenter(res, file, range, directoryName, filePath, movieId, {
                                convert: false,
                                downloaded: false
                            });
                        } else {
                            fileSize = file.length;
                            subtitleManager(movieId);
                            module.exports.streamVideoWithConversion(res, file, range, directoryName);
                        }
                    }
                } else {
                    console.log('DESELECTED');
                    file.deselect();
                }
            });
            engine.on('download', () => {
                console.log(Math.round((engine.swarm.downloaded / fileSize) * 100) + '% downloaded');
            });
            engine.on('idle', () => {
                console.log('Movie fully downloaded !');
            })
        });
    },
    torrentManager: async (req, res) => {
        let {movieId, movieNameEncoded, movieHash} = req.query;
        let {range} = req.headers;

        if (movieId && movieId.length && movieNameEncoded !== undefined && movieNameEncoded.length && movieHash
            && movieHash.length || range === undefined) {
            let magnet = `magnet:?xt=urn:btih:${movieHash}&dn=${movieNameEncoded}&tr=http://track.one:1234/announce&tr=udp://track.two:80`;
            if ((new RegExp(/magnet:\?xt=urn:.+/)).test(magnet)) {
                let directoryName = crypto.createHash('md5').update(magnet).digest('hex');
                let options = {
                    connections: 100,
                    uploads: 10,
                    verify: true,
                    dht: true,
                    tracker: true,
                    trackers: [
                        'udp://open.demonii.com:1337/announce',
                        'udp://tracker.openbittorrent.com:80',
                        'udp://tracker.coppersurfer.tk:6969',
                        'udp://glotorrents.pw:6969/announce',
                        'udp://tracker.opentrackr.org:1337/announce',
                        'udp://torrent.gresille.org:80/announce',
                        'udp://p4p.arenabg.com:1337',
                        'udp://tracker.leechers-paradise.org:6969',
                    ],
                    path: `/tmp/torrentStream/${directoryName}`
                };
                module.exports.torrentDownloader(res, range, directoryName, magnet, movieId, options);
            } else {
                return res.status(400).send('Wrong magnet link !')
            }
        } else {
            return res.status(400).send('Wrong data sent');
        }
    },
};
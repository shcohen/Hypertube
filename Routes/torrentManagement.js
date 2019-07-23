const torrentSearch = require('torrent-search-api');
const axios = require('axios');
const crypto = require('crypto');
const mime = require('mime');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath('/Users/yadouble/.brew/Cellar/ffmpeg/4.1.4_1/bin/ffmpeg');
const pump = require('pump');
const torrentStream = require('torrent-stream');
const OS = require('opensubtitles-api');
const OpenSubtitles = new OS({useragent: 'TemporaryUserAgent', ssl: true});
const subtitleSchema = require('../models/subtitles');
const {removeTitleAndQualityDoublons, regroupTorrent, verifyTitle} = require('../utils/moviesUtils');

module.exports = {
    findTorrent: async (req, res) => {
        let {title} = req.body;

        if (title !== undefined && title.length) {
            if (await verifyTitle(title)) {
                let search = await torrentSearch.search(title, 'Movies');
                if (search.length) {
                    await search.sort((a, b) => {
                        return b.seeds - a.seeds;
                    });
                    let movies = search.filter(movie => {
                        let found = movie.title.match(/^([A-Za-z:))\- .])+[1-9]{0,1}(?!0|9|8|7)(?!\()|^([0-9 ])+[A-Za-z:))\- .]*[1-9]{0,1}(?!0|9|8|7)(?!\()/gm);
                        let torrentName = found ? found[0].replace(/[:]/gm, '').replace(/[.-]/g, ' ').toLowerCase().trim() : undefined;
                        let tmpTitle = title.replace(/[:]/gm, '').replace(/[.-]/g, ' ').toLowerCase().trim();
                        return torrentName ? torrentName === tmpTitle : undefined;
                    });
                    await Promise.all(movies.map(async movie => {
                        let found = await movie.title.match(/[0-9]+(?=p)/gm);
                        movie.title = title;
                        movie.torrent = [{
                            quality: found ? found[0] : undefined,
                            magnet: await torrentSearch.getMagnet(movie)
                        }];
                    }));
                    let result = await removeTitleAndQualityDoublons(movies);
                    res.status(200).send(await regroupTorrent(result));
                } else {
                    return res.status(200).send('Wrong data sent');
                }
            } else {
                return res.status(200).send('Wrong data sent');
            }
        } else {
            return res.status(200).send('Wrong data sent');
        }
    },
    streamVideoWithConversion: (res, file, range) => {
        console.log(file.path);
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
            });
        // .saveToFile('/tmp/torrentStream/');
        const head = {
            'Cache-Control': 'no-cache, no-store',
            'Content-Length': file.length,
            'Content-Type': 'video/webm'
        };
        res.writeHead(200, head);
        console.log('Header writted !');
        pump(video, res);
    },
    streamVideoWithoutConversion: (res, file, range, srtFile, directoryName) => {
        console.log('Started streaming process !');
        let parts = range.replace(/bytes=/, "").split("-");
        console.log('Parts extracted !', parts);
        let start = parts ? parseInt(parts[0], 10) : 0;
        console.log('Start extracted !', start);
        let end = parts && parts[1] ? parseInt(parts[1], 10) : file.length - 1;
        console.log('End extracted !', end);
        let stream = file.createReadStream({start, end});
        // let video = ffmpeg(stream)
        //     .outputOptions(
        //         `-vf subtitles=/tmp/torrentStream/${directoryName}/${srtFile}`
        //     )
        //     .on('error', function(err, stdin, stdout) {
        //         console.log('Error: ' + err.message);
        //         console.log(stdin);
        //         console.log(stdout);
        //     })
        //     .save('/tmp/torrentStream/' + directoryName + '/' + file.path);
        // const head = {
        //     'Cache-Control': 'no-cache, no-store',
        //     'Content-Length': file.length,
        //     'Content-Type': 'video/webm'
        // };
        // res.writeHead(200, head);
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
    getSubtitles: (res, file, directoryName) => {
        let fileName = file.name.split('.');
        fileName.pop();
        fileName = fileName.join().replace(/[,]/gm, '.') + '.FR.srt';
        OpenSubtitles.search({
            sublanguageid: 'fre',
            path: '/tmp/torrentStream/' + directoryName + '/' + file.path,
            filename: file.name,
        }).then(async data => {
            let srt = await axios.get(data.fr.url);
            fs.readdir('/tmp/torrentStream/' + directoryName, (err, dir) => {
                fs.writeFile('/tmp/torrentStream/' + directoryName + '/' + dir[0] + '/' + fileName, srt.data, () => {
                    console.log('File created !');
                });
            });
        });
    },
    isMovieDownloaded: (file, filePath) => {
        fs.stat(filePath, (err, stats) => {
            if (err) return false;
            return stats.size === file.length;
        })
    },
    streamingCenter: (res, file, range, directoryName, options) => {
        if (options.convert === false && options.subs.status === false) {
            module.exports.streamVideoWithoutConversion(res, file, range, 0, 0)
        } else if (options.convert === false && options.subs.status === true) {

        }
    },
    torrentDownloader: (res, range, directoryName, decoded, movieTitle, options, srt) => {
        let engine = torrentStream(decoded, options);
        let fileSize;
        engine.on('ready', () => {
            engine.files.forEach(async file => {
                let mimeType = mime.getType(file.path);
                if (mimeType === 'video/mp4' || mimeType === 'video/ogg' || mimeType === 'video/webm') {
                    let filePath = '/tmp/torrentStream/' + directoryName + '/' + file.path;
                    let mongoData = await subtitleSchema.findOne({film: movieTitle, language: srt.language});
                    console.log(mongoData);
                    if (module.exports.isMovieDownloaded(file, filePath)) {
                        console.log('TORRENT FULLY DOWN');
                    } else {
                        console.log(file.name);
                        fileSize = file.length;
                        if (fs.existsSync(filePath)) {
                            let mongoData = await subtitleSchema.findOne({film: movieTitle, language: srt.language});
                            console.log(mongoData);
                        }
                    }
                    module.exports.streamingCenter(res, file, range, directoryName, {convert: false, subs: srt});
                } else if ((new RegExp(/video/)).test(mimeType)) {
                    fileSize = file.length;
                    // module.exports.getSubtitles(res, file, directoryName);
                    // module.exports.streamVideoWithConversion(res, file, range, directoryName);
                } else if (!((new RegExp(/video/)).test(mimeType))) {
                    console.log('DESELECTED');
                    file.deselect();
                }
            });
            engine.on('download', () => {
                console.log(Math.round((engine.swarm.downloaded / fileSize) * 100) + '% downloaded');
            });
        });
    },
    torrentManager: async (req, res) => {
        let {movieTitle, magnet} = req.params;
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
                module.exports.torrentDownloader(res, range, directoryName, decoded, movieTitle, options, {
                    status: false,
                    language: 'fre'
                });
            } else {
                return res.status(200).send('Wrong magnet link !')
            }
        } else {
            return res.status(200).send('Wrong data sent');
        }
    },
};
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
    streamVideoFromFile: (res, file, range, directoryName) => {
        let parts = range.replace(/bytes=/, "").split("-");
        let start = parts ? parseInt(parts[0], 10) : 0;
        let end = parts && parts[1] ? parseInt(parts[1], 10) : file.length - 1;
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
    streamVideoWithConversion: (res, file, range) => {
        let parts = range.replace(/bytes=/, "").split("-");
        let start = parts ? parseInt(parts[0], 10) : 0;
        let end = parts && parts[1] ? parseInt(parts[1], 10) : file.length - 1;
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
    streamVideoWithoutConversion: (res, file, range) => {
        let parts = range.replace(/bytes=/, "").split("-");
        let start = parts ? parseInt(parts[0], 10) : 0;
        let end = parts && parts[1] ? parseInt(parts[1], 10) : file.length - 1;
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
        // let parts = range.replace(/bytes=/, "").split("-");
        // let start = parts ? parseInt(parts[0], 10) : 0;
        // let end = parts && parts[1] ? parseInt(parts[1], 10) : file.length - 1;
        // if (parts !== undefined && parts.length && start !== undefined && end !== undefined) {
            console.log('salut');
            if (options.convert === false && options.downloaded === false) {
                module.exports.streamVideoWithoutConversion(res, file, range)
            } else if (options.convert === true) {
                module.exports.streamVideoWithConversion(res, file, range);
            } else if (options.convert === false && options.downloaded === true) {
                module.exports.streamVideoFromFile(res, file, range, directoryName);
            }
        // }
    },
    torrentDownloader: (res, range, directoryName, magnet, movieId, options) => {
        let engine = torrentStream(magnet, options);
        let fileSize;
        engine.on('ready', () => {
            engine.files.forEach(async file => {
                let mimeType = mime.getType(file.path);
                if ((new RegExp(/^video\//)).test(mimeType)) {
                    file.select();
                    console.log('File selected !');
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
                            // subtitleManager(movieId);
                            module.exports.streamingCenter(res, file, range, directoryName, filePath, movieId, {
                                convert: false,
                                downloaded: false
                            });
                        } else {
                            fileSize = file.length;
                            // subtitleManager(movieId);
                            module.exports.streamVideoWithConversion(res, file, range, directoryName);
                        }
                    }
                } else {
                    file.deselect();
                    console.log('File deselected !');
                }
            });
            engine.on('download', () => {
                console.log(Math.round((engine.swarm.downloaded / fileSize) * 100) + '% downloaded');
            });
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
    // streamVideoFromFile: (res, file, range, directoryName) => {
    //     console.log('Started streaming process from file !');
    //     let parts = range.replace(/bytes=/, "").split("-");
    //     console.log('Parts extracted !', parts);
    //     let start = parts ? parseInt(parts[0], 10) : 0;
    //     console.log('Start extracted !', start);
    //     let end = parts && parts[1] ? parseInt(parts[1], 10) : file.length - 1;
    //     console.log('End extracted !', end);
    //     let stream = fs.createReadStream(`/tmp/torrentStream/${directoryName}/${file.path}`, {start, end});
    //     const head = {
    //         'Accept-Ranges': 'bytes',
    //         'Content-Range': `bytes ${start}-${end}/${file.length}`,
    //         'Content-Length': parseInt(end - start) + 1,
    //         'Content-Type': 'video/mp4',
    //     };
    //     res.writeHead(206, head);
    //     console.log('Header writted !');
    //     pump(stream, res);
    // },
    // streamVideoWithConversion: (res, file, range) => {
    //     console.log(file.path);
    //     console.log('Started video conversion');
    //     let parts = range.replace(/bytes=/, "").split("-");
    //     console.log('Parts extracted !', parts);
    //     let start = parts ? parseInt(parts[0], 10) : 0;
    //     console.log('Start extracted !', start);
    //     let end = parts && parts[1] ? parseInt(parts[1], 10) : file.length - 1;
    //     console.log('End extracted !', end);
    //     let stream = file.createReadStream({start, end});
    //     console.log('Stream created !');
    //     let video = ffmpeg(stream)
    //         .format('webm')
    //         .videoCodec('libvpx')
    //         .audioCodec('libvorbis')
    //         .videoBitrate(1024)
    //         .audioBitrate(128)
    //         .outputOption(['-cpu-used 2',
    //             '-deadline realtime',
    //             '-error-resilient 1',
    //             '-threads 4'])
    //         .on('progress', () => {
    //             console.log('Processing...');
    //         })
    //         .on('error', function (err, stdout, stderr) {
    //             console.log('Cannot process video: ' + err.message);
    //             console.log("ffmpeg stdout:\n" + stdout);
    //             console.log("ffmpeg stderr:\n" + stderr);
    //         })
    //         .on('end', function () {
    //             console.log('Processing finished successfully');
    //         });
    //     // .saveToFile('/tmp/torrentStream/');
    //     const head = {
    //         'Cache-Control': 'no-cache, no-store',
    //         'Content-Length': file.length,
    //         'Content-Type': 'video/webm'
    //     };
    //     res.writeHead(200, head);
    //     console.log('Header writted !');
    //     pump(video, res);
    // },
    // streamVideoWithoutConversion: (res, file, range, srtFile, directoryName) => {
    //     console.log('Started streaming process !');
    //     let parts = range.replace(/bytes=/, "").split("-");
    //     console.log('Parts extracted !', parts);
    //     let start = parts ? parseInt(parts[0], 10) : 0;
    //     console.log('Start extracted !', start);
    //     let end = parts && parts[1] ? parseInt(parts[1], 10) : file.length - 1;
    //     console.log('End extracted !', end);
    //     let stream = file.createReadStream({start, end});
    //     // let video = ffmpeg(stream)
    //     //     .outputOptions(
    //     //         `-vf subtitles=/tmp/torrentStream/${directoryName}/${srtFile}`
    //     //     )
    //     //     .on('error', function(err, stdin, stdout) {
    //     //         console.log('Error: ' + err.message);
    //     //         console.log(stdin);
    //     //         console.log(stdout);
    //     //     })
    //     //     .save('/tmp/torrentStream/' + directoryName + '/' + file.path);
    //     // const head = {
    //     //     'Cache-Control': 'no-cache, no-store',
    //     //     'Content-Length': file.length,
    //     //     'Content-Type': 'video/webm'
    //     // };
    //     // res.writeHead(200, head);
    //     const head = {
    //         'Accept-Ranges': 'bytes',
    //         'Content-Range': `bytes ${start}-${end}/${file.length}`,
    //         'Content-Length': parseInt(end - start) + 1,
    //         'Content-Type': 'video/mp4',
    //     };
    //     res.writeHead(206, head);
    //     console.log('Header writted !');
    //     pump(stream, res);
    // },
    // isMovieDownloaded: async (file, filePath) => {
    //     try {
    //         fs.accessSync(filePath);
    //         let fileStat = fs.statSync(filePath);
    //         return fileStat.size === file.length;
    //     } catch (err) {
    //         return false;
    //     }
    // },
    // streamingCenter: (res, file, range, directoryName, filePath, movieId, options) => {
    //     if (options.convert === false && options.downloaded === false) {
    //         module.exports.streamVideoWithoutConversion(res, file, range, 0, 0)
    //     } else if (options.convert === true) {
    //         module.exports.streamVideoWithConversion(res, file, range);
    //     } else if (options.convert === false && options.downloaded === true) {
    //         module.exports.streamVideoFromFile(res, file, range, directoryName);
    //     }
    // },
    // torrentDownloader: (res, range, directoryName, decoded, movieId, options, srt) => {
    //     let engine = torrentStream(decoded, options);
    //     let fileSize;
    //     engine.on('ready', () => {
    //         engine.files.forEach(async file => {
    //             let mimeType = mime.getType(file.path);
    //             if (mimeType === 'video/mp4' || mimeType === 'video/ogg' || mimeType === 'video/webm') {
    //                 let filePath = '/tmp/torrentStream/' + directoryName + '/' + file.path;
    //                 if (await module.exports.isMovieDownloaded(file, filePath) === true) {
    //                     console.log('TORRENT FULLY DOWNLOADED');
    //                     module.exports.streamingCenter(res, file, range, directoryName, filePath, movieId, {
    //                         convert: false,
    //                         subs: srt,
    //                         downloaded: true
    //                     });
    //                 } else {
    //                     fileSize = file.length;
    //                     subtitleManager(movieId);
    //                     module.exports.streamingCenter(res, file, range, directoryName, filePath, movieId, {
    //                         convert: false,
    //                         subs: srt,
    //                         downloaded: false
    //                     });
    //                 }
    //             } else if ((new RegExp(/video/)).test(mimeType)) {
    //                 fileSize = file.length;
    //                 // module.exports.getSubtitles(res, file, directoryName);
    //                 // module.exports.streamVideoWithConversion(res, file, range, directoryName);
    //             } else if (!((new RegExp(/video/)).test(mimeType))) {
    //                 console.log('DESELECTED');
    //                 file.deselect();
    //             }
    //         });
    //         engine.on('download', () => {
    //             console.log(Math.round((engine.swarm.downloaded / fileSize) * 100) + '% downloaded');
    //         });
    //         engine.on('idle', () => {
    //             console.log('Movie fully downloaded !');
    //         })
    //     });
    // },
    // torrentManager: async (req, res) => {
    //     let {movieId, movieNameEncoded, movieHash} = req.query;
    //     let {range} = req.headers;
    //
    //     if (movieId && movieId.length && movieNameEncoded !== undefined && movieNameEncoded.length && movieHash
    //         && movieHash.length || range === undefined) {
    //         let magnet = `magnet:?xt=urn:btih:${movieHash}&dn=${movieNameEncoded}&tr=http://track.one:1234/announce&tr=udp://track.two:80`;
    //         if ((new RegExp(/magnet:\?xt=urn:.+/)).test(magnet)) {
    //             let directoryName = crypto.createHash('md5').update(magnet).digest('hex');
    //             let options = {
    //                 connections: 100,
    //                 uploads: 10,
    //                 verify: true,
    //                 dht: true,
    //                 tracker: true,
    //                 path: `/tmp/torrentStream/${directoryName}`
    //             };
    //             module.exports.torrentDownloader(res, range, directoryName, magnet, movieId, options, {
    //                 status: false,
    //                 language: 'fre'
    //             });
    //         } else {
    //             return res.status(200).send('Wrong magnet link !')
    //         }
    //     } else {
    //         return res.status(200).send('Wrong data sent');
    //     }
    // },
};
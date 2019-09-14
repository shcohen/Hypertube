const fs = require('fs');
const OS = require('opensubtitles-api');
const axios = require('axios');
const OpenSubtitles = new OS({useragent: 'TemporaryUserAgent', ssl: true});
const srt2vtt = require('srt-to-vtt');
const {getUserInfos} = require('../utils/jwt_check');
const {getLanguageName} = require('../utils/subtitleUtils');
const {trackWatchedMovie} = require('../utils/moviesUtils');

module.exports = {
    subtitleManager: async (req, res) => {
        const connectedUser = getUserInfos(req.headers.authorization);
        let {IMDBid} = req.query;
        if (connectedUser && connectedUser.acc_id.length) {
            await trackWatchedMovie(connectedUser.acc_id, IMDBid);
            if (!fs.existsSync(`${HOME_DIR}/client/public/subtitles`)) {
                fs.mkdirSync(`${HOME_DIR}/client/public/subtitles`);
            }
            if (!fs.existsSync(`${HOME_DIR}/client/public/subtitles/${IMDBid}`)) {
                fs.mkdirSync(`${HOME_DIR}/client/public/subtitles/${IMDBid}`);
            }
            OpenSubtitles.search({
                imdbid: IMDBid
            })
                .then(async (data) => {
                    let subArr = [];
                    await Promise.all(Object.keys(data).map(async (key) => {
                        return await (async () => {
                            if (!data[key].url) {
                                return Promise.resolve('no');
                            }
                            let srtData = await axios.get(data[key].url);
                            fs.writeFileSync(`${HOME_DIR}/client/public/subtitles/${IMDBid}/${IMDBid}.${key}.srt`, srtData.data);
                            fs.createReadStream(`${HOME_DIR}/client/public/subtitles/${IMDBid}/${IMDBid}.${key}.srt`)
                                .pipe(srt2vtt())
                                .pipe(fs.createWriteStream(`${HOME_DIR}/client/public/subtitles/${IMDBid}/${IMDBid}.${key}.vtt`))
                                .on('close', () => {
                                    fs.unlinkSync(`${HOME_DIR}/client/public/subtitles/${IMDBid}/${IMDBid}.${key}.srt`);
                                });
                            subArr = [...subArr, {
                                label: getLanguageName(key),
                                code: key,
                                file: `/subtitles/${IMDBid}/${IMDBid}.${key}.vtt`
                            }];
                            return Promise.resolve('ok');
                        })();
                    }));
                    res.status(200).send(subArr.sort((a, b) => ((a.label === b.label) ? 0 : ((a.label > b.label) ? 1 : -1))));
                })
                .catch(() => res.status(200).send([]))
        } else {
          return res.status(403).send('Unauthorized');
        }
    }
};
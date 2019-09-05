const fs = require('fs');
const path = require('path');
const OS = require('opensubtitles-api');
const axios = require('axios');
const OpenSubtitles = new OS({useragent: 'TemporaryUserAgent', ssl: true});
const srt2vtt = require('srt-to-vtt');
const rootDirectory = path.dirname(require.main.filename);

module.exports = {
    getSubtitles: IMDBid => {
        !fs.existsSync(`${rootDirectory}/client/public/Subtitles/${IMDBid}`) ? fs.mkdirSync(`${rootDirectory}/client/public/Subtitles/${IMDBid}`) : undefined;
        return OpenSubtitles.search({imdbid: IMDBid})
            .then(async data => {
                await Promise.all(Object.keys(data).map(async key => {
                    if (data[key].url) {
                        let srtData = await axios.get(data[key].url);
                        fs.writeFileSync(`${rootDirectory}/client/public/Subtitles/${IMDBid}/${IMDBid}.${key}.srt`, srtData.data);
                        if (fs.existsSync(`${rootDirectory}/client/public/Subtitles/${IMDBid}/${IMDBid}.${key}.srt`)) {
                            fs.createReadStream(`${rootDirectory}/client/public/Subtitles/${IMDBid}/${IMDBid}.${key}.srt`)
                                .pipe(srt2vtt())
                                .pipe(fs.createWriteStream(`${rootDirectory}/client/public/Subtitles/${IMDBid}/${IMDBid}.${key}.vtt`))
                                .on('close', () => {
                                    fs.unlinkSync(`${rootDirectory}/client/public/Subtitles/${IMDBid}/${IMDBid}.${key}.srt`);
                                });
                        } else {
                            console.log('Error while recover subtitle !')
                        }
                    }
                }));
            });
    },
    subtitleManager: async (req, res) => {
        let {IMDBid} = req.query;
        !fs.existsSync(`${rootDirectory}/client/public/Subtitles`) ? fs.mkdirSync(`${rootDirectory}/client/public/Subtitles`) : undefined;
        if (!fs.existsSync(`${rootDirectory}/client/public/Subtitles/${IMDBid}`)) {
            await module.exports.getSubtitles(IMDBid);
        }
        return res.status(200).send('Subtitles created !');
    }
};
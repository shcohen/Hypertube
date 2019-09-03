const fs = require('fs');
const path = require('path');
const OS = require('opensubtitles-api');
const axios = require('axios');
const OpenSubtitles = new OS({useragent: 'TemporaryUserAgent', ssl: true});
const srt2vtt = require('srt-to-vtt');
const rootDirectory = path.dirname(require.main.filename);

module.exports = {
    getSubtitles: (movieId) => {
        !fs.existsSync(`${rootDirectory}/client/public/Subtitles/${movieId}`) ? fs.mkdirSync(`${rootDirectory}/client/public/Subtitles/${movieId}`) : undefined;
        OpenSubtitles.search({imdbid: movieId})
            .then(async data => {
                Object.keys(data).map(async key => {
                    if (data[key].url) {
                        let srtData = await axios.get(data[key].url);
                        fs.writeFileSync(`${rootDirectory}/client/public/Subtitles/${movieId}/${movieId}.${key}.srt`, srtData.data);
                        if (fs.existsSync(`${rootDirectory}/client/public/Subtitles/${movieId}/${movieId}.${key}.srt`)) {
                            await fs.createReadStream(`${rootDirectory}/client/public/Subtitles/${movieId}/${movieId}.${key}.srt`)
                                .pipe(srt2vtt())
                                .pipe(fs.createWriteStream(`${rootDirectory}/client/public/Subtitles/${movieId}/${movieId}.${key}.vtt`));
                            await fs.unlinkSync(`${rootDirectory}/client/public/Subtitles/${movieId}/${movieId}.${key}.srt`);
                            console.log('Srt file converted and vtt created !');
                        } else {
                            console.log('Error while recover subtitle !')
                        }
                    }
                });
            });
    },
    subtitleManager: (movieId) => {
        !fs.existsSync(`${rootDirectory}/client/public/Subtitles`) ? fs.mkdirSync(`${rootDirectory}/client/public/Subtitles`) : undefined;
        if (!fs.existsSync(`${rootDirectory}/client/public/Subtitles/${movieId}`)) {
            module.exports.getSubtitles(movieId);
        }
    }
};
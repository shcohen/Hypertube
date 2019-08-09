const fs = require('fs');
const OS = require('opensubtitles-api');
const axios = require('axios');
const OpenSubtitles = new OS({useragent: 'TemporaryUserAgent', ssl: true});
const srt2vtt = require('srt-to-vtt');

module.exports = {
    getSubtitles: (movieId) => {
        !fs.existsSync(`./Subtitles/${movieId}`) ? fs.mkdirSync(`./Subtitles/${movieId}`) : undefined;
        OpenSubtitles.search({imdbid: movieId})
            .then(async data => {
                Object.keys(data).map(async key => {
                    if (data[key].url) {
                        let srtData = await axios.get(data[key].url);
                        await fs.writeFileSync(`./Subtitles/${movieId}/${movieId}.${key}.srt`, srtData.data);
                        await fs.createReadStream(`./Subtitles/${movieId}/${movieId}.${key}.srt`)
                            .pipe(srt2vtt())
                            .pipe(fs.createWriteStream(`./Subtitles/${movieId}/${movieId}.${key}.vtt`));
                        await fs.unlinkSync(`./Subtitles/${movieId}/${movieId}.${key}.srt`);
                        console.log('Srt file converted and vtt created !');
                    }
                });
        });
    },
    sendSubtitles: (movieId) => {
        fs.createReadStream(`/tmp/Subtitles/${movieId}.fre.srt`)
            .pipe(srt2vtt())
            .pipe(fs.createWriteStream(`/tmp/Subtitles/${movieId}.fre.vtt`))
    },
    subtitleManager: (movieId) => {
        !fs.existsSync('./Subtitles') ? fs.mkdirSync('./Subtitles') : undefined;
        if (fs.existsSync(`./Subtitles/${movieId}`)) {
            module.exports.sendSubtitles(movieId);
        } else {
            module.exports.getSubtitles(movieId);
        }
    }
};
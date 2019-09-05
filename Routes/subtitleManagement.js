const fs = require('fs');
const path = require('path');
const OS = require('opensubtitles-api');
const axios = require('axios');
const OpenSubtitles = new OS({useragent: 'TemporaryUserAgent', ssl: true});
const srt2vtt = require('srt-to-vtt');
const rootDirectory = path.dirname(require.main.filename);

module.exports = {
  getSubtitles: (IMDBid, res) => {
    !fs.existsSync(`${rootDirectory}/client/public/Subtitles/${IMDBid}`) ? fs.mkdirSync(`${rootDirectory}/client/public/Subtitles/${IMDBid}`) : undefined;
    return OpenSubtitles.search({imdbid: IMDBid})
      .then(async data => {
        let subArr = [];
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
                  console.log('on ajoute au tableau');
                  subArr = [...subArr, {
                    label: key,
                    file: `/public/Subtitles/${IMDBid}/${IMDBid}.${key}.srt`
                  }];
                });
            } else {
              console.log('Error while recover subtitle !');
            }
          }
        }));
        console.log('on resolve');
        res.status(200).send(subArr);
      });
  },
  subtitleManagerOLD: async (req, res) => {
    let {IMDBid} = req.query;
    !fs.existsSync(`${rootDirectory}/client/public/Subtitles`) ? fs.mkdirSync(`${rootDirectory}/client/public/Subtitles`) : undefined;
    // if (!fs.existsSync(`${rootDirectory}/client/public/Subtitles/${IMDBid}`)) {
    await module.exports.getSubtitles(IMDBid, res);
    // } else {
    //     return res.status(400).send('Error !');
    // }
  },
  subtitleManager: async (req, res) => {
    let {IMDBid} = req.query;
    if (!fs.existsSync(`${rootDirectory}/client/public/Subtitles`)) {
      fs.mkdirSync(`${rootDirectory}/client/public/Subtitles`);
    }
    if (!fs.existsSync(`${rootDirectory}/client/public/Subtitles/${IMDBid}`)) {
      fs.mkdirSync(`${rootDirectory}/client/public/Subtitles/${IMDBid}`);
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
            fs.writeFileSync(`${rootDirectory}/client/public/Subtitles/${IMDBid}/${IMDBid}.${key}.srt`, srtData.data);
            fs.createReadStream(`${rootDirectory}/client/public/Subtitles/${IMDBid}/${IMDBid}.${key}.srt`)
              .pipe(srt2vtt())
              .pipe(fs.createWriteStream(`${rootDirectory}/client/public/Subtitles/${IMDBid}/${IMDBid}.${key}.vtt`))
              .on('close', () => {
                fs.unlinkSync(`${rootDirectory}/client/public/Subtitles/${IMDBid}/${IMDBid}.${key}.srt`);
              });
            console.log('on ajoute au tableau');
            subArr = [...subArr, {
              label: key,
              file: `/Subtitles/${IMDBid}/${IMDBid}.${key}.vtt`
            }];
            return Promise.resolve('ok');
          })();
        }));
        res.status(200).send(subArr);
      });
  }
};
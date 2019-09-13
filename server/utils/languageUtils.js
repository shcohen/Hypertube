const axios = require('axios');
const {YANDEX_API_KEY} = require('../config/apiKey');

module.exports = {
    translateSentence: async (sentence, req) => {
        const lang = req && req.headers && req.headers.lang || 'en';
        if (lang === 'en' || !sentence || !sentence.length) {
            return sentence;
        }
        let translation = await axios.get(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${YANDEX_API_KEY}&text=${sentence}&lang=en-${lang}`);
        if (!translation.data || !translation.data.text || !translation.data.text[0]) {
            return sentence;
        }
        return translation.data.text[0];
    },
    translateGenres: async (movies, req) => {
        if (movies && movies.length) {
            await Promise.all(movies.map(async (movie, i) => {
                let translatedGenres = [];
                if (movie.genres) {
                    await Promise.all(movie.genres.map(async genre => {
                        genre = '|' + genre + '|';
                        let translated = await module.exports.translateSentence(genre, req);
                        if (translated && translated.length) {
                            translatedGenres = [...translatedGenres, translated.replace(/[|]/g, '').trim()];
                        }
                    }));
                    if (translatedGenres && translatedGenres.length) {
                        movie.genres = translatedGenres;
                    }
                } else {
                    movies.splice(i, 1);
                }
            }));
        }
    },
    translateMovieDetail: async movie => {
        if (movie && movie.length) {
        }
    }
};
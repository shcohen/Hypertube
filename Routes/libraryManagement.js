const torrentSearch = require('torrent-search-api');
const accentRemover = require('remove-accents');

module.exports = {
    findMovies: async (req, res) => {
        let {name} = req.body;
        let movies_list;

        if (name !== undefined && name.length) {
            name = await accentRemover(name);
            const search = await torrentSearch.search(name, 'Movies');
            let movies = search.filter(movie => {
                name = name.toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, "");
                return !movie.title.toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, "").indexOf(name);
            });
            await Promise.all(movies.map(async movie => {
                let found = movie.title.match(/^([A-Za-z:))\- ])+[1-9]{0,1}(?!0|9|8|7)(?!\()|^([0-9 ])+[A-Za-z:))\- ]*[1-9]{0,1}(?!0|9|8|7)(?!\()|[0-9]+(?=p)/gm);
                movie.title = found[0] ? found[0].trim() : null;
                movie.quality = found[1] ? found[1] : null;
                movie.magnet = await torrentSearch.getMagnet(movie);
            }));
            return res.status(200).send(movies);
        } else {
            return res.status(200).send('Wrong data sent');
        }
    },
};
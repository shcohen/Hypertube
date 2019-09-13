const axios = require('axios');
const fs = require('fs');
const mongoose = require('mongoose');
const popcornTimesMovies = require('./models/popcornTime');

mongoose.connect('mongodb+srv://root:root@hypertube-yfmfl.mongodb.net/Hypertube?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('Connected to mongoDB')
    }).catch(e => {
    console.log('Error while DB connecting');
    console.log(e);
});

const getNumberOfPages = async () => {
    let pages = await axios.get('https://tv-v2.api-fetch.website/movies');
    return pages.data.length;
};

const scrapPopcornTime = async () => {
    const pages = await getNumberOfPages();
    let allMovies = [];
    for (let i = 1; i < pages - 1; i++) {
        let movies = await axios.get(`https://tv-v2.api-fetch.website/movies/${i}`)
            .catch(err => {
                console.log(err);
            });
        movies.data.map(movie => {
            allMovies = [...allMovies, {
                imdb_code: movie.imdb_id,
                title: movie.title,
                genres: movie.genres.map(genre => {
                    if (genre === 'science-fiction') {
                        genre = 'Sci-Fi';
                    }
                    return genre.charAt(0).toUpperCase() + genre.slice(1);
                }),
                year: movie.year,
                synopsis: movie.synopsis,
                yt_trailer_code: movie.trailer ? movie.trailer.replace('http://youtube.com/watch?v=', '') : null,
                runtime: movie.runtime,
                large_cover_image: movie.images ? movie.images.poster : 'N/A',
                rating: movie.rating.percentage / 10,
                torrents: [
                    {
                        quality: '720p',
                        seeds: movie.torrents['720p'].seed,
                        peers: movie.torrents['720p'].peer,
                        size: movie.torrents['720p'].filesize,
                        type: 'Web',
                        hash: movie.torrents['720p'].url.replace('', ''),
                    },
                    {
                        quality: '1080p',
                        seeds: movie.torrents['1080p'].seed,
                        peers: movie.torrents['1080p'].peer,
                        size: movie.torrents['1080p'].filesize,
                        type: 'Web',
                        hash: movie.torrents['1080p'].url.replace('', ''),
                    },
                ]
            }];
        })
    }
    await popcornTimesMovies.create(allMovies)
        .catch((err) => {
            console.log(err);
        });
    process.exit(1);
};

scrapPopcornTime();

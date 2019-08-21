const axios = require('axios');
const torrentSearch = require('torrent-search-api');
const rateLimit = require('axios-rate-limit');
const {TMDB_API_KEY_V3, RAPIDAPI_KEY} = require('../config/apiKey');
const limitedRequest = rateLimit(axios.create(), {maxRequests: 39, perMilliseconds: 10000});
const genres = [{"id": 28, "name": "Action"}, {"id": 12, "name": "Adventure"}, {"id": 16, "name": "Animation"},
    {"id": 35, "name": "Comedy"}, {"id": 80, "name": "Crime"}, {"id": 99, "name": "Documentary"}, {
        "id": 18,
        "name": "Drama"
    },
    {"id": 10751, "name": "Family"}, {"id": 14, "name": "Fantasy"}, {"id": 36, "name": "History"}, {
        "id": 27,
        "name": "Horror"
    },
    {"id": 10402, "name": "Music"}, {"id": 9648, "name": "Mystery"}, {"id": 10749, "name": "Romance"}, {
        "id": 878,
        "name": "Science Fiction"
    },
    {"id": 10770, "name": "TV Movie"}, {"id": 53, "name": "Thriller"}, {"id": 10752, "name": "War"}, {
        "id": 37,
        "name": "Western"
    }];

module.exports = {
    getMovieInfo: async (title, movie) => {
        let res = await limitedRequest.get(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY_V3}&query=${title}`);
        if (res.data.results[0]) {
            movie.title = res.data.results[0].title;
            movie.poster = res.data.results[0].poster_path ? res.data.results[0].poster_path : res.data.results[0].backdrop_path;
            movie.time = res.data.results[0].release_date.substr(0, 4);
            movie.note = res.data.results[0].vote_average;
            movie.overview = res.data.results[0].overview;
            movie.id = res.data.results[0].id;
            movie.genre = [];
            res.data.results[0].genre_ids.map(id => {
                genres.map(genre => {
                    if (genre.id === id) {
                        movie.genre = [...movie.genre, genre.name];
                    }
                })
            });
        }
    },
    getImdbIdAndGenre: async (id, genres_id) => {
        let res = await limitedRequest.get(`https://api.themoviedb.org/3/movie/${id}/external_ids?api_key=${TMDB_API_KEY_V3}`);
        if (res.data.imdb_id) {
            let newGenres = await genres_id.map(id => {
                if (genres.id === id) {
                    console.log('OK');
                    return [newGenres, genres.name];
                }
            });
            console.log(newGenres);
            // return {imdbId: res.data.imdb_id, genres: newGenres};
            // return await axios.get(`https://movie-database-imdb-alternative.p.rapidapi.com/?i=${imdbID.data.imdb_id}&r=json`, {
            //     headers: {
            //         "X-RapidAPI-Host": "movie-database-imdb-alternative.p.rapidapi.com",
            //         "X-RapidAPI-Key": RAPIDAPI_KEY
            //     }
            // }).then(res => {
            //     return res.data;
            // })
        }
    },
    removeMoviesWithoutInfo: (movies) => {
        return movies.filter((first_movie, i) => {
            return movies.findIndex(second_movie => {
                if (first_movie.id && second_movie.id)
                    return second_movie.id === first_movie.id;
            }) === i;
        });
    },
    removeDuplicatesMovies: (movies) => {
        return movies.filter((first_movie, i) => {
            return movies.findIndex(second_movie => {
                if (first_movie.title && second_movie.title)
                    return second_movie.title.toLowerCase() === first_movie.title.toLowerCase();
            }) === i;
        });
    },
    removeTitleAndQualityDoublons: (movies) => {
        return movies.filter((first_movie, i) => {
            return movies.findIndex(second_movie => {
                if (first_movie.title && second_movie.title && first_movie.torrent && second_movie.torrent)
                    return second_movie.title === first_movie.title && second_movie.torrent[0].quality === first_movie.torrent[0].quality;
            }) === i;
        });
    },
    verifyTitle: async title => {
        let res = await limitedRequest.get(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY_V3}&query=${title}`);
        return res.data.results ? title === res.data.results[0].title : false
    },
    regroupTorrent: async movie => {
        let final = movie.shift();
        await Promise.all(movie.map(movie => {
            final.torrent = [...final.torrent, movie.torrent[0]];
        }));
        await final.torrent.sort((a, b) => {
            return b.quality - a.quality;
        });
        return final;
    },
};
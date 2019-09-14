const axios = require('axios');
const fs = require('fs');
const rimraf = require('rimraf');
const popcornTimeModel = require('../models/popcornTime');
const downloadedMovies = require('../models/downloadedMovies');
const watchedMovie = require('../models/watchedMovie');
const {translateSentence} = require('./languageUtils');
const {RAPIDAPI_KEY} = require('../config/apiKey');

module.exports = {
    getMovieInfo: async (IMDBid, YTSid, req) => {
        return await axios.get(`https://movie-database-imdb-alternative.p.rapidapi.com/?i=${IMDBid}&r=json`, {
            headers: {
                "X-RapidAPI-Host": "movie-database-imdb-alternative.p.rapidapi.com",
                "X-RapidAPI-Key": RAPIDAPI_KEY
            }
        }).then(async res => {
            if (res.data.Response === 'False') {
                return null;
            }
            let genres = await translateSentence(res.data.Genre, req);
            res.data.Genre = genres.split(',').map((genre) => (genre.trim()));
            res.data.Plot = await translateSentence(res.data.Plot, req);
            if (YTSid !== 'undefined') {
                let yts = await axios.get(`https://yts.lt/api/v2/movie_details.json?movie_id=${YTSid}`);
                res.data.yts = yts && yts.data !== '' ? yts.data.data.movie : {};
                res.data.yts.description_full =  await translateSentence(res.data.yts.description_full, req);
            }
            let popcornTime = await popcornTimeModel.find({imdb_code: IMDBid});
            res.data.popcornTime = popcornTime && popcornTime.length ? popcornTime[0] : {};
            return res.data.imdbID ? res.data : null;
        })
    },
    filterDuplicateMovies: async (ytsMovies, popcornMovies) => {
        let mixedMovies = [...ytsMovies, ...popcornMovies];
        return mixedMovies.filter((thing, i, self) => self.findIndex(t => t.imdb_code === thing.imdb_code) === i);
    },
    isWatched: async (acc_id, movies) => {
        let watched = await watchedMovie.find({accId: acc_id});
        let allMovies = [];
        await Promise.all(movies.map(async (movie, i) => {
            allMovies = [...allMovies, movie];
            allMovies[i].seen = false;
            return await Promise.all(watched.map(seen => {
                allMovies[i].seen = movie.imdb_code === seen.movieId;
                return Promise.resolve();
            }));
        }));
        return allMovies;
    },
    watchedMovieInfo: async (IMDBid) => {
        return await axios.get(`https://movie-database-imdb-alternative.p.rapidapi.com/?i=${IMDBid}&r=json`, {
            headers: {
                "X-RapidAPI-Host": "movie-database-imdb-alternative.p.rapidapi.com",
                "X-RapidAPI-Key": RAPIDAPI_KEY
            }
        }).then(async res => {
            return res.data;
        })
    },
    trackWatchedMovie: async (accId, movieId) => {
        let date = new Date;
        let movie = await watchedMovie.find({accId: accId, movieId: movieId});
        if (movie && !movie.length) {
            return watchedMovie.create({accId: accId, movieId: movieId, date: date.getTime()});
        }
    },
    trackDownloadedMovies: async (movieId, path) => {
        let date = new Date;
        let movies = await downloadedMovies.find({movieId: movieId});
        if (movies && !movies.length) {
            return downloadedMovies.create({movieId: movieId, path: path, date: date.getTime()});
        } else {
            return downloadedMovies.updateOne({date: date.getTime()});
        }
    },
    downloadedMoviesExpirationCheck: async () => {
        let movies = await downloadedMovies.find();
        movies.map(movie => {
            let movieDate = Math.floor(movie.date / 1000.0);
            let date = Math.floor(new Date / 1000.0);
            let month = 1000 * 60 * 60 * 24 * 30 / 1000;
            if (date - movieDate >= month) {
                rimraf.sync(movie.path);
                downloadedMovies.find({movieId: movie.movieId}).remove();
            }
        })
    },
    filterByGenre: (movies, category) => {
        return movies.filter(movie => {
            return (movie.genres.filter(genre => category.find((g) => (g === genre))).length === category.length);
        });
    },
    filterByRatings: (movies, ratings) => {
        let checkRatings = [];
        movies.map(movie => {
            return parseFloat(movie.rating) >= parseFloat(ratings[0]) && parseFloat(movie.rating) <= parseFloat(ratings[1])
                && checkRatings.push(movie);
        });
        return checkRatings;
    },
    filterByYear: (movies, year) => {
        let checkYear = [];
        movies.map(movie => {
            return parseInt(movie.year) >= parseInt(year[0]) && parseInt(movie.year) <= parseInt(year[1])
                && checkYear.push(movie);
        });
        return checkYear;
    },
    sortMovies: (sort, movies) => {
        switch (sort) {
            case 'alphabetical':
                return movies.sort((current, next) => {
                    return current.title > next.title ? 1 : -1
                });
            case 'relevance':
                return movies;
            case 'rating-asc':
                return movies.sort((current, next) => {
                    return parseFloat(current.rating) > parseFloat(next.rating) ? 1 : -1
                });
            case 'rating-desc':
                return movies.sort((current, next) => {
                    return parseFloat(current.rating) > parseFloat(next.rating) ? -1 : 1
                });
            case 'year-asc':
                return movies.sort((current, next) => {
                    return parseInt(current.year) > parseInt(next.year) ? 1 : -1
                });
            case 'year-desc':
                return movies.sort((current, next) => {
                    return parseInt(current.year) > parseInt(next.year) ? -1 : 1
                });
            default:
                return movies;
        }
    },
};
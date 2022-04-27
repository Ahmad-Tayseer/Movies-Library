'use strict';

const express = require('express');
const cors = require('cors');
const axios = require('axios').default;
require('dotenv').config()

const apiKey = process.env.API_KEY;

const recipeData = require('./Movie_data/data.json');
const { handle } = require('express/lib/application');
const app = express();

app.use(cors());

const PORT = 3000;

app.get('/', handleHome);
app.get('/favorite', handleFavorite);
// app.get('*', handleNotFound);
app.get('/status:500', (req, res) => res.send(error()));
app.get('/trending', handleTrendeing);
app.get('/search', handleSearch);



  app.use(function(req, res, next) {
    res.status(404)
    res.send('Page not found');
  })

  app.use(function(err, req, res, next) {
    console.log(err.stack);
    res.status(500)
    res.send('Sorry, something went wrong');
  });

function handleHome(req, res) {
    let newData = new Trend(recipeData.id, recipeData.title, recipeData.release_date, recipeData.poster_path, recipeData.overview);
    res.json(newData);
}


function handleFavorite(req,res) {
    res.send('Welcome to Favorite Page');
}

function handleTrendeing(req, res) {
  axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US`)
      .then(data => {
        let trends = [];
        console.log(data.data.results);
        data.data.results.forEach(element => {
          let trendMovie = new Trend(element.id, element.title, element.release_date, element.poster_path, element.overview); 
          trends.push(trendMovie);
        })
        res.json(trends)
      })
      .catch((error) => {
        console.log(error);
        res.send('Inside catch')
      })
}

function handleSearch(req, res) {
  console.log(req.query);
  let movieName = req.query.movieName;
  axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${movieName}&page=2`)
      .then(result => {
        let movies = [];
        result.data.results.forEach(element => {
          let newMovie = new Trend(element.id, element.title, element.release_date, element.poster_path, element.overview); 
          movies.push(newMovie);
        })
        res.json(movies);
      })
      .catch((error) => {
        console.log(error);
        res.send('Inside catch')
      })
  // res.send('searching for movies');
}

// function handleNotFound(req, res) {
//   res.send('Not Found');
// }



app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})


function Trend(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}



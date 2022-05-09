'use strict';

const url = "postgres://ahmadtayseer:5995@localhost:5432/movies";
const PORT = 3000;

const express = require('express');
const cors = require('cors');
const axios = require('axios').default;
const bodyParser = require('body-parser')
require('dotenv').config()

const apiKey = process.env.API_KEY;

const recipeData = require('./Movie_data/data.json');
const { handle } = require('express/lib/application');

const { Client } = require('pg');
// const client = require('pg/lib/native/client');
const client = new Client(url);

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', handleHome);
app.get('/favorite', handleFavorite);
// app.get('*', handleNotFound);
app.get('/status:500', (req, res) => res.send(error()));
app.get('/trending', handleTrendeing);
app.get('/search', handleSearch);

// routes:
app.post('/addMovie', handleAdd);
app.get('/getMovies', handleGet);
app.put("/UPDATE/:moviesId", handleUpdate);
app.delete("/DELETE", handleDelete);
app.get('/getMovie', handleGetMovie);
app.use(handleError);


function handleAdd(req,res) {
  console.log(req.body);

  const { id, title, release_date, poster_path, overview } = req.body;

  let sql = 'INSERT INTO movies(id, title, release_date, poster_path, overview) VALUES($1, $2, $3, $4, $5) RETURNING *;'
  let values = [id, title, release_date, poster_path, overview];
  client.query(sql, values).then((result) => {
    console.log(result.rows);
    return res.status(201).json(result.rows[0]);
  }).catch()
}

function handleGet(req,res) {
  let sql = 'SELECT * from movies;'
  client.query(sql).then((result) => {
    console.log(result);
    res.json(result.rows);
  }).catch((err) => {
    handleError(error, req, res);
  });
}

function handleGetMovie(req,res) {
  const { moviesId } = req.query;
  let sql = 'SELECT (id, title, release_date, poster_path, overview) from movies WHERE id = $1;'
  let values = [moviesId];
  client.query(sql, values).then((result) => {
    console.log(result);
    res.json(result.rows);
  }).catch((err) => {
    handleError(error, req, res);
  });
}

function handleUpdate(req, res) {

  const { moviesId } = req.params;
  const { id, title, release_date, poster_path, overview } = req.body;

  let sql = `UPDATE movies SET id = $1, title = $2, release_date = $3, poster_path = $4, overview = $5 WHERE id = $6 RETURNING *;`
  let values = [id, title, release_date, poster_path, overview, moviesId];

  client.query(sql, values).then(result => {
    // console.log(result.rows);
    res.json(result.rows[0]);
  }
  
  ).catch();
}

function handleDelete(req, res) {
  const { moviesId } = req.query;
  let sql = `DELETE FROM movies WHERE id = $1 ;`
  let values = [moviesId];
  client.query(sql, values).then(result => {
    res.send("Deleted");
  }

  ).catch();
}

function handleError(error, req, res) {
  res.status(500).send(error);
}

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


client.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
  });
})



function Trend(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}



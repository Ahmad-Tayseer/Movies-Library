'use strict';

const express = require('express');
const recipeData = require('./Movie_data/data.json')

const app = express();
const port = 3000;

app.get('/', handleHome);
app.get('/favorite', handleFavorite);

app.get('/status:500', (req, res) => res.send(error()));

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
    let newData = new data(recipeData.title, recipeData.original_language, recipeData.poster_path, recipeData.vote_average, recipeData.overview, recipeData.release_date);
    res.json(newData);
}


function handleFavorite(req,res) {
    res.send('Welcome to Favorite Page');
}



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


function data(title, original_language, poster_path, vote_average, overview, release_date) {
    this.title = title;
    this.original_language = original_language;
    this.poster_path = poster_path;
    this.vote_average = vote_average;
    this.overview = overview;
    this.release_date = release_date;
}


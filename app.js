const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

// Check DB connection
db.once('open', () => {
  console.log('Connected to MongoDB...');
});

// Check for DB errors
db.on('error', (err) => {
  console.log(err);
});

// Init App
const app = express();

// Bring in models
let Article = require('./models/Article');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Home Route
app.get('/', (req, res) => {
  Article.find({}, (err, articles) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', {
        title: "Articles",
        articles: articles,
      });
    }
  });
});

// Add Route
app.get('/articles/add', (req, res) => {
  res.render('add_article', {
    title: "Add Article",
  });
});

// Start Server
app.listen(3000, () => {
  console.log('Server started on port 3000...');
});

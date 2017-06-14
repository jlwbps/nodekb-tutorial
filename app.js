const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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

// Body Parser Middleware
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());

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

// Add Submit POST Route
app.post('/articles/add', (req, res) => {
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save((err) => {
    if (err) {
      console.log(err);
      return;
    } else {
      res.redirect('/')
    }
  });
});

// Start Server
app.listen(3000, () => {
  console.log('Server started on port 3000...');
});

const fs = require('fs');
const path = require('path');

function loadArticles(filePath, cb) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return cb(err, null);
    }
    try {
      const articles = JSON.parse(data);
      cb(null, articles);
    } catch (err) {
      cb(err, null);
    }
  });
}

function saveArticles(filePath, articles) {
  const data = JSON.stringify(articles, null, 2);
  fs.writeFile(filePath, data, (err) => {
    if (err) {
      console.error('Error saving articles:', err.message);
    }
  });
}

module.exports = { loadArticles, saveArticles };


const { v4: uuidv4 } = require('uuid');
const { saveArticles } = require('../utils/fileHandler');

const articlesPath = './articles.json';

function readAll(req, res, payload, articles, cb) {
  cb(null, articles);
}

function read(req, res, payload, articles, cb) {
  const article = articles.find((a) => a.id === payload.id);
  if (!article) return cb({ code: 404, message: 'Article not found' });

  cb(null, article);
}

function create(req, res, payload, articles, cb) {
  if (!payload.title || !payload.text || !payload.author) {
    return cb({ code: 400, message: 'Invalid request' });
  }

  const newArticle = {
    id: uuidv4(),
    title: payload.title,
    text: payload.text,
    date: Date.now(),
    author: payload.author,
    comments: [],
  };

  articles.push(newArticle);
  saveArticles(articlesPath, articles);
  cb(null, newArticle);
}

function update(req, res, payload, articles, cb) {
  const article = articles.find((a) => a.id === payload.id);
  if (!article) return cb({ code: 404, message: 'Article not found' });

  article.title = payload.title || article.title;
  article.text = payload.text || article.text;
  article.author = payload.author || article.author;

  saveArticles(articlesPath, articles);
  cb(null, article);
}

function deleteArticle(req, res, payload, articles, cb) {
  const index = articles.findIndex((a) => a.id === payload.id);
  if (index === -1) return cb({ code: 404, message: 'Article not found' });

  articles.splice(index, 1);
  saveArticles(articlesPath, articles);
  cb(null, { message: 'Article deleted' });
}

module.exports = { readAll, read, create, update, delete: deleteArticle };

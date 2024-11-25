const { v4: uuidv4 } = require('uuid');
const { saveArticles } = require('../utils/fileHandler');

const articlesPath = './articles.json';

function create(req, res, payload, articles, cb) {
  if (!payload.articleId || !payload.text || !payload.author) {
    return cb({ code: 400, message: 'Invalid request' });
  }

  const article = articles.find((a) => a.id === payload.articleId);
  if (!article) return cb({ code: 404, message: 'Article not found' });

  const newComment = {
    id: uuidv4(),
    articleId: payload.articleId,
    text: payload.text,
    date: Date.now(),
    author: payload.author,
  };

  article.comments.push(newComment);
  saveArticles(articlesPath, articles);
  cb(null, newComment);
}

function deleteComment(req, res, payload, articles, cb) {
  const article = articles.find((a) => a.comments.some((c) => c.id === payload.id));
  if (!article) return cb({ code: 404, message: 'Comment not found' });

  article.comments = article.comments.filter((c) => c.id !== payload.id);
  saveArticles(articlesPath, articles);
  cb(null, { message: 'Comment deleted' });
}

module.exports = { create, delete: deleteComment };

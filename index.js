const http = require('http');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { logRequest } = require('./utils/logger');
const { loadArticles, saveArticles } = require('./utils/fileHandler');
const articleHandlers = require('./handlers/articleHandlers');
const commentHandlers = require('./handlers/commentHandlers');

const hostname = '127.0.0.1';
const port = 3000;

let articles = [];

const handlers = {
  '/api/articles/readall': articleHandlers.readAll,
  '/api/articles/read': articleHandlers.read,
  '/api/articles/create': articleHandlers.create,
  '/api/articles/update': articleHandlers.update,
  '/api/articles/delete': articleHandlers.delete,
  '/api/comments/create': commentHandlers.create,
  '/api/comments/delete': commentHandlers.delete,
};

const server = http.createServer((req, res) => {
  parseBodyJson(req, (err, payload) => {
    const handler = getHandler(req.url);
    logRequest(req, payload);

    handler(req, res, payload, articles, (err, result) => {
      if (err) {
        res.statusCode = err.code;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(err));
        return;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(result));
    });
  });
});

function getHandler(url) {
  return handlers[url] || notFound;
}

function notFound(req, res, payload, cb) {
  cb({ code: 404, message: 'Not found' });
}

function parseBodyJson(req, cb) {
  let body = [];
  req.on('data', (chunk) => body.push(chunk))
    .on('end', () => {
      try {
        body = Buffer.concat(body).toString();
        cb(null, JSON.parse(body));
      } catch {
        cb({ code: 400, message: 'Invalid JSON' });
      }
    });
}

loadArticles('./articles.json', (err, data) => {
  if (err) {
    console.error('Error loading articles:', err.message);
    process.exit(1);
  }
  articles = data;

  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
});

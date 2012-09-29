var DEFAULT_TIMEOUT = 3000;
var parseURL = require("url").parse;
var http = require('http');
var https = require('https');
var tls = require('tls');
var express = require("express");
var app = express();
var port = process.env['PORT'] || 3000;

app.use(function(req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/tls/:host/:port', function(req, res) {
  var port = parseInt(req.param('port'));
  
  if (isNaN(port) || port <= 0)
    return res.send(400, "bad port");
  
  var timeout = setTimeout(function() {
    res.send(502);
    stream.destroy();
  }, DEFAULT_TIMEOUT);
  var stream = tls.connect({
    host: req.param('host'),
    port: port,
    rejectUnauthorized: false
  }, function() {
    clearTimeout(timeout);
    res.send({
      cert: stream.getPeerCertificate(),
      cipher: stream.getCipher(),
      authorized: stream.authorized
    });
    stream.destroy();
  });
  stream.on('error', function() {
    clearTimeout(timeout);
    return res.send(502);
  });
});

app.get('/_test/timeout', function(req, res) {
  setTimeout(function() {
    res.send(204);
  }, DEFAULT_TIMEOUT + 1000);
});

app.get('/', function(req, res) {
  var url = req.param('url');
  if (!url)
    return res.send(400);
  var parts = parseURL(url);
  var protocol;
  var defaultPort;
  if (parts.protocol == "http:") {
    protocol = http;
    defaultPort = 80;
  } else if (parts.protocol == "https:") {
    protocol = https;
    defaultPort = 443;
  } else {
    return res.send(400, "bad protocol");
  }
  var proxyReq = protocol.request({
    method: 'HEAD',
    host: parts.host,
    port: parts.port || defaultPort,
    path: parts.path
  }, function(proxyRes) {
    res.send(proxyRes.headers);
    proxyRes.destroy();
  });
  proxyReq.setTimeout(DEFAULT_TIMEOUT);
  proxyReq.end();
  proxyReq.on('timeout', function() {
    proxyReq.abort();
    return res.send(502);
  });
  proxyReq.on('error', function(e) {
    return res.send(502);
  });
});

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

app.listen(port, function() {
  console.log('listening on port', port);
});

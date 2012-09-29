var parseURL = require("url").parse;
var http = require('http');
var https = require('https');
var express = require("express");
var app = express();
var port = process.env['PORT'] || 3000;

app.use(function(req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  next();
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
  proxyReq.end();
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

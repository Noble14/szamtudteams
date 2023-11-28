'use strict';

var path = require('path');
const fetch = require("node-fetch");
var config = require('config');
const c = require('config');
const graph = require('./graph')

module.exports.setup = function (app, users) {
  var express = require('express')
  app.use(express.json());

  const authorizeMiddleware = (req, res, next) => {
    //var token = req.headers.token;
    //var tid = req.headers.tid;
    //console.log("token:" + token)
    //console.log("tid" + tid)
    //console.log("body" + JSON.stringify(req.body,null,2))
    //console.log("headers: " + JSON.stringify(req.headers,null,2))
    //console.log(req.headers.token)
    //console.log(req.headers.tid)
    //const oboPromise = graph.getProfile(tid, token)

    next()
    //oboPromise.then(function (result) {
      //next()
    //}, function (err) {
      //console.log(err)
      //res.status(401).send("unatuh")
    //});
  };
  //app.get( '/static' , (req, res) => {
    //res.sendFile(path.join(__dirname, '/../tananyag/index.html'));

  //});

  app.use( '/static', authorizeMiddleware ,express.static(path.join(__dirname,"../tananyag")));

    // Setup the configure tab, with first and second as content tabs
  app.get('/config', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/views/config.html'));
  });

  app.get('/', function (req, res) {
    res.redirect("/static")
  });

  app.get('/hello', function (req, res) {
    // res.sendFile(path.join(__dirname, '../client/views/hello.html'));
    res.redirect('/static')
  });
  app.get('/ok', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/views/ok.html'));
  });
  app.get('/sso', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/views/sso.html'));
  });
  app.get('/auth-start', function (req, res) {
    var clientId = config.get("tab.appId");
    res.render('auth-start', { clientId: clientId });
  });

  app.get('/auth-end', function (req, res) {
    var clientId = config.get("tab.appId");
    res.render('auth-end', { clientId: clientId });
  });

  // ------------------
  app.post('/getProfileOnBehalfOf', function (req, res) {
    var token = req.body.token;
    var tid = req.body.tid;

    const oboPromise = graph.getProfile(tid, token)

    oboPromise.then(function (result) {
      //res.send("hello world")
      res.sendFile(path.join(__dirname, '../tananyag/index.html'));
      //res.json(result)

    }, function (err) {
      console.log(err); // Error: "It broke"
      res.json(err);
    });
  });
  app.post('/startMeeting', function (req, res) {
    var tid = req.body.tid;
    var token = req.body.token;
    const meeting = {
      subject: "hello world"
    }
    graph.startMeeting(tid, token, meeting)

  })
};
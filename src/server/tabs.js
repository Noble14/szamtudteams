'use strict';

var path = require('path');
const fetch = require("node-fetch");
var config = require('config');
const c = require('config');
const graph = require('./graph')
const fs = require('fs');
const { json } = require('body-parser');

module.exports.setup = function (app, users) {
  var authenticate = function(req) {
    return true
  }
  
  var express = require('express')
  app.use(express.json());


  const authorizeMiddleware = (req, res, next) => {
    if (authenticate(req))
      next()     
    else
      next(new Error("unauthorized"))
  };

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
  app.get('/conversation/:entity', function (req, res) {
    const entity = req.params.entity.replaceAll('@', '/')
    const maybeId = getIdToChatPath(entity)
    res.json(maybeId)
  });
  app.post('/conversation', function (req, res) {
    const filePath = path.join(__dirname, 'data.json')
    const data = fs.readFileSync(filePath, 'utf-8')
    const jsonD = JSON.parse(data)
    const entity = req.body.path.replaceAll("@", "/")
    const id = req.body.id

    if (jsonD.hasOwnProperty(entity))
      res.status(400).json("already exists")
    
    jsonD[entity] = {
      'conversationId' : id
    }
    const jsonString = JSON.stringify(jsonD, null, 2)
    fs.writeFileSync(filePath, jsonString, 'utf-8')
    res.json("ok")
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
  function getIdToChatPath(entity) {
    const filePath = path.join(__dirname, 'data.json')
    const data = fs.readFileSync(filePath, 'utf-8')
    const jsonD = JSON.parse(data)
    console.log('json:' , jsonD)
    console.log(entity)
    if (jsonD.hasOwnProperty(entity))
      {
        return jsonD[entity]["conversationId"]
      }
    return false
  }
};
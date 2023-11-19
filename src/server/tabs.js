'use strict';
var path = require('path');
const fetch = require("node-fetch");
var config = require('config');
const msal = require('@azure/msal-node');

module.exports.setup = function (app, io) {
  var express = require('express')
  const users = []

  // Creating MSAL client
  const msalClient = new msal.ConfidentialClientApplication({
    auth: {
      clientId: config.get("tab.appId"),
      clientSecret: config.get("tab.clientSecret")
    }
  });

  io.use((socket, next) => {
    var token = socket.handshake["token"]
    var tid = socket.handshake["tid"]
    console.log(token)
    console.log(tid)

    var l = AuthUser(tid, token)
    console.log(l)
    if  (l) {
      next();
    } else {
      next(new Error())
    }
  })

  io.on('connection', (socket) => {
    console.log(`New user connected ${socket.id}`);

    // Handle user disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected ${socket.id}`);
    });
  });

  // Configure the view engine, views folder and the statics path
  // Use the JSON middleware
  app.use(express.json());

    // Setup the configure tab, with first and second as content tabs
  app.get('/config', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/views/config.html'));
  });

  app.get('/hello', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/views/hello.html'));
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

  
  // End of the pop-up dialog auth flow, returns the results back to parent window
  app.get('/auth-end', function (req, res) {
    var clientId = config.get("tab.appId");
    res.render('auth-end', { clientId: clientId });
  });

  app.post('/getloggedinusers', (req, res) =>
  {
    var tid = req.body.tid;
    var token = req.body.token;
    var mail = req.body.mail;
    var name = req.body.name;
    var oboPromise = new Promise((resolve, reject) => {
      msalClient.acquireTokenOnBehalfOf({
        authority: `https://login.microsoftonline.com/${tid}`,
        oboAssertion: token,
        scopes: scopes,
        skipCache: false
      }).then(result => {

            fetch("https://graph.microsoft.com/v1.0/me/",
              {
                method: 'GET',
                headers: {
                  "accept": "application/json",
                  "authorization": "bearer " + result.accessToken
                },
                mode: 'cors',
                cache: 'default'
              })
              .then((response) => {
                if (response.ok) {
                  return response.json();
                } else {
                  throw (`Error ${response.status}: ${response.statusText}`);
                }
              })
              .then((profile) => {
                resolve(profile);
              })
      }).catch(error => {
        reject({ "error": error.errorCode });
      });
    });

    oboPromise.then(function (result) {
      var us = users.map((x) => x.name)
    
      res.json(us);
    }, function (err) {
      console.log(err); // Error: "It broke"
      res.json(err);
    });

  }
  
  )
  // ------------------
  app.post('/userHere', (req, res) => {
    var tid = req.body.tid;
    var token = req.body.token;
    var mail = req.body.mail;
    var name = req.body.name;

    const user = {
      "name" : name,
      "mail" : mail,
      "token" : token
    }
    users.push(user);

    res.json("200 ok");

  })
  app.post('/getProfileOnBehalfOf', function (req, res) {
    var tid = req.body.tid;
    var token = req.body.token;
    var mail = req.body.mail;
    var name = req.body.name;
    var scopes = ["https://graph.microsoft.com/User.Read"];
    var oboPromise = new Promise((resolve, reject) => {
      msalClient.acquireTokenOnBehalfOf({
        authority: `https://login.microsoftonline.com/${tid}`,
        oboAssertion: token,
        scopes: scopes,
        skipCache: false
      }).then(result => {

            fetch("https://graph.microsoft.com/v1.0/me/",
              {
                method: 'GET',
                headers: {
                  "accept": "application/json",
                  "authorization": "bearer " + result.accessToken
                },
                mode: 'cors',
                cache: 'default'
              })
              .then((response) => {
                if (response.ok) {
                  return response.json();
                } else {
                 console.log(response) 
                  throw (`Error ${response.status}: ${response.statusText}`);
                }
              })
              .then((profile) => {
                resolve(profile);
              })
      }).catch(error => {
        console.log(error)
        reject({ "error": error.errorCode });
      });
    });

    oboPromise.then(function (result) {
    const user = {
      "name" : name,
      "mail" : mail,
      "token" : token
    }
    users.push(user);

      res.json(result);
    }, function (err) {
      console.log(err); // Error: "It broke"
      res.json(err);
    });
  });// SSO demo page
  var AuthUser = function (tid, token) {
    var scopes = ["https://graph.microsoft.com/User.Read"];
    var oboPromise = new Promise((resolve, reject) => {
      msalClient.acquireTokenOnBehalfOf({
        authority: `https://login.microsoftonline.com/${tid}`,
        oboAssertion: token,
        scopes: scopes,
        skipCache: false
      }).then(result => {

            fetch("https://graph.microsoft.com/v1.0/me/",
              {
                method: 'GET',
                headers: {
                  "accept": "application/json",
                  "authorization": "bearer " + result.accessToken
                },
                mode: 'cors',
                cache: 'default'
              })
              .then((response) => {
                if (response.ok) {
                  return response.json();
                } else {
                 console.log(response) 
                  throw (`Error ${response.status}: ${response.statusText}`);
                }
              })
              .then((profile) => {
                resolve(profile);
              })
      }).catch(error => {
        console.log(error)
        reject({ "error": error.errorCode });
      });
    });
    oboPromise.then(function (result) {
      return true
    }, function (err) {
      console.log(err); // Error: "It broke"
      return false
    });
  }
};
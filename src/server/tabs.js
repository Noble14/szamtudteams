'use strict';

var path = require('path');
const fetch = require("node-fetch");
var config = require('config');
const msal = require('@azure/msal-node');
const c = require('config');
const {Client, LogLevel } = require('@microsoft/microsoft-graph-client')

module.exports.setup = function (app, io) {
  var express = require('express')
  const users = []


  // Creating MSAL client
  const msalClient = new msal.ConfidentialClientApplication({
    auth: {
      clientId: config.get("tab.appId"),
      clientSecret: config.get("tab.clientSecret")
      // authority : `https://login.microsoftonline.com/${config.get("tab.tenantId")}`
    }
  });


  io.use((socket, next) => {
    const token = socket.handshake.auth.token
    var tid = socket.handshake.auth.tid
    var tid = socket.handshake.auth.tid
    var roomForSocket = socket.handshake.headers.room
    AuthUser(tid, token).then(x => {
      var user = {
        id : socket.id,
        token : token,
        tid : tid,
        name : x.displayName,
        mail : x.mail,
        room : roomForSocket
      }
      console.log(user)
      users.push(user)
      next();
    }, err => {
      next(new Error())

    })
  })

  io.on('connection', (socket) => {
    console.log(`New user connected ${socket.id}`);
    var room = socket.handshake.headers.room
    socket.join(room)
    var userNames = users
                    .filter(x => x.room == room)
                    .map(x => x.name)
    
    io.to(room).emit("new-user", userNames)

    // Handle user disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected ${socket.id}`);
      var ind = users.findIndex(x => x.id == socket.id)
      users.splice(ind, 1)
      var userNames = users
                      .filter(x => x.room == room)
                      .map(x => x.name)
      io.to(room).emit("new-user", userNames)
    });
  });
  const authorizeMiddleware = (req, res, next) => {
    if (true) {
      next(); // User is authorized, continue to the next middleware
    } else {
      res.status(401).send('Unauthorized'); // User is not authorized, send 401 Unauthorized
    }
  };
  // Configure the view engine, views folder and the statics path
  // Use the JSON middleware
  app.use(express.json());

  app.use( '/static', authorizeMiddleware ,express.static(path.join(__dirname,"../tananyag")));

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

  // ------------------
  app.post('/startMeeting', function (req, res) {
    var tid = req.body.tid;
    var token = req.body.token;
    console.log("token helo")
    console.log(token)
    console.log("tid helo")
    console.log(tid)
    var scopes = ["https://graph.microsoft.com/OnlineMeetings.ReadWrite",
                  "https://graph.microsoft.com/User.Read"];

    msalClient.acquireTokenOnBehalfOf({
      authority: `https://login.microsoftonline.com/${tid}`,
      oboAssertion: token,
      scopes: scopes,
    }).then(result => { 
      const client = Client.init({
        defaultVersion: "v1.0",
        debugLogging: true,
        authProvider: (done) => {
          done(null, result.accessToken);
        },
      });
      console.log("server side token")
      console.log(result)
      const onlineMeeting = {
        subject : "hello everybody"
      }
      client
        .api("/me/onlineMeetings")
        .post(onlineMeeting)
        .then(response => {console.log(`siker\n${JSON.stringify(response, null, 2)}` ); console.log(response.joinUrl); res.json({joinUrl : response.joinUrl})})
        .catch(err => {
          console.error("error creating online meeting: ", err)
          res.status(500).json({error: "error while getting token"})
        })
    })

//    msalClient.acquireTokenOnBehalfOf({
//        authority: `https://login.microsoftonline.com/${tid}`,
//        oboAssertion: token,
//        scopes: scopes,
//        skipCache: false
//    }).then(result => {
//      var onlineMeeting = {
//        "subject" : "hello everybody"
//      }
//        fetch("https://graph.microsoft.com/v1.0/me/onlineMeetings",
//          {
//            method: 'POST',
//            headers: {
//              "accept": "application/json",
//              "authorization": "bearer " + result.accessToken
//            },
//            mode: 'cors',
//            cache: 'default',
//            body : JSON.stringify(onlineMeeting)
//          }).then(response => {
//            if  (response.ok) {
//              console.log("itt van minden:")
//              console.log(response)
//              res.json(response)

//            } else{
//              console.log("hello")
//              console.log(response)
//              res.json("bad request")
//            }
//          })
//    })
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
    return oboPromise;
  }
};
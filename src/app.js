// 'use strict';

// const users = []

// var config = require('config');
// var express = require('express');
// var app = express();
// var path = require('path');
// const http = require("http").Server(app)
// const io = require('socket.io')(http);
// // Add the route for handling tabs
// var tabs = require('./server/tabs');
// tabs.setup(app);

// app.use(express.static(path.join(__dirname, 'client')));
//   app.set('view engine', 'pug');
//   app.set('views', path.join(__dirname, 'client/views'));
// // Decide which port to use
// var port = process.env.PORT ||
//   config.has("port") ? config.get("port") : 8080;

// // Listen for incoming requests
// app.listen(port, function() {
//   console.log(`App started listening on port ${port}`);
// });

//    io.on('connection', (socket)=>{
//     console.log(`New user connected${socket.id}`);
//   }); 
'use strict';

const users = [];

const config = require('config');
const express = require('express');
const app = express();
const http = require("http").Server(app);
const io = require('socket.io')(http);
const path = require('path');

// Add the route for handling tabs
const tabs = require('./server/tabs');
tabs.setup(app, io);

app.use(express.static(path.join(__dirname, 'client')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'client/views'));

// Decide which port to use
const port = process.env.PORT || (config.has("port") ? config.get("port") : 8080);

// Listen for incoming requests
http.listen(port, function() {
  console.log(`App started listening on port ${port}`);
});

'use strict';

const users = [];

const config = require('config');
const express = require('express');
const app = express();
const http = require("http").Server(app);
const io = require('socket.io')(http);
const path = require('path');
const websock = require('./server/websocket');

// Add the route for handling tabs
const tabs = require('./server/tabs');
tabs.setup(app, users);

app.use(express.static(path.join(__dirname, 'client')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'client/views'));
websock.start(io);

// Decide which port to use
const port = process.env.PORT || (config.has("port") ? config.get("port") : 8080);

// Listen for incoming requests
http.listen(port, function() {
  console.log(`App started listening on port ${port}`);
});

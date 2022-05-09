const express = require('express')
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const server = express()
const server_port = 3001

server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());
server.use(cookieParser());
const express = require('express')
const server = express()
const server_port = 8080

const blockchain = require('./blockchain')
const db = require('./database')

const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');


server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());
server.use(cookieParser());

server.post('/register', (req, res) => {
    db.register(req.body, res)
})
server.post('/login', (req, res) => {
    db.login(req.body, res);
})
server.post('/create_club', (req, res) => {
    db.createClub(req.body, res)
})
server.post('/my_clubs', (req, res) => {
    db.myClubs(req.body, res);
})
server.post('/goto_club', (req, res) => {
    db.gotoClub(req.body, res)
})
server.post('/join_club', (req, res) => {
    db.joinClub(req.body, res)
})
server.post('/add_member', (req, res) => {
    db.addClubMember(req.body, res)
})
server.post('/add_fee', (req, res) => {
    db.addClubFee(req.body, res)
})

server.post('/clubs', (req, res) => {
    db.allClub(res);
})
server.post('/users', (req, res) => {
    db.allUser(res);
})
server.post('/rmClub', (req, res) => {
    db.rmClub(req.body, res)
})
server.post('/rmUser', (req, res) => {
    db.rmUser(req.body, res)
})


server.listen(server_port, () => {
    blockchain.setCaller()
    db.connenct();
    console.log('capstone server open');
})
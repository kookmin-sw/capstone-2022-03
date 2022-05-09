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

server.get('/', (req, res) => {
    res.send('hello world')
})
server.post('/register', (req, res) => {
    blockchain.makeAccount(req.body.name)
        .then(address => {
            db.register(req.body, address, res)
        })
})
server.post('/login', (req, res) => {
    db.login(req.body, res);
})

server.post('/create_club', (req, res) => {
    // 일반 DB
    db.makeClub(req.body, '', res)
    // 블록체인 사용
})
server.post('/my_club', (req, res) => {
    db.myClubList(req.body, res);
})
server.post('/add_member', (req, res) => {
    db.addMember(req.body, res)
})
server.post('/add_fee', (req, res) => {

})
server.post('/add_receipt', (req, res) => {

})
server.post('/club_receipt', (req, res) => {

})
server.post('/receipt_detail', (req, res) => {

})

server.listen(server_port, () => {
    console.log('capstone server open');
})
db.connenct();
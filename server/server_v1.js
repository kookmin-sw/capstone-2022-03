const express = require('express')
const server_v1 = express()
const server_port = 8080

const blockchain = require('./blockchain')
const db = require('./database')

const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');


server_v1.use(bodyParser.urlencoded({extended: true}));
server_v1.use(bodyParser.json());
server_v1.use(cookieParser());

server_v1.post('/register', (req, res) => {
    blockchain.makeAccount(req.body.name)
        .then(address => {
            db.register(req.body, address, res)
        })
})
server_v1.post('/login', (req, res) => {
    db.login(req.body, res);
})
server_v1.post('/create_club', (req, res) => {
    // 일반 DB
    db.createClub(req.body, '', res)
    // 블록체인 사용
})
server_v1.post('/my_clubs', (req, res) => {
    db.myClubs(req.body, res);
})
server_v1.post('/goto_club', (req, res) => {
    db.gotoClub(req.body, res)
})
server_v1.post('/add_member', (req, res) => {
    db.addMember(req.body, res)
})
server_v1.post('/add_fee', (req, res) => {
    db.addFee(req.body, res)
})
server_v1.post('/join_club', (req, res) => {
    db.joinClub(req.body, res)
})


server_v1.post('/user_address', (req, res) => {
    db.userAddress(req.body, res)
})
server_v1.post('/clubs', (req, res) => {
    db.allClub(res);
})
server_v1.post('/users', (req, res) => {
    db.allUser(res);
})
server_v1.post('/rmClub', (req, res) => {
    db.rmClub(req.body)
    res.send('done')
})
server_v1.post('/rmUser', (req, res) => {
    db.rmUser(req.body, res)
})


server_v1.post('/add_receipt', (req, res) => {

})
server_v1.post('/club_receipt', (req, res) => {

})
server_v1.post('/receipt_detail', (req, res) => {

})



server_v1.listen(server_port, () => {
    console.log('capstone server_v1 open');
})

db.connenct();
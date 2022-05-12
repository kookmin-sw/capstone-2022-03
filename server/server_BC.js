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
    blockchain.makeAccount(req.body.name)
        .then(address => {
            blockchain.unlockAccount(address, req.body.name)
                .then(() => {
                    db.register(req.body, address, res)
                })
        })
})
server.post('/login', (req, res) => {
    db.login(req.body, res);
})
server.post('/create_club', (req, res) => {
    if (req.body.flag === 'BC'){
        blockchain.createClub(req.body)
            .then((contract) => {
                db.createBlockchainClub(req.body, contract.options.address, res)
            })
    }
    else if (req.body.flag === 'DB') {
        db.createClub(req.body, res)
    }
})
server.post('/my_clubs', (req, res) => {
    db.userJoinedClub(req.body).then((joined_club) => {
        db.myClubs(joined_club, res)
    })
})
server.post('/goto_club', (req, res) => {
    db.clubInfo(req.body, res)
})


server.listen(server_port, () => {
    blockchain.setCaller();
    db.connenct();
    console.log('capstone server open');
})
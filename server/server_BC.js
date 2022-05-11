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
    // 블록체인 사용
    if (req.body.flag == 'BC'){
        blockchain.createClub(req.body)
            .then((contract) => {
                db.createClubBC(req.body, contract, contract.options.address, res)
            })
    // 일반DB 사용
    } else if (req.body.flag == 'DB') {
        db.createClub(req.body, res)
    }
})
server.post('/my_clubs', (req, res) => {
    if(req.body.flag == 'BC'){
        db.getUserContracts(req.body)
            .then((contract_list) => {
                blockchain.myClubs(contract_list, res)
            })
    } else if(req.body.flag == 'DB') {
        db.myClubs(req.body, res);
    }
})
server.post('/goto_club', (req, res) => {
    db.gotoClub(req.body, res)
})


server.post('/add_member', (req, res) => {
    if(req.body.flag == true){
        db.getUserInfo(req.body.member_name, req.body.member_email)
            .then(userInfo => {
                blockchain.addClubMember(req.body, userInfo)
            })
    }
    db.addMember(req.body, res)
})
server.post('/add_fee', (req, res) => {
    if (req.body.flag == true) {
        blockchain.addFee(req.body)
    }
    db.addFee(req.body, res)
})
server.post('/join_club', (req, res) => {
    db.joinClub(req.body, res)
})


server.post('/user_address', (req, res) => {
    db.userAddress(req.body, res)
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


server.post('/add_receipt', (req, res) => {

})
server.post('/club_receipt', (req, res) => {

})
server.post('/receipt_detail', (req, res) => {

})



server.listen(server_port, () => {
    blockchain.setCaller();
    console.log('capstone server open');
})

db.connenct();
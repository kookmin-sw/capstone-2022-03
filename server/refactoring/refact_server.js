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

server.post('/', (req, res) => {

})
server.post('/register', (req, res) => {
    db.register(req.body);
})
server.post('/login', (req, res) => {

})

server.post('/create_club', (req, res) => {

})
server.post('/my_club', (req, res) => {

})
server.post('/add_member', (req, res) => {

})
server.post('/add_fee', (req, res) => {

})
server.post('/add_receipt', (req, res) => {

})
server.post('/club_receipt', (req, res) => {

})
server.post('/receipt_detail', (req, res) => {

})





// server.post('/create_club/blockchain', (req, res) => {
//     blockchain.makeClub(req.body.caller, req.body.club_title, req.body.bank_number, req.body.bank_name, req.body.user_id)
// })
// server.post('/create_receipt/blockchain', (req,res) => {
//     blockchain.makeReceipt(req.body.caller, req.body.place, req.body.date, req.body.detail, req.body.amount)
//         .then(result => {
//             // result is the contract of receipt
//             blockchain.addClubReceipt(req.body.caller, req.body.contract, result)
//         })
// })
// server.post('/add_member/blockchain', (req, res) => {
//
// })
// server.post('/add_fee/blockchain', (req, res) => {
//
// })
// server.post('/add_receipt/blockchain', (req, res) => {
//
// })
// server.post('/club_receipt/blockchain', (req, res) => {
//
// })
// server.post('/receipt_detail/blockchain', (req, res) => {
//
// })


db.connenct();
server.listen(server_port, () => {
    console.log('server open');
})


// for test
// const caller = '0x424a3aA3407FC509a58297Fe774D0AA48fbF81b7'
// let receipt_contracts = [];
// let club_contracts = [];
// server.get('/1', (req, res) => {
//     blockchain.makeClub(caller, 'ato')
//         .then(result => {
//             club_contracts.push(result);
//         })
//     res.send('1')
//     console.log('1')
// })
// server.get('/2', (req, res) => {
//     blockchain.makeReceipt(caller, 'place3', 'date3', 'detail3', 1000)
//         .then((result) => {
//             receipt_contracts.push(result)
//         })
//     res.send('2')
//     console.log('2')
// })
// server.get('/3', (req, res) => {
//     blockchain.addClubReceipt(caller, club_contracts[0], receipt_contracts[0])
//     console.log('3')
// })
// server.get('/4', (req, res) => {
//     blockchain.getClubReceipts(caller, club_contracts[0])
//         .then(result => {
//             console.log(result)
//             res.send(result)
//         })
//     console.log('4')
// })
// server.get('/5', (req, res) => {
//     blockchain.getClubBalance(caller, club_contracts[0])
//         .then(result => {
//             console.log(result)
//             res.send(result)
//         })
// })

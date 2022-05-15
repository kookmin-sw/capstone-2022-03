const express = require('express')
const server = express()
const server_port = 8080

const db = require('./database')

const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());
server.use(cookieParser());

// 회원가입
server.post('/register', (req, res) => {
    db.register(req.body, res)
})
// 로그인
server.post('/login', (req, res) => {
    db.login(req.body, res);
})
// 모임 생성
server.post('/create_club', (req, res) => {
    db.createClub(req.body, res)
})
// 모임 리스트 정보 리프레시
server.post('/my_clubs', (req, res) => {
    db.userClubInfo(req.body, res);
})
// 모임 정보 리프레시
server.post('/goto_club', (req, res) => {
    db.gotoClub(req.body, res)
})
// 모임 참가
server.post('/join_club', (req, res) => {
    db.joinClub(req.body, res)
})
// 총무 추가
server.post('/add_member', (req, res) => {
    db.addClubMember(req.body, res)
})
// 회비 추가
server.post('/add_fee', (req, res) => {
    db.addClubFee(req.body, res)
})
// 영수증 추가(회비 차감)
server.post('/add_receipt', (req, res) => {
    db.addClubReceipt(req.body, res)
})
// 영수증 내역 조회
server.post('/club_receipt', (req, res) => {
    db.clubReceipts(req.body, res)
})
// 현재 총무 확인
server.post('/joined_member', (req, res) => {
    db.getJoinedMember(req.body, res);
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
    db.connenct();
    console.log('capstone server open');
})
const express = require('express')
const server = express()
const server_port = 3001

const main = require('./main_logic')

const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());
server.use(cookieParser());

// 회원가입
server.post('/register', (req, res) => {
    main.register(req.body, res)
})
// 로그인
server.post('/login', (req, res) => {
    main.login(req.body, res);
})
// 모임 생성
server.post('/create_club', (req, res) => {
    main.createClub(req.body, res)
})
// 모임 리스트 정보 리프레시
server.post('/my_clubs', (req, res) => {
    main.userClubInfo(req.body, res);
})
// 모임 정보 리프레시
server.post('/goto_club', (req, res) => {
    main.gotoClub(req.body, res)
})
// 모임 참가
server.post('/join_club', (req, res) => {
    main.joinClub(req.body, res)
})
// 총무 추가
server.post('/add_member', (req, res) => {
    main.addClubMember(req.body, res)
})
// 회비 추가
server.post('/add_fee', (req, res) => {
    main.addClubFee(req.body, res)
})
// 영수증 추가(회비 차감)
server.post('/add_receipt', (req, res) => {
    main.addClubReceipt(req.body, res)
})
// 영수증 내역 조회
server.post('/club_receipt', (req, res) => {
    main.clubReceipts(req.body, res)
})
// 현재 총무 확인
server.post('/joined_member', (req, res) => {
    main.getJoinedMember(req.body, res);
})


server.post('/clubs', (req, res) => {
    main.allClub(res);
})
server.post('/users', (req, res) => {
    main.allUser(res);
})
server.post('/rmClub', (req, res) => {
    main.rmClub(req.body, res)
})
server.post('/rmUser', (req, res) => {
    main.rmUser(req.body, res)
})


server.listen(server_port, () => {
    main.connenct();
    console.log('capstone server open');
})
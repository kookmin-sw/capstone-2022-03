const express = require('express')
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const server = express()
const server_port = 7000

server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());
server.use(cookieParser());

const mongoose = require('mongoose')
const config = require("./config/key");
const {User} = require("./model/User");

mongoose.connect(config.mongoURI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))





//////////////////////////////////////////// 로그인 및 회원가입 - 상윤
server.get('/', (req, res) => {
    res.send('joined server');
})
server.post('/register', (req, res) => {
    //회원가입 할때 필요한 정보들을 client에서 가져오면 그것들을 database에 넣어준다.
    const user = new User(req.body)

    // 비밀번호의 경우 암호화 필요, 이때 mongoose의 기능이용, 따라서 User.js에서 암호화 작업 진행후
    user.save((err, userInfo) => {
        if(err) return res.json({ success: false,  err})

        const blockchain_pw = userInfo._id;
        web3.eth.personal.newAccount(blockchain_pw).then(result => {
            console.log("생성된 주소 : ", result);
        })
        return res.status(200).json({
            success: true
        })
    })

})

server.post('/login', (req, res) => {
    // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({email : req.body.email}, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다!"
            })
        }
        // 요청된 이메일이 데이터베이스에 있다면, 비밀번호가 맞는 비밀번호인지 확인.
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch)
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
            // 비밀번호 까지 맞다면 토큰을 생성하기.
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);

                //토큰을 저장한다. 어디에? 쿠키에 저장
                res.cookie("x_auth",user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user,_id})
            })
        })
    })
})
//.then(() => {console.log("회원가입 완료!")});
// 로그인 및 회원가입 : 상윤

//////////////////////////////////////////// 블록체인 - 성열
const url = require('url');
const path = require('path');
const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');
const blockchain_endpoint = 'http://10.30.114.177:8546';
const web3 = new Web3(Web3.givenProvider || blockchain_endpoint);

contract_list = []
user_address = {};

server.get('/blockchain', (req,res) =>{
    res.send('blockchain page');

    let req_components = url.parse(req.url, true).query;
    let command = req_components.command;

    //mock-up
    const caller = "0xA291948917c682461eD5432E8D128047e4928517";
    const club_id = 0;
    const member_address = "0x8A0Aa65FBb5caf12FFa5616F75EAa69966068A2E";
    const payment_amount = 100000;
    const money = 300000;
    const payment_place = "kookmin univ";
    const user_name = 'ato';
    const member_name = 'tony';
    const member_department = 'first_depart'
    //mock-up

    // change part
    // let caller = 앱에 로그인한 유저의 전자지갑 주소
    // let club_id = 현재 보고있는 모임의 고유번호
    // let member_address = 참가시킬 사람의 아이디 -> 전자지갑 주소 참조
    // let member_name = 참가시킬 사람의 아이디 -> nickname 참조
    // let money = 이미지 처리로 추출된 회비 입금 금액
    // let payment_place = 이미지 처리로 추출된 결제 장소
    // let payment_amount = 이미지 처리로 추출된 영수증의 총 금액
    // let user_name = 모임 회장의 이름
    // let member_department = 참가시킬 부서명
    // change part


    console.log('\n==== command : ', command);
    switch (command)  {
        case ('create_club') :    // address caller, string user_name
            createClub(caller, user_name);
            break;
        case ('add_member'):
            addMember(caller, club_id, member_address, member_name, member_department);
            break;
        case ('get_member'):
            getMembers(caller, club_id);
            break;
        case ('add_money'):
            addMoney(caller, club_id, money);
            break;
        case ('get_money'):
            getMoney(caller, club_id);
            break
        case ('add_receipt'):
            addReceipt(caller, club_id, payment_place, payment_amount);
            break;
        case('get_receipt'):
            getReceipt(caller, club_id);
            break;
        default:
            break;
    }
})

function compile() {
    const filePath = path.resolve(__dirname, 'contracts', 'capstone_receipt.sol');
    const source_code = fs.readFileSync(filePath, 'utf8');
    const solidity_compile_input = {
        language: 'Solidity',
        sources: {
            'capstone_receipt.sol' : {
                content: source_code
            }
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': [ '*' ]
                }
            }
        }
    };
    const solidity_compiled_result = JSON.parse(solc.compile(JSON.stringify(solidity_compile_input)));
    return solidity_compiled_result.contracts["capstone_receipt.sol"].capstone_receipt;

}
async function createAccount(password) {
    await web3.cre
}
async function deploy(caller, user_nickname) {
    const solidity_compiled_result = compile();
    const interface = solidity_compiled_result.abi;
    const bytecode = solidity_compiled_result.evm.bytecode.object;

    const deployed_contract = await new web3.eth.Contract(interface)
        .deploy({data : bytecode, arguments : [user_nickname]})
        .send({gas : '3000000' , from : caller});

    return deployed_contract;
}
async function createClub(caller, user_name) {
    console.log('start creating new club');

    deploy(caller, user_name).then(result => {
        contract_list.push(result);
        console.log('finish creating new club');
    });
}

async function createAccount(blockchain_pw) {
    await web3.eth.personal.newAccount(blockchain_pw)
        .then((result) => {
            console.log(result);
            return result;
        })
}
async function addMember(caller, club_id, member_address, member_name, member_department) {
    console.log('start adding new member');
    await contract_list[club_id].methods.addMember(member_address, member_name, member_department).send({from:caller, gas:'3000000'})
        .then(console.log('finish adding new member'));
}
async function getMembers(caller, club_id){
    await contract_list[club_id].methods.getMembers().call({from : caller})
        .then(result => {
            console.log('members : ', result);
        });
}
async function addMoney(caller, club_id, money) {
    console.log('start adding money');
    await contract_list[club_id].methods.addMoney(money).send({from : caller, gas : '3000000'})
        .then(console.log('finish adding money'));
}
async function getMoney(caller, club_id) {
    await contract_list[club_id].methods.getMoney().call({from: caller})
        .then(result => {
            console.log('money : ', result);
        })
}
async function addReceipt(caller, club_id, payment_place, payment_amount) {
    console.log('start adding new Receipt');
    await contract_list[club_id].methods.addReceipt(payment_place, payment_amount).send({from : caller, gas : '3000000'})
        .then((result) => {
            console.log('finish adding new Receipt');
        }).catch((err) => {
            console.log('Not enough money');
        })
}
async function getReceipt(caller, club_id) {
    await contract_list[club_id].methods.getReceipts().call({from:caller})
        .then(result => { console.log('Receipt : ', result)});
}




server.listen(server_port, () => {
    console.log('server open');
})
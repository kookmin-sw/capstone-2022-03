const express = require('express')
const server = express()
const server_port = 7000

const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose')
const config = require("./config/key");
const {User} = require("./model/User");


server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());
server.use(cookieParser());

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

    web3.eth.personal.newAccount(user._id)
        .then((result)=>{
            console.log("생성된 주소 : ", result);
            user['address'] = result;
        }).then(result => {
        user.save((err, userInfo) => {
            if(err) return res.json({ success: false,  err})
            console.log(String(userInfo._id))
            return res.status(200).json({
                success: true
            })
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






//////////////////////////////////////////// 블록체인 - 성열
const path = require('path');
const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');
const blockchain_endpoint = 'http://10.30.114.49:8546';
const web3 = new Web3(Web3.givenProvider || blockchain_endpoint);

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
        contract_objects.push(result);
        console.log('finish creating new club');
        console.log(result);
    });
}
async function addMember(caller, club_id, member_address, member_name, member_department) {
    console.log('start adding new member');
    await contract_objects[club_id].methods.addMember(member_address, member_name, member_department).send({from:caller, gas:'3000000'})
        .then(console.log('finish adding new member'));
}
async function getMembers(caller, club_id){
    await contract_objects[club_id].methods.getMembers().call({from : caller})
        .then(result => {
            console.log('members : ', result);
        });
}
async function addMoney(caller, club_id, money) {
    console.log('start adding money');
    await contract_objects[club_id].methods.addMoney(money).send({from : caller, gas : '3000000'})
        .then(console.log('finish adding money'));
}
async function getMoney(caller, club_id) {
    await contract_objects[club_id].methods.getMoney().call({from: caller})
        .then(result => {
            console.log('money : ', result);
        })
}
async function addReceipt(caller, club_id, payment_place, payment_amount) {
    console.log('start adding new Receipt');
    await contract_objects[club_id].methods.addReceipt(payment_place, payment_amount).send({from : caller, gas : '3000000'})
        .then((result) => {
            console.log('finish adding new Receipt');
        }).catch((err) => {
            console.log('Not enough money');
        })
}
async function getReceipt(caller, club_id) {
    await contract_objects[club_id].methods.getReceipts().call({from:caller})
        .then(result => { console.log('Receipt : ', result)});
}

contract_objects = []

server.post('/blockchain', (req,res) =>{
    res.send('blockchain page');
    const body = req.body;

    console.log('\n==== command : ', body.command);
    switch (body.command)  {
        // body : command, caller, user_name
        case ('create_club') :    // address caller, string user_name
            createClub(body.caller, body.user_name);
            break;
        // body : command, caller, club_id, member_address, member_name, member_department
        case ('add_member'):
            addMember(body.caller, body.club_id, body.member_address, body.member_name, body.member_department);
            break;
        // body : command, caller, club_id
        case ('get_member'):
            getMembers(body.caller, body.club_id);
            break;
        // body : command, caller, club_id, money
        case ('add_money'):
            addMoney(body.caller, body.club_id, body.money);
            break;
        // body : command, caller, club_id
        case ('get_money'):
            getMoney(body.caller, body.club_id);
            break
        // body : command, caller, club_id, payment_place, payment_amount
        case ('add_receipt'):
            addReceipt(body.caller, body.club_id, body.payment_place, body.payment_amount);
            break;
        // body : command, caller, club_id
        case('get_receipt'):
            getReceipt(body.caller, body.club_id);
            break;
        default:
            console.log('wrong command')
            break;
    }
})

server.listen(server_port, () => {
    console.log('server open');
})

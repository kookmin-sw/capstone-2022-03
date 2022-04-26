
const path = require('path');   // to access the default contract
const fs = require('fs');       // to access the default contract
const solc = require('solc');   // to compile the smart contract
const Web3 = require('web3');   // to communicate with the blockchain network
const http = require('http');   // to create http server
const url = require('url');

const endpoint = 'http://10.30.114.177:8546';
const server_port = 8080;
const web3 = new Web3(Web3.givenProvider || endpoint);

contract_list = []
user_address = {}; // 유저 id를 유저 address와 매핑

console.log('server open')
http.createServer((req, res) => {
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

    console.log('\n==== command : ', command);
    switch (command)  {
        case ('create_club') :    // address caller, string user_name
            createClub(caller, user_name);
            break;
        case ('add_member'):
            addMember(caller, club_id, member_address,member_name, member_department);
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
}).listen(server_port);

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
async function deploy(user_address, user_nickname) {
    const solidity_compiled_result = compile();
    const interface = solidity_compiled_result.abi;
    const bytecode = solidity_compiled_result.evm.bytecode.object;

    const deployed_contract = await new web3.eth.Contract(interface)
        .deploy({data : bytecode, arguments : [user_nickname]})
        .send({gas : '3000000' , from : user_address});

    return deployed_contract;
}

async function createClub(caller, user_name) {
    console.log('start creating new club');

    deploy(caller, user_name).then(result => {
        contract_list.push(result);
        console.log('finish creating new club');
    });
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
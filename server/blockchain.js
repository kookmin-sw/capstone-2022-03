const Web3 = require('web3');
const blockchain_endpoint = 'http://127.0.0.1:8888';
const web3 = new Web3(Web3.givenProvider || blockchain_endpoint);
const compile = require('./compile')
const {User} = require("./model/User");
const {Club} = require("./model/Club");

// register 명령 실행 시 사용
// input : user.name
// output : address
let caller;
exports.setCaller = async function () {
    await web3.eth.getAccounts().then(result => { caller = result[0]} )
}
exports.makeAccount = async function (id) {
    return await web3.eth.personal.newAccount(id);
}
exports.unlockAccount = async function(address, pw) {
    await web3.eth.personal.unlockAccount(address, pw, 0)
}

// create_club 명령 실행 시 사용
// input(7) : { club_title, club_bank_account, club_bank_name, club_bank_holder, user_id, user_name , user_address }
// output : contract
exports.createClub = async function (data) {
    const compile_result = compile.club();

    let contract;
    await new web3.eth.Contract(compile_result[0])
        .deploy({ data : compile_result[1], arguments: [data.club_title, data.club_bank_name, data.club_bank_account, data.club_bank_holder, data.user_address, data.user_id, data.user_name]})
        .send({ from : caller, gas : 3000000 })
        .then((result) => {
            contract = result;
        })
    return contract;
}

exports.myClubs = async function (contract_list, res) {
    console.log(contract_list.length)
    let temp = []

    for(let index in contract_list) {
        await contract_list[index].methods.clubInfo()
            .call({from : caller})
            .then(result => { console.log(result)})
    }
}
// add_member 명령 실행 시 사용
// input : req.body, userInfo
// output : none
exports.addClubMember = async function(data, memberInfo) {
    try {
        await data.contract.methods.addMember(memberInfo.address, memberInfo._id, data.department)
            .send({ from : data.user_address, gas : 3000000 })
    } catch {
        console.log('caller is not a leader');
    }
}


// add_fee 명령 실행 시 사용
// input : req.body
// output : none
exports.addFee = async function(data) {
    try {
        await data.contract.methods.addFee(data.fee)
            .send({ from : data.user_address, gas : 3000000 })
    } catch {
        console.log('caller is not a leader')
    }
}

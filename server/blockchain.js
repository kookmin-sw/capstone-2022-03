const Web3 = require('web3');
// const blockchain_endpoint = 'http://172.31.8.46:8545';
const blockchain_endpoint = 'http://127.0.0.1:8888'
const web3 = new Web3(new Web3.providers.HttpProvider(blockchain_endpoint));
const compile = require('./compile')

let caller;
exports.setCaller = function () {
    web3.eth.getAccounts().then(async(result) => {
        caller = result[0]
        await web3.eth.personal.unlockAccount(result[0], "123", 0)
    })
}
exports.makeAccount = async function (id) {
    return await web3.eth.personal.newAccount(id);
}
exports.unlockAccount = async function(address, id) {
    await web3.eth.personal.unlockAccount(address, id, 0)
}
exports.createClub = async function (data) {
    const compile_result = compile.club();

    return new web3.eth.Contract(compile_result[0])
        .deploy({
            data: compile_result[1],
            arguments: [data.club_title, data.club_bank_name, data.club_bank_account, data.club_bank_holder, data.user_address, data.user_id, data.user_name]
        })
        .send({from: caller, gas: 3000000})
}
exports.clubInfo = async function(address) {
    const abi = compile.club()[0]
    let temp_contract = new web3.eth.Contract(abi, address);
    let club_info = {}

    return await temp_contract.methods.clubInfo()
        .call({ from : caller })
        .then(result => {
            club_info = {
                club_title : result[0],
                club_balance : result[1],
                club_leader : result[2],
                users : result[3]
            }
            return club_info
        })
}
exports.clubReceipt = async function(address) {
    const abi = compile.club()[0]
    let temp_contract = new web3.eth.Contract(abi, address);
    let receipt_info_list = []

    return await temp_contract.methods.receiptInfo()
        .call({from : caller})
        .then(result => {
            for (let item of result) {
                let details = []
                for (let index =0; index < item[4].length; index = index+2) {
                    details.push({item_name : item[4][index], item_cost : item[4][index+1]})
                }
                receipt_info_list.push({
                    owner : item[0],
                    place : item[1],
                    cost : item[3],
                    date : item[2],
                    detail : details
                })
            }
            return receipt_info_list
        })
}
exports.addClubUser = async function(address, data) {
    const abi = compile.club()[0]
    let temp_contract = new web3.eth.Contract(abi, address);

    await temp_contract.methods.addUser(data.user_address, data.user_id, data.user_name, 'no_depart')
        .send({ from : caller, gas : 3000000 })
}
exports.addClubMember = async function(address, data, department) {
    const abi = compile.club()[0]
    let temp_contract = new web3.eth.Contract(abi, address);

    await temp_contract.methods.addMember(data.address, data._id, data.name, department)
        .send({ from : caller, gas : 3000000 })
}
exports.addClubFee = async function(address, fee) {
    const abi = compile.club()[0]
    let temp_contract = new web3.eth.Contract(abi, address);

    return await temp_contract.methods.addBalance(fee)
        .send({ from : caller, gas : 3000000 })
        .then(() => {
            return temp_contract.methods.getBalance()
                .call({ from : caller })
        })
}
exports.addClubReceipt = async function(address, data) {
    const abi = compile.club()[0]
    let temp_contract = new web3.eth.Contract(abi, address);

    // 블록체인에 넣기 위한 데이터 가공 과정
    let item = []
    for (let i of data.detail) {
        item.push(i.item_name)
        item.push(String(i.item_cost))
    }

    await temp_contract.methods.addReceipt(data.owner, data.place, data.date, data.cost, item)
        .send({ from : caller, gas : 3000000 })
}
exports.clubBalance = async function(address) {
    const abi = compile.club()[0]
    let temp_contract = new web3.eth.Contract(abi, address);

    return await temp_contract.methods.getBalance()
        .call({ from : caller })
}
exports.clubUsers = async function(address) {
    const abi = compile.club()[0]
    let temp_contract = new web3.eth.Contract(abi, address);

    return await temp_contract.methods.userInfo()
        .call({ from : caller })
}
exports.clubMembers = async function(address) {
    const abi = compile.club()[0]
    let temp_contract = new web3.eth.Contract(abi, address);

    return await temp_contract.methods.memberInfo()
        .call({ from : caller })
}
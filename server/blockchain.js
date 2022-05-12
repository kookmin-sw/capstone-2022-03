const Web3 = require('web3');
const blockchain_endpoint = 'http://127.0.0.1:8888';
const web3 = new Web3(new Web3.providers.HttpProvider(blockchain_endpoint));
const compile = require('./compile')

let caller;
exports.setCaller = async function () {
    await web3.eth.getAccounts().then(result => {
        caller = result[0]
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
            club_info = { title : result[0], balance : result[1], leader : result[2], users : result[3] }
            return club_info
        })
}

exports.clubReceipt = async function(address) {
    const abi = compile.club()[0]
    let temp_contract = new web3.eth.Contract(abi, address);

}
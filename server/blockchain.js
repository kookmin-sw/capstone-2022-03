const Web3 = require('web3');
const blockchain_endpoint = 'http://172.31.8.46:8545';
// const blockchain_endpoint = 'http://10.223.117.196:8545'
const web3 = new Web3(new Web3.providers.HttpProvider(blockchain_endpoint));
const compile = require('./compile')

let ABI_code = compile.club()[0];
let byte_code = compile.club()[1]
let admin;

const blockchain_initialize = async function () {
    admin = await web3.eth.getAccounts().then(accounts => { return accounts[0]})
    await web3.eth.personal.unlockAccount(admin, "123", 0)
}

// 회원가입
exports.makeAccount = async function (id) {
    return await web3.eth.personal.newAccount(id).then(account => {
        web3.eth.sendTransaction(({ from : admin, to : account, value : 10000000000000000000 }))
        return account
    })
}

// 로그인
exports.unlockAccount = function(address, pw) {
    web3.eth.personal.unlockAccount(address, pw, 0);
}

// 블록체인 모임 생성
exports.createClub = async function (body) {
    return new web3.eth.Contract(ABI_code)
        .deploy({ data: byte_code, arguments: [body.club_title, body.club_bank_name, body.club_bank_account, body.club_bank_holder, body.user_address, body.user_id, body.user_name]})
        .send({ from: body.user_address, gas : 90000000 })
        .then((contract) => { return contract.options.address })
}
//
exports.clubInfo = async function(contract_address, caller) {
    let target_contract = new web3.eth.Contract(ABI_code, contract_address);

    return await target_contract.methods.clubInfo()
        .call({ from : caller })
        .then((club_info) => {
            return {
                club_title : club_info['title'],
                club_balance : club_info['balance'],
                club_leader : club_info['name'],
                club_leader_id : club_info['id'],
                users : club_info['user_size'],
                time : club_info['deployed_time']
            }
        })
}
exports.addClubUser = async function(address, caller, data) {
    let target_contract = new web3.eth.Contract(ABI_code, address);

    await target_contract.methods.addUser(data.user_address, data.user_id, data.user_name, 'none')
        .send({ from : caller, gas : 90000000 })
}


exports.clubReceipt = async function(address, caller) {
    let target_contract = new web3.eth.Contract(ABI_code, address);
    let receipt_info_list = []

    return await target_contract.methods.receiptInfo()
        .call({from : caller})
        .then(result => {
            for (let item of result) {
                let details = []
                for (let index =0; index < item['detail'].length; index = index+2) {
                    details.push({
                        item_name : item['detail'][index],
                        item_cost : parseInt(item['detail'][index+1]),
                    })
                }
                receipt_info_list.push({
                    owner : item['owner'],
                    place : item['place'],
                    cost : item['cost'],
                    date : item['date'],
                    image : item['image1'] + item['image2'],
                    mime : item['mime'],
                    detail : details
                })
            }
            return receipt_info_list
        })
}
exports.addClubMember = function(address, caller, data) {
    let target_contract = new web3.eth.Contract(ABI_code, address);

    target_contract.methods.addMember(data.address, String(data._id), data.name, 'none')
        .send({ from : caller, gas : 90000000 })
}
exports.addClubFee = async function(address, caller, fee) {
    let target_contract = new web3.eth.Contract(ABI_code, address);

    return await target_contract.methods.addBalance(fee)
        .send({ from : caller, gas : 90000000 })
        .then(() => {
            return target_contract.methods.balanceInfo()
                .call({ from : caller })
        })
}
exports.addClubReceipt = async function(address, caller, data) {
    let target_contract = new web3.eth.Contract(ABI_code, address);

    // 블록체인에 넣기 위한 데이터 가공 과정
    let item = []
    for (let i of data.detail) {
        item.push(i.item_name)
        item.push(String(i.item_cost))
    }

    const size_image = data.image.length
    let image1 = data.image.slice(0, size_image/2)
    let image2 = data.image.slice(size_image/2 , size_image)
    await target_contract.methods.addReceipt(data.owner, data.place, data.date, data.cost, image1, image2, data.mime, item)
        .send({ from : caller, gas : 800000000 })
}
exports.clubBalance = async function(address, caller) {
    let target_contract = new web3.eth.Contract(ABI_code, address);

    return await target_contract.methods.balanceInfo()
        .call({ from : caller })
}
exports.clubUsers = async function(address, caller) {
    let target_contract = new web3.eth.Contract(ABI_code, address);

    return await target_contract.methods.userInfo()
        .call({ from : caller })
}
exports.clubMembers = async function(address, caller) {
    let target_contract = new web3.eth.Contract(ABI_code, address);

    return await target_contract.methods.memberInfo()
        .call({ from : caller })
}

blockchain_initialize()
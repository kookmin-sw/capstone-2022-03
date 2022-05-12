const Web3 = require('web3');
const blockchain_endpoint = 'http://10.30.118.151:8545';
const web3 = new Web3(new Web3.providers.HttpProvider(blockchain_endpoint));
const compile = require('./compile')

// register 명령 실행 시 사용
// input : user.name
// output : address
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

exports.abiClub = function() {
    const compile_result = compile.club()
    return compile_result[0]
}
// create_club 명령 실행 시 사용
// input(7) : { club_title, club_bank_account, club_bank_name, club_bank_holder, user_id, user_name , user_address }
// output : contract
exports.createClub = async function (data) {
    const compile_result = compile.club();

    return new web3.eth.Contract(compile_result[0])
        .deploy({
            data: compile_result[1],
            arguments: [data.club_title, data.club_bank_name, data.club_bank_account, data.club_bank_holder, data.user_address, data.user_id, data.user_name]
        })
        .send({from: caller, gas: 3000000})
}
exports.aa = async function(address) {
    const compile_result = compile.club();
    let contract = new web3.eth.Contract(compile_result[0])

    const instance = contract.at(address[0])
    console.log(instance)
}

exports.myClubs = async function (address_list, abi, res) {
    let return_info = []

    // console.log('2: ', address_list)

    const info = async function() {
        for(let address of address_list) {
            // console.log('3 : ', address)
            let target_contract = new web3.eth.Contract(abi, address);

            await target_contract.methods.clubInfo()
                .call({ from : caller })
                .then(result => {
                    const temp = { title : result[0], balance : result[1], leader : result[2], users : result[3] }
                    return_info.push(temp)
                })
        }
        return return_info;
    }
    return await info().then(result => {
        res.json({ message : result })
    })
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

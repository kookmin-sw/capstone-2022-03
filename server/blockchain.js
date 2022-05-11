const Web3 = require('web3');
const blockchain_endpoint = 'http://127.0.0.1:8888';
const web3 = new Web3(Web3.givenProvider || blockchain_endpoint);
const compile = require('./compile')

// register 명령 실행 시 사용
// input : user.name
// output : address
exports.makeAccount = async function (id) {
    return await web3.eth.personal.newAccount(id);
}

// create_club 명령 실행 시 사용
// input : req.body
// output : contract
exports.createClub = async function (data) {
    const compile_result = compile.club();

    return await new web3.eth.Contract(compile_result[0])
        .deploy({ data : compile_result[1], arguments: [data.club_title, data.club_bank_account, data.club_bank_name, data.club_bank_holder, data.user_name]})
        .send({ from : data.user_address, gas : 3000000 })
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

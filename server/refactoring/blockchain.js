const Web3 = require('web3');
const blockchain_endpoint = 'http://127.0.0.1:8888';
const web3 = new Web3(Web3.givenProvider || blockchain_endpoint);
const compile = require('./compile')

// receipt part
exports.makeReceipt = async function (caller, place, date, detail, amount) {
    // compile_result[0] = abi, [1] = bytecode
    const compile_result = compile.receipt()

    await new web3.eth.Contract(compile_result[0])
        .deploy({ data : compile_result[1], arguments: [place, date, detail, amount]})
        .send({ from : caller, gas : 3000000 })
        .then(result => { return result })
}
exports.getReceiptPlace = async function (caller, contract) {
    return await contract.methods.getPlace()
        .call({ from : caller })
}
exports.getReceiptDate = async function (caller, contract) {
    return await contract.methods.getDate()
        .call({ from : caller })
}
exports.getReceiptDetail = async function (caller, contract) {
    return await contract.methods.getDetail()
        .call({ from : caller })
}
exports.getReceiptAmount = async function (caller, contract) {
    return await contract.methods.getAmount()
        .call({ from : caller })
}






// club part
exports.makeClub = async function (caller, leader_name) {
    // compile_result[0] = abi, [1] = bytecode
    const compile_result = compile.club()

    await new web3.eth.Contract(compile_result[0])
        .deploy({ data : compile_result[1], arguments: [leader_name]})
        .send({ from : caller, gas : 3000000 })
        .then(result => { return result })
}
exports.getClubLeader = async function (caller, contract) {
    return await contract.methods.getLeader()
        .call({ from : caller })
}
exports.getClubMembers = async function (caller, contract) {
    return await contract.methods.getMembers()
        .call({ from : caller })
}
exports.getClubBalance = async function (caller, contract) {
    return await contract.methods.getMembers()
        .call({ from : caller })
}
exports.getClubReceipts = async function (caller, contract) {
    const receipts_address = await contract.methods.getLeader()
        .call({ from : caller })


}
exports.addClubMember = async function (caller, contract, address, name, department) {
    // caller must be a leader
    try {
        await contract.methods.addMember(address, name, department)
            .send({ from : caller, gas : 3000000 })
    } catch {
        console.log('caller is not a leader');
    }
}
exports.addClubFee = async function (caller, contract, fee) {
    try {
        await contract.methods.addFee(fee)
            .send({ from : caller, gas : 3000000 })
    } catch {
        console.log('caller is not a leader');
    }
}
exports.addReceipt = async function (caller, contract, receipt_address) {
    try {
        await contract.methods.addReceipt(receipt_address)
            .send({ from : caller, gas : 3000000 })
    } catch {
        console.log('caller is not a member');
    }
}
// 여기 중요함 ㅇㅇ
exports.updateClubBalance = async function (caller, contract, payment) {
    try {
        await contract.methods.checkPaymentAmount(payment)
            .call({ from : caller})
    } catch {
        console.log('payment >>>>> balance');
    }
}

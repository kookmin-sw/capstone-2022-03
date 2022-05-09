const Web3 = require('web3');
const blockchain_endpoint = 'http://127.0.0.1:8888';
const web3 = new Web3(Web3.givenProvider || blockchain_endpoint);
const compile = require('./compile')

//
exports.makeAccount = async function (id) {
    return await web3.eth.personal.newAccount(id);
}

// receipt part
exports.makeReceipt = async function (caller, place, date, detail, amount) {
    // compile_result[0] = abi, [1] = bytecode
    const compile_result = compile.receipt()

    return await new web3.eth.Contract(compile_result[0])
        .deploy({ data : compile_result[1], arguments: [place, date, detail, amount]})
        .send({ from : caller, gas : 3000000 })
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
exports.makeClub = async function (caller, club_title, bank_account, bank_name, leader_name) {
    // compile_result[0] = abi, [1] = bytecode
    const compile_result = compile.club();

    return await new web3.eth.Contract(compile_result[0])
        .deploy({ data : compile_result[1], arguments: [club_title, bank_account, bank_name, leader_name]})
        .send({ from : caller, gas : 3000000 })
}
exports.getClubTitle = async function (caller, contract) {
    try {
        return await contract.methods.getClubTitle()
            .call({ from : caller })
    } catch {
        console.log('caller is not a leader');
        return 'not leader';
    }

}
exports.getClubBank = async function (caller, contract) {
    var bank = "";
    try {
        await contract.methods.getBankName()
            .call({ from : caller })
            .then(result => {
                bank = bank + result + " ";

                contract.methods.getBankAccount()
                    .call({ from : caller })
                    .then(result => {
                        bank = bank + result;
                    })

                return bank;
            })
    } catch {
        console.log('caller is not a leader');
        return 'not leader';
    }
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
    return await contract.methods.getBalance()
        .call({ from : caller })
}
exports.getClubReceipts = async function (caller, contract) {
    return await contract.methods.getReceipts()
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
exports.addClubReceipt = async function (caller, club_contract, receipt_contract) {
    try {
        await club_contract.methods.addReceipt(receipt_contract.options.address)
            .send({ from : caller, gas : 3000000 })
    } catch {
        console.log('caller is not a member');
    }

    try {
        await receipt_contract.methods.getAmount()
            .call({ from : caller})
            .then(result => {
                club_contract.methods.addFee(result)
                    .send({ from : caller, gas : 3000000 });
            }).catch(() => {
                console.log('caller is not a leader');
            })
    } catch {
        console.log('클럽 컨트랙트의 밸런스 업데이트하는데 에러남')
    }
}
const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || 'http://172.30.25.115:8546');
let bill_list = [];
let CA_list = [];

// get accounts
async function get_accounts() {
    return await web3.eth.getAccounts();
}
// constructor
async function make_bill(_bill_list, _CA_list) {
    await require('./deploy')
        .then(value => {
            _bill_list.push(value);
            _CA_list.push(value.options.address);
            console.log(bill_list);
        })
}
// 투표하기
async function makeVote(user_id, opinion, sender_address, gas) {
    const accounts = await get_accounts().then(console.log);
    const target_contract = bill_list[0];

    await target_contract.methods.makeVote(user_id, opinion).send({from:accounts[0], gas : '3000000'});
}

make_bill(bill_list, CA_list);
// makeVote(123, true, 1, 1);

// 새로운 법안에 대한 스마트 컨트랙트를 배포하고 bill_list에 CA를 저장한다.
// async function make_bill() {
//     const accounts = await web3.eth.getAccounts();
//     const deployed_contract = await require('./deploy');
//
//     await deployed_contract.methods.makeVote(123, true).send({from:accounts[1], gas : '3000000'});
//     await deployed_contract.methods.resultVote().call({from:accounts[0]}).then(console.log);
//     // bill_list.push(deployed_contract);
//     // CA_list.push(deployed_contract.options.address);
// }
//
// async function make_vote(bill_list, CA_list, bill_index, user_id, opinion) {
//     const target_bill = bill_list[bill_index];
//     const target_CA = CA_list[bill_index];
//
//     await target_bill.methods.makeVote(user_id, opinion)
//         .send({from : accounts[1]});
// }
// //
// async function result_vote(bill_list, CA_list, bill_index) {
//     const target_bill = bill_list[bill_index];
//     const target_CA = CA_list[bill_list];
//     const result = await target_bill.methods.resultVote()
//         .call({from : accounts[0]});
//     console.log(result);
// }
//
// make_bill();
// // make_vote(bill_list, CA_list, bill_index, user_id, opinion);
// // result_vote(bill_list, CA_list, bill_index);

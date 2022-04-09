const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || 'http://172.30.25.115:8546');
let bill_list = [];
let CA_list = [];
let bill_index = 0;
const user_id = 123
const opinion = true;
let accounts;

web3.eth.getAccounts().then(result => {
    console.log("in : " + result);
    accounts = result;
})
console.log(accounts);
//
// async function make_bill() {
//     return await accounts;
// }
// make_bill();

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

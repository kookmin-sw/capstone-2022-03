const express = require('express')
const compile = require('./compile')
const server = express()
const server_port = 8080


const Web3 = require('web3');
const blockchain_endpoint = 'http://172.31.8.46:8545';
const web3 = new Web3(Web3.givenProvider || blockchain_endpoint);






async function makeReceipt(caller, place, date, amount) {
    // compile_result[0] = abi, [1] = bytecode
    const compile_result = compile.receipt()

    await new web3.eth.Contract(compile_result[0])
        .deploy({ data : compile_result[1], arguments: [place, date, amount]})
        .send({ from : caller, gas : 3000000 })
        .then(result => { return result })
}
async function makeClub(caller, name) {
    // compile_result[0] = abi, [1] = bytecode
    const compile_result = compile.club()

    await new web3.eth.Contract(compile_result[0])
        .deploy({ data : compile_result[1], arguments: [name]})
        .send({ from : caller, gas : 3000000 })
        .then(result => { return result })
}
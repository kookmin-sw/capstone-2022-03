const assert = require('assert');
const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || 'http://10.30.118.142:8546');

// compile의 결과값을 interface, bytecode로 가져온다.
const { interface, bytecode} = require('./compile');

let accounts;


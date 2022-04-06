const assert = require('assert');
// ganache로 연결할지 geth로 연결할지 아직 미정이다.
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || 'http://10.30.118.142:8546');

// compile의 결과값을 interface, bytecode로 가져온다.
const { interface, bytecode} = require('./compile');

let accounts;


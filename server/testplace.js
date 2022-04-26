const Web3 = require('web3');
const blockchain_endpoint = 'http://10.30.114.177:8545';
const web3 = new Web3(Web3.givenProvider || blockchain_endpoint);


web3.eth.personal.newAccount("123").then(result=> {console.log(result)})


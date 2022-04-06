const Web3 = require('web3');
const compiled_source = require('./compile');
const interface = compiled_source.abi;
const bytecode = compiled_source.evm.bytecode.object;
const web3 = new Web3(Web3.givenProvider || 'http://10.30.118.142:8546');

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);

    // ABI_CODE(interface), bytecode 를 이용하여 스마트 컨트랙트를 배포할 준비를한다.
    const result = await new web3.eth.Contract(interface)
        .deploy({ data: bytecode, arguments:['test', 111]})
        .send({gas : '3000000', from : accounts[0]});

    console.log('Contract Address : ', result.options.address);
};

deploy();
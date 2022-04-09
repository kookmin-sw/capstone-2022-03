const path = require('path');
const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');


// compile 부분 -----------------------

// 솔리디티 파일을 읽을 주소 설정
const filePath = path.resolve(__dirname, 'contracts', 'Vote1.sol');
// 솔리디티 파일을 string으로 읽어온다.
const source = fs.readFileSync(filePath, 'utf8');
// 아래는 0.8 버전에서 컴파일하기 위한 사전작업
const input = {
    language: 'Solidity',
    sources: {
        'Vote1.sol' : {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [ '*' ]
            }
        }
    }
};
const output = JSON.parse(solc.compile(JSON.stringify(input)));
const output2 = output.contracts["Vote1.sol"].Vote1;

// deploy 부분 -----------------------------------

const interface = output2.abi;
const bytecode = output2.evm.bytecode.object;
const web3 = new Web3(Web3.givenProvider || 'http://172.30.17.86:8546');
const bill_title = "test";
const bill_id = 111;

let contract_addr;
let accounts ;

async function get_accounts() {
    return await web3.eth.getAccounts();
}
get_accounts().then(value => {accounts = value});

async function deploy(accounts) {
    const account = accounts[0];

    const result = await new web3.eth.Contract(interface)
        .deploy({ data: bytecode, arguments:[bill_title, bill_id]})
        .send({gas : '3000000', from : accounts[0]});
    return result.options.address;
}

deploy(accounts).then(value => {
    contract_addr = value;
    console.log(contract_addr)});

// const deploy = async () => {
//     const accounts = await web3.eth.getAccounts();
//
//     // ABI_CODE(interface), bytecode 를 이용하여 스마트 컨트랙트를 배포할 준비.
//     const result = await new web3.eth.Contract(interface)
//         .deploy({ data: bytecode, arguments:[bill_title, bill_id]})
//         .send({gas : '3000000', from : accounts[0]});
//
//     console.log('Contract Address : ', result.options.address);
//     CA = result.options.address;
// };
//
// deploy();
//

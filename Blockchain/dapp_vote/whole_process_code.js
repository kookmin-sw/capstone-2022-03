const path = require('path');
const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');
const endpoint = 'http://172.30.25.115:8546';
const web3 = new Web3(Web3.givenProvider || endpoint);



// compile 부분 -----------------------

function compile() {
    const filePath = path.resolve(__dirname, 'contracts', 'Vote1.sol');
    const source = fs.readFileSync(filePath, 'utf8');
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

    return output2;
}

async function deploy() {
    const output2 = compile()
    const interface = output2.abi;
    const bytecode = output2.evm.bytecode.object;

    const accounts = await web3.eth.getAccounts();

    const deployed_contract = await new web3.eth.Contract(interface)
        .deploy({ data: bytecode })
        .send({gas : '3000000', from : accounts[0]});

    //console.log(deployed_contract.options.address);
    return deployed_contract;
}

async function makeVote() {
    const accounts = await web3.eth.getAccounts();
    const target_contract = bill_list[0];

    await target_contract.methods.makeVote(123, true).send({from:accounts[1], gas : '3000000'});
}

async function resultVote() {
    const accounts = await web3.eth.getAccounts();
    const target_bill = bill_list[0];

    return await target_bill.methods.resultVote().call({from : accounts[0]});
}
const http = require('http');
bill_list = [];
CA_list = [];

http.createServer((req, res) => {
    var command = req.url;

    if (command == '/make_bill') {
        deploy().then(result => {
            bill_list.push(result);
            CA_list.push(result.options.address);
            console.log('새로운 스마트 컨트랙트 생성');
            res.write("make bill");
            res.end();
        });
    } else if (command == '/vote') {
        makeVote().then(console.log("voted"));
        res.write("vote Done");
        res.end();
    } else if (command == '/result') {
        resultVote().then(value => {
            console.log(value);
        })
        res.write("result Done");
        res.end();
    }
}).listen(8080);
// Module Part
const path = require('path');   // to access the default contract
const fs = require('fs');       // to access the default contract
const solc = require('solc');   // to compile the smart contract
const Web3 = require('web3');   // to communicate with the blockchain network
const http = require('http');   // to create http server

// connect to blockchain network
// Please change endpoint variable with "AWS server address"
const endpoint = 'http://172.30.40.125:8546';
const web3 = new Web3(Web3.givenProvider || endpoint);

// Compile part
// It will be separated into "compile.js" module later
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

// Deploy part
// It will be separated into "deploy.js" module later
async function deploy(user_address) {
    const compiled_source = compile();
    const interface = compiled_source.abi;
    const bytecode = compiled_source.evm.bytecode.object;

    const deployed_contract = await new web3.eth.Contract(interface)
        .deploy({data : bytecode})
        .send({gas : '3000000' , from : user_address})

    return deployed_contract;
}

// Server Function part

// Blockchain Function part
async function makeVote(user_address, opinion, target_contract) {
    await target_contract.methods.makeVote(user_address, opinion).send({from:user_address, gas : '3000000'});
}
async function finishVote(user_address,target_contract) {
    await target_contract.methods.finishVote().send({from:user_address, gas : '3000000'});
}
async function resultVote(user_address, target_contract) {
    // 수정 전 코드
    // const accounts = await web3.eth.getAccounts();
    // const target_bill = contract_list[0];
    //
    // return await target_bill.methods.resultVote().call({from : accounts[0]});

    // 수정 후 코드
    return await target_contract.methods.resultVote().call({from : user_address});
}
async function voterList(user_address, target_contract) {
    return await target_contract.methods.voter_list().call({from : user_address});
}

// Attribute part
contract_list = {};     // for managing smart contract(=bill)
user_address_list = {}; // key : user_id , value : user_address

// Server part
http.createServer((req, res) => {
    // use the first component as a command,
    // the second component as a user_address
    // And the rest of them as an option
    var input_component = req.url.split("/");
    var input_command = input_component[1];
    var user_address = input_component[2];

    switch(input_command) {
        // use only for testing server.
        case ('get_contract_address_list'):
            console.log(Object.keys(contract_list));
            res.end('get contract');
            break;
        // deploy smart contract
        case ('make_bill'):    // should be /make_bill/"user_addr"
            console.log('make bill start');

            deploy(user_address).then(result => {
                contract_list[result.options.address] = result;
            }).catch(function(err) {
                console.log(err);
            });

            console.log('New bill has been created');
            res.end("New bill has been created");
            break;

        case ('make_vote'):   // should be /make_vote/"user_addr"/0or1/"contract_address"
            console.log('make vote start');
            const opinion = Boolean(input_component[3]);
            var target_contract = contract_list[input_component[4]];

            makeVote(user_address, opinion, target_contract).catch(function(err) {
                console.log(err);
            });
            console.log('New vote is made');
            res.end("Voting process is done");
            break;
        case ('finish_vote'):  // should be /finish_vote/"user_addr"/"contract_address"
            console.log('finish vote start');
            var target_contract = contract_list[input_component[4]];

            finishVote(user_address, target_contract).catch(function(err) {
                console.log(err);
            });
            console.log('Vote has been finished');
            res.end("Voting process is finished");
            break;
        case('result_vote'):   // should be /result_vote/"user_addr"/"contract_address"
            console.log('result vote start');
            var target_contract = contract_list[input_component[4]];

            resultVote(user_address, target_contract).then(value => console.log("Vote result : " + value))
                .catch(function(err) {
                    console.log(err);
                });

            res.end("The result is printed in console");
            break;
        case('voter_list'):    // should be /voter_list/"user_addr"/"contract_address
            console.log('voter list start');
            var target_contract = contract_list[input_component[4]];

            voterList(user_address, target_contract).then(value => console.log("Voter list : " + value))
                .catch(function(err) {
                    console.log(err);
                });

            res.end("voters are printed in console");
            break;
        case('favicon.ico'):
            break;
        default :
            console.log('Wrong access : ' + req.url);
            res.end("Wrong access");
    }
}).listen(8080);
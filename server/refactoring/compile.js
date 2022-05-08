const path = require('path')
const fs = require('fs')
const solc = require('solc')

exports.receipt = function() {
    const filePath = path.resolve(__dirname, 'receipt.sol');
    const source_code = fs.readFileSync(filePath, 'utf-8');
    const compile_input = {
        language: 'Solidity',
        sources: {
            'receipt.sol': {
                content: source_code
            }
        },
        settings: {
            outputSelection: {
                '*': {
                    '*' : [ '*' ]
                }
            }
        }
    };

    const compile_output = JSON.parse(solc.compile(JSON.stringify(compile_input)));
    const result = [compile_output.contracts["receipt.sol"].receipt.abi, compile_output.contracts["receipt.sol"].receipt.evm.bytecode.object];

    return result
}
exports.club = function () {
    const filePath = path.resolve(__dirname, 'club.sol');
    const source_code = fs.readFileSync(filePath, 'utf-8');
    const compile_input = {
        language: 'Solidity',
        sources: {
            'club.sol': {
                content: source_code
            }
        },
        settings: {
            outputSelection: {
                '*': {
                    '*' : [ '*' ]
                }
            }
        }
    };

    const compile_output = JSON.parse(solc.compile(JSON.stringify(compile_input)));
    const result = [compile_output.contracts["club.sol"].club.abi, compile_output.contracts["club.sol"].club.evm.bytecode.object];

    return result;
}
const path = require('path');
const fs = require('fs');
const solc = require('solc');

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

module.exports = output.contracts["Vote1.sol"].Vote1;
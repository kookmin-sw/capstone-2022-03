// mongoDB 연동 파트
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/capstone');

var db = mongoose.connection;

db.on('error', function() {
    console.log('Connection Failed!');
});
db.once('open', function() {
    console.log('Connected!');
});

//모든 법안 데이터 출력
// var bill = mongoose.Schema({
//     진행여부 : 'string',
//     입법예고명 : 'string',
//     법령종류 : 'string',
//     입법구분 : 'string',
//     소관부처 : 'string',
//     공고번호 : 'string',
//     의견접수시작일 : 'string',
//     의견접수마감일 : 'string',
//     상세정보페이지url : 'string',
//     법안id : 'string',
//     법안상세정보 : 'string'
// }, { collection : 'bill_data'});


// var Bill = mongoose.model('Bill', bill);

// Bill.find(function(error, bills){
//     console.log('--- Read all ---');
//     if(error){
//         console.log(error);
//     }else{
//         console.log(bills);
//     }
// })

//법안 리스트 데이터 json
var bill = mongoose.Schema({
    진행여부 : 'string',
    입법예고명 : 'string',
    법령종류 : 'string',
    입법구분 : 'string',
    소관부처 : 'string',
    공고번호 : 'string',
    의견접수시작일 : 'string',
    의견접수마감일 : 'string',
}, { collection : 'bill_data'});


var Bill = mongoose.model('Bill', bill);

Bill.find(function(error, bills){
    console.log('--- Read all ---');
    if(error){
        console.log(error);
    }else{
        console.log(bills);
    }
})
const mongoose = require('mongoose')
const config = require("./config/dev")
const {User} = require("./model/User.js")
const {Club} = require("./model/Club.js")
const blockchain = require('./blockchain')


exports.connenct = function () {
    mongoose.connect(config.mongoURI)
        .then(() => console.log('DB connected...'))
        .catch(err => console.log('DB connect fail', err));
}
exports.register = function (body, res) {
    User.findOne({ email : body.email}, (err, user) => {
        if (user) { res.send({ success : false, message : '중복된 이메일 입니다.'}) }
        else {
            const new_user = new User(body);

            blockchain.makeAccount(body.name).then((new_address) => {
                new_user.address = new_address;
                
                new_user.save().then(() => {
                    console.log(body.name, "회원가입")
                    res.send({ success : true, message : '회원가입 완료'})
                })
            })
        }
    })
}
exports.login = function (body, res) {
    User.findOne({ email : body.email},  async (err, user) => {
        if (!user) { res.send({ success : false, message : "이메일에 해당하는 유저가 없습니다."}) }
        else {
            user.comparePassword(body.password, (err, isMatch) => {
                if(!isMatch) { res.send({ success : false, message : "비밀번호가 맞지 않습니다."}) }
                else {
                    blockchain.unlockAccount(user.address, user.name)

                    console.log(user.name, "로그인")
                    res.send({
                        success : true,
                        user_id : user._id,
                        user_name : user.name,
                        user_email : user.email,
                        user_address : user.address
                    })
                }
            })
        }
    })
}
exports.createClub = function (body, res) {
    let success = true;
    let message = "default";

    let new_club = new Club()
    const new_club_id_size = String(new_club._id).length

    if(body.flag === "DB") {
        new_club = new Club(body)
        new_club.club_balance = 0;
        new_club.club_leader_name = body.user_name;
        new_club.joined_user = [body.user_id]
        new_club.joined_member = [{user_id : body.user_id, department : "leader"}]
        new_club.club_number = String(new_club._id).slice(new_club_id_size-5, new_club_id_size)

        message = "DB 클럽 생성"

        new_club.save().then(function() {
            User.findOneAndUpdate({ _id : body.user_id}, {$push : { joined_club : new_club._id}}, (err, isUpdated) => {
                if (err) { success = false }
                else if(!isUpdated) { success = false; message = '유저의 클럽 목록이 업데이트 되지 않았습니다.'}
            })
            console.log(message)
            res.send({ success : success, message : message })
        })
    }
    else if (body.flag === 'BC') {
        blockchain.createClub(body).then((address) => {
            new_club.address = address
            new_club.flag = "BC"
            new_club.club_number = String(new_club._id).slice(new_club_id_size-5, new_club_id_size)
            message = "BC 클럽 생성"

            new_club.save().then(function() {
                User.findOneAndUpdate({ _id : body.user_id}, {$push : { joined_club : new_club._id}}, (err, isUpdated) => {
                    if (err) { success = false }
                    else if(!isUpdated) { success = false; message = '유저의 클럽 목록이 업데이트 되지 않았습니다.'}
                })
                console.log(message)
                res.send({ success : success, message : message })
            })
        })
    }
    else {}
}
exports.userClubInfo = function (body, res) {
    User.findOne({_id : body.user_id}, async (err, user) => {
        if (err) { res.send({ success : false, message : 'DB 오류'}) }
        else if (!user) { res.send({ success : false, message : "해당 유저가 존재하지 않습니다."}) }
        else {
            let club_info_result = [];
            let promise_list = [];

            user.joined_club.forEach((element) => {
                promise_list.push(
                    // promise function
                    Club.findOne({_id: element}).then(async (club) => {
                        if (club.flag === "BC") {
                            await blockchain.clubInfo(club.address, user.address).then((club_info) => {
                                club_info['club_id'] = club._id;
                                club_info['flag'] = "BC"
                                club_info_result.push(club_info)
                            })
                        } else if (club.flag === "DB") {
                            club_info_result.push({
                                club_id: String(club._id),
                                club_title: club.club_title,
                                club_balance: club.club_balance,
                                club_leader: club.club_leader_name,
                                users: club.joined_user.length,
                                flag: "DB"
                            })
                        } else {}
                    })
                )
            })
            Promise.all(promise_list).then(() => {
                res.send(club_info_result)
            })
        }
    })
}
exports.joinClub = function(body, res) {
    Club.findOne({ club_number : body.club_number}, (err, club) => {
        if (err) { res.send({ success : false, message : err}) }
        else if (!club) { res.send({ success : false, message : "해당 클럽이 존재하지 않습니다."}) }
        else {
            if (club.flag === "BC") {
                blockchain.addClubUser(club.address, body.user_address, body)
                User.findOneAndUpdate({_id: body.user_id}, {$push: {joined_club: club._id}}).then(() => {
                    res.send({ success: true })
                })
            } else if (club.flag === "DB") {
                Club.findOneAndUpdate({club_number: body.club_number}, {$push: {joined_user: body.user_id}}).then(() => {
                    User.findOneAndUpdate({_id: body.user_id}, {$push: {joined_club: club._id}}).then(() => {
                        res.send({ success: true })
                    })
                })
            } else {}
        }
    })
}
exports.gotoClub = function(body, res) {
    Club.findOne({_id : body.club_id},   async (err, club) => {
        if (err) { res.send(err) }
        else if (!club) { res.send({success: false, message: "존재하지 않는 클럽입니다."}) }
        else {
            if (club.flag === 'BC') {
                let temp_info = {'joined_user': [], 'receipt': []}

                blockchain.clubUsers(club.address, body.user_address).then((users) => {
                    let user_info_list = []

                    for (let temp_user of users) {
                        user_info_list.push({user_name: temp_user.name, user_id: temp_user.id})
                    }
                    temp_info['joined_user'] = user_info_list;

                    blockchain.clubReceipt(club.address, body.user_address).then(receipt_info => {
                        if (receipt_info.length != null) {
                            temp_info['receipt'] = receipt_info
                        } else {
                            temp_info['receipt'] = []
                        }
                    })
                    return temp_info
                }).then(async result => {
                    res.send(result)
                })
            }
            else if (club.flag === 'DB') {
                let temp_info = {'joined_user': [], 'receipt': []}

                temp_info['receipt'] = club.receipt

                let promise_list = []
                club.joined_user.forEach((element) => {
                    promise_list.push(
                        // promise function
                        User.findOne({ _id : element}).then((user) => {
                            temp_info['joined_user'].push({
                                user_name : user.name,
                                user_id : user._id
                            })
                        }))
                })
                Promise.all(promise_list).then(() => {
                    res.send(temp_info)
                })
            } else {}
        }
    })
}
exports.addClubFee = function(body, res) {
    Club.findOne({ _id : body.club_id}, (err, club) => {
        if (err) { res.send(err) }
        else if (!club) { res.send({ success : false, message : "해당 클럽이 존재하지 않습니다."}) }
        else {
            if(club.flag === 'BC') {
                blockchain.addClubFee(club.address, body.user_address, body.fee).then((new_balance) => {
                    res.send({ success : true, balance : new_balance, club_title : club.club_title})
                })
            }
            // 일반DB 클럽
            else if (club.flag === 'DB') {
                Club.findOneAndUpdate({_id : body.club_id}, {$inc : { club_balance : body.fee}}, (err, isIncreased) => {
                    if(err) { res.send(err) }
                    else if (!isIncreased) { res.send({ success : false, message : "해당 클럽이 존재하지 않습니다."}) }
                    else {
                        let new_balance = isIncreased.club_balance + body.fee
                        res.send({ success : true, balance : new_balance, club_title : club.club_title })
                    }
                })
            } else { res.send({ success : false }) }
        }
    })
}
exports.addClubReceipt = function(body, res) {
    Club.findOne({ _id : body.club_id}, (err, club) => {
        if (err) { res.send(err) }
        else if (!club) { res.send({ success : false, message : "해당 클럽이 존재하지 않습니다."}) }
        else {
            // 블록체인 클럽
            if (club.flag === 'BC') {
                blockchain.addClubReceipt(club.address, body.user_address, body.receipt)
                    .then(async () => {
                        await blockchain.clubBalance(club.address, body.user_address)
                            .then(async(balance) => {
                                console.log(body.user_name, "님이 영수증을 추가했습니다.")
                                res.send({ success : true, balance : balance, club_title : club.club_title })
                            })
                    })
            }
            // 일반 DB 클럽
            else if (club.flag === 'DB') {
                Club.findOne({ _id : body.club_id}, (err, club) => {
                    if(err) { res.send(err) }
                    else if (club.club_balance < body.receipt.cost) { res.send({ success : false, message : "모임의 잔액이 부족합니다. "})}
                    else {
                        Club.findOneAndUpdate({ _id : body.club_id}, {$push : { receipt : body.receipt}, $inc : { club_balance : -1 * body.receipt.cost}}, (err, isPushed) => {
                            if(err) { res.send(err) }
                            else {
                                res.send({ success : true, balance : isPushed.club_balance - body.receipt.cost, club_title : club.club_title })
                            }
                        })
                    }
                })
            } else { res.send({ success : false }) }
        }
    })
}
exports.clubReceipts = function(body, res) {
    Club.findOne({_id : body.club_id}, (err, club) => {
        if (!club) { res.send({ success : false, message : "존재하지 않는 클럽입니다."}) }
        else {
            let receipt_list = []

            if (club.flag === 'BC'){
                blockchain.clubReceipt(club.address, body.user_address).then(async(receipt) => {
                    res.send(receipt)
                })
            }
            else if (club.flag === 'DB'){
                for (let receipt of club.receipt) {
                    receipt_list.push(receipt)
                }
                res.send(receipt_list)
            } else { res.send({ success : false }) }
        }
    })
}
exports.getJoinedMember = function(body, res) {
    Club.findOne({_id : body.club_id}, (err, club) => {
        if (err) { res.send(err) }
        else if (!club) { res.send({ success : false, message : "해당 클럽이 존재하지 않습니다."}) }
        else {
            if(club.flag === 'BC') {
                blockchain.clubMembers(club.address, body.user_address).then(async (members) => {
                    let member_info_list = []
                    for await (let temp_member of members) {
                        member_info_list.push({user_name: temp_member.name, user_id: temp_member.id})
                    }
                    res.send(member_info_list)
                })
            }
            else if (club.flag === 'DB') {
                let member_info_list = []
                let promise_list = [];

                club.joined_member.forEach(element => promise_list.push(
                    User.findOne({_id : element}).then(user => {
                        member_info_list.push({user_name : user.name, user_id : user._id})
                    })
                ))
                Promise.all(promise_list).then(() => { res.send(promise_list)})
            } else { res.send({ success : false }) }
        }
    })
}
exports.addClubMember = function(body, res) {
    Club.findOne({ _id : body.club_id}, (err, club) => {
        if (err) { res.send(err) }
        else if (!club) { res.send({ success : false, message : "존재하지 않는 클럽입니다."})}
        else {
            if(club.flag === 'BC') {
                for (let member of body.members) {
                    User.findOne({ _id : member.user_id}).then((user) => {
                        blockchain.addClubMember(club.address, body.user_address, user, member.department)
                    })
                }
                res.send({ success : true, message : "총무가 " + body.members.length + "명 추가 되었습니다."})
            }
            else if (club.flag === 'DB') {
                for(let member of body.members) {
                    let temp = { user_id : member.user_id, department : member.department }
                    Club.findOneAndUpdate({ _id : body.club_id}, {$push : { joined_member : temp}})
                }
                res.send({ success : true , message : body.members.length + "명 추가 되었습니다."})
            } else { res.send({ success : false }) }
        }
    })
}

exports.allClub = function(res) {
    Club.find().then(result => res.send(result))
}
exports.allUser = function(res) {
    User.find().then(result => res.send(result))
}
exports.rmUser = function (body, res) {
    // 수정한 부분 : 유저가 삭제된 경우, 유저가 속한 클럽들을 조회하고, 해당 클럽들에서 user._id를 삭제한다.
    // 수정해야 하는 부분 : 이때, 유저가 모임의 리더인 경우 어떻게 처리할지..?
    // 해당 모임도 삭제 해버린다. or 모임을 먼저 삭제해야 한다.
    User.findOneAndDelete({ id : body.user_id}, {},(err, isDeleted) => {
        if (err) { res.send(err) }
        else if (!isDeleted) {
            res.send({ success : false, message : "해당 id의 유저가 없습니다. "})
        }
        else {
            res.send({ success : true })
        }
    })
}
exports.rmClub = function (body, res) {
    Club.findOneAndDelete({ _id : body.club_id}, {}, (err, club) => {
        if(err) { res.send(err) }
        res.send({ success : true, message : club })
    })
}

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
exports.register = function (data, res) {
    User.findOne({ email : data.email}, (err, user) => {
        // DB 에러
        if (err) {
            res.send({ success : false, message : err })
        }
        // 이메일 중복되는 경우
        else if (user) {
            res.send({ success : false, message : "이미 존재하는 이메일 입니다."})
        }
        // 정상 경로
        else {
            blockchain.makeAccount(data.name).then((address) => {
                const user = new User(data)
                user.address = address

                user.save((err, userInfo) => {
                    // DB 에러
                    if (err) {
                        return res.json({ success : false, message : err })
                    }
                    // 정상 경로
                    else {
                        console.log(data.name, " 님이 회원가입 하였습니다.")
                        return res.status(200).json({ success : true })
                    }
                })
            })
        }
    })
}
exports.login = function (data, res) {
    User.findOne({ email : data.email }, async (err, user) => {
        if (!user) { return res.json({ success : false, message : "제공된 이메일에 해당하는 유저가 없습니다!" }) }

        user.comparePassword(data.password, (err, isMatch) => {
            if(!isMatch){ return res.json({ success : false, message : "비밀번호가 틀렸습니다." }) }

            user.generateToken((err, user) => {
                if (err) { return res.send({ success : false, message : "토큰 생성 오류" }) }

                var data = {}
                const find_data = async function() {
                    for (let i of user.joined_club) {
                        await Club.findOne({ _id : i })
                            .then((result) => {
                                data[i] = result;
                            })
                    }
                }

                find_data().then(() => {
                    // temp : 앱으로 전송하는 데이터 구조
                    const temp = { success : true, user_id : user._id, user_name : user.name, user_email : user.email, user_address : user.address }
                    res.cookie("x_auth", user.token).send(temp)
                })
            })
            console.log(user.name, "님이 로그인 하였습니다.")
        })
    })
}
exports.createClub = function (data, res) {
    if(data.flag === "BC"){
        blockchain.createClub(data)
            .then((contract) => {
                createBCClub(data, contract.options.address, res)
            })
    }
    else if(data.flag === "DB"){
        createDBClub(data, res)
    }
}
const createBCClub = function(data, address, res) {
    const club = new Club()
    club.club_number = String(club._id).slice(String(club._id).length-5, String(club._id).length);
    club.address = address;
    club.flag = "BC";

    club.save({}, (err, isSaved) => {
        // DB 에러
        if(err) {
            res.send({ success : false, message : err})
        }
        // 클럽이 DB에 저장되지 않음
        else if (!isSaved) {
            res.send({ success : false, message : "클럽이 저장되지 않았습니다."})
        }
        // 정상 경로
        else {
            User.findOneAndUpdate({_id : data.user_id}, { $push: { joined_club : club._id }}, (err, user) => {
                if (err) {
                    return res.json({ success : false, message : err })
                } else {
                    console.log(data.user_name, " 님이 BC 클럽을 생성했습니다.")
                    return res.status(200).json({ success : true })
                }
            })
        }
    })

}
const createDBClub = function(data, res) {
    const club = new Club(data)
    club.club_number = String(club._id).slice(String(club._id).length-5, String(club._id).length);
    club.club_balance = 0;
    club.club_leader_id = data.user_id;
    club.club_leader_name = data.user_name;
    club.joined_user.push(data.user_id);
    club.joined_member.push({user_id : data.user_id, department : data.department});

    club.save({},(err, isSaved) => {
        // DB 에러
        if(err) {
            res.send({ success : false, message : err})
        }
        // 클럽이 DB에 저장되지 않음
        else if(!isSaved) {
            res.send({ success : false, message : "클럽이 저장되지 않았습니다."})
        }
        // 정상 경로
        else {
            User.findOneAndUpdate({_id : data.user_id}, { $push: { joined_club : club._id }}, (err, user) => {
                if (err) {
                    return res.json({ success : false, message : err })
                }
                else {
                    console.log(data.user_name, " 님이 DB 클럽을 생성했습니다.")
                    return res.status(200).json({ success : true })
                }
            })
        }
    })

}

exports.myClubs = function (data, res) {
    User.findOne({_id : data.user_id}, async (err, user) => {
        // DB 에러
        if (err) { res.send(err) }
        // user_id를 잘못 입력함
        else if (!user) { res.send({ success : false, message : "user_id 입력 오류 "}) }
        // 정상 경로
        else {
            let joined_club = user.joined_club
            let club_info_list = []

            const temp = async function() {
                for (let club_id of joined_club) {
                    await Club.findOne({ _id : club_id})
                        .then(async (club) => {
                            if (club.flag === "BC") {
                                await blockchain.clubInfo(club.address).then(async (club_info) => {
                                    club_info['club_id'] = club._id
                                    club_info['flag'] = "BC"
                                    club_info_list.push(club_info)
                                })
                            }
                            else if (club.flag === "DB") {
                                let club_info = {
                                    club_id: String(club._id),
                                    club_title: club.club_title,
                                    club_balance: club.club_balance,
                                    club_leader: club.club_leader_name,
                                    users: club.joined_user.length,
                                    flag : "DB"
                                }
                                club_info_list.push(club_info)
                            }
                        })
                }
            }
            await temp().then(async() => { res.send(club_info_list) })
        }
    })
}
exports.gotoClub = function(data, res) {
    Club.findOne({_id : data.club_id}, (err, club) => {
        // DB 에러
        if (err) { res.send(err) }
        // 존재하지 않는 클럽
        else if (!club) { res.send({ success : false, message : "존재하지 않는 클럽입니다."}) }
        // 정상 경로
        else {
            // 블록체인 클럽
            if (club.flag === 'BC') {
                blockchain.clubInfo(club.address).then(async (club_info) => {
                    await blockchain.clubReceipt(club.address).then(receipt_info => {
                        if (receipt_info.length != null) {
                            club_info['club_receipts'] = receipt_info
                        }
                    })
                    club_info['club_id'] = club._id;
                    return club_info
                }).then((result) => { res.send(result)})
            }
            // 일반 DB 클럽
            else if(club.flag === 'DB') {
                const temp = {
                    club_id: club._id,
                    club_title: club.club_title,
                    club_balance: club.club_balance,
                    club_leader: club.club_leader_name,
                    users: club.joined_user.length,
                    club_receipts : club.receipt
                }
                res.send(temp)
            }
        }
    })
}
exports.joinClub = function(data, res) {
    Club.findOne({ club_number : data.club_number}, (err, club) => {
        // DB 에러 발생
        if (err) {
            res.send({ success : false, message : err})
        }
        // 클럽 번호 잘못 입력
        else if (!club) {
            res.send({ success : false, message : "해당 클럽이 존재하지 않습니다."})
        }
        // 정상 경로
        else {
            // 블록체인 클럽
            if (club.flag === "BC") {
                blockchain.addClubUser(club.address, data)
                    .then(async () => {
                        await User.findOneAndUpdate({_id : data.user_id}, {$push : { joined_club : club._id}}).clone()
                    })
                console.log(data.user_name, "627f0dfac2860499258acb5d님이 ", club.club_title, " 블록체인에 참가했습니다.")
                res.send({ success : true })
            }
            // 일반DB 클럽
            else if (club.flag === "DB") {
                Club.findOneAndUpdate({club_number : data.club_number}, {$push : { joined_user : data.user_id}}, (err, isPushed) => {
                    if(err) { res.send(err) }
                    else if (!isPushed) {
                        res.send({ success : false, message : "클럽 DB에 해당 유저를 추가하지 못했습니다."})
                    }
                    else {
                        console.log(data.user_name, "님이 ", club.club_title, "에 참가했습니다.")
                        res.send({ success : true })
                    }
                })
                User.findOneAndUpdate({_id : data.user_id}, {$push : { joined_club : club._id}}, (err, isPushed) => {
                    // if(err) { res.send(err) }
                    // else if (!isPushed) {
                    //     res.send({ success : false, message : "유저 DB에 해당 클럽을 추가하지 못했습니다."})
                    // }
                    // else {
                    //     console.log(data.user_name, "님이 ", club.club_title, "에 참가했습니다.")
                    //     res.send({ success : true })
                    // }

                })
            }
        }
    })
}
exports.addClubMember = function(data, res) {
    Club.findOne({ _id : data.club_id}, (err, club) => {
        // DB 오류
        if (err) { res.send(err) }
        // 존재하지 않는 클럽
        else if (!club) {
            res.send({ success : false, message : "존재하지 않는 클럽입니다."})
        }
        // 정상 경로
        else {
            // 블록체인 클럽
            if(club.flag === 'BC') {
                User.findOne({ name : data.member_name , email : data.member_email})
                    .then(async(user) => {
                        await blockchain.addClubMember(club.address, user)
                        console.log(club.club_title ," 에", user.name, "님이 추가되었습니다. ")
                        res.send({ success : true })
                    })
            }
            // 일반DB 클럽
            else if (club.flag === 'DB') {
                let temp = {user_id : data.member_name, department : data.department}
                Club.findOneAndUpdate({_id : data.club_id}, {$push : { joined_member : temp}}, (err, isPushed) => {
                    if (err) { res.send(err) }
                    else if (!isPushed) {
                        res.send({ success : false, message : "클럽에 해당 유저를 추가하지 못했습니다."})
                    }
                    else {
                        console.log(club.club_title ," 에", user.name, "님이 추가되었습니다. ")
                        res.send({ success : true })
                    }
                })
            }
        }
    })
}
exports.addClubFee = function(data, res) {
    Club.findOne({ _id : data.club_id}, (err, club) => {
        // DB 오류
        if (err) { res.send(err) }
        // club_id 잘못 입력
        else if (!club) { res.send({ success : false, message : "해당 클럽이 존재하지 않습니다."}) }
        // 정상 경로
        else {
            // 블록체인 클럽
            if(club.flag === 'BC') {
                blockchain.addClubFee(club.address, data.fee).then((new_balance) => {
                    console.log(data.user_name, "님이 회비 ", data.fee, "원을", club._id, "에 추가했습니다.")
                    res.send({ success : true, balance : new_balance})
                })
            }
            // 일반DB 클럽
            else if (club.flag === 'DB') {
                Club.findOneAndUpdate({_id : data.club_id}, {$inc : { club_balance : data.fee}}, (err, isIncreased) => {
                    if(err) { res.send(err) }
                    else if (!isIncreased) { res.send({ success : false, message : "해당 클럽이 존재하지 않습니다."}) }
                    else {
                        let new_balance = isIncreased.club_balance + data.fee
                        console.log(data.user_name, "님이 회비 ", data.fee, "원을", club._id, "에 추가했습니다.")
                        res.send({ success : true, balance : new_balance })
                    }
                })
            }
        }
    })
}
exports.addClubReceipt = function(data, res) {
    Club.findOne({ _id : data.club_id}, (err, club) => {
        if (err) { res.send(err) }
        else if (!club) { res.send({ success : false, message : "해당 클럽이 존재하지 않습니다."}) }
        else {
            // 블록체인 클럽
            if (club.flag === 'BC') {
                blockchain.addClubReceipt(club.address, data.receipt)
                    .then(async () => {
                        await blockchain.clubBalance(club.address)
                            .then(async(balance) => {
                                console.log(data.user_name, "님이 영수증을 추가했습니다.")
                                res.send({ success : true, message : balance })
                            })
                })
            }
            // 일반 DB 클럽
            else if (club.flag === 'DB') {
                Club.findOne({ _id : data.club_id}, (err, club) => {
                    if(err) { res.send(err) }
                    else if (club.club_balance < data.receipt.cost) { res.send({ success : false, message : "모임의 잔액이 부족합니다. "})}
                    else {
                        Club.findOneAndUpdate({ _id : data.club_id}, {$push : { receipt : data.receipt}, $inc : { club_balance : -1 * data.receipt.cost}}, (err, isPushed) => {
                            if(err) { res.send(err) }
                            else {
                                res.send({ success : true, message : isPushed.club_balance - data.receipt.cost })
                            }
                        })
                    }
                })
            }
        }
    })
}
exports.clubReceipts = function(data, res) {
    Club.findOne({_id : data.club_id}, (err, club) => {
        // DB 에러
        if (err) { res.send(err) }
        // 존재하지 않는 클럽
        else if (!club) { res.send({ success : false, message : "존재하지 않는 클럽입니다."}) }
        // 정상 경로
        else {
            let receipt_list = []

            if (club.flag === 'BC'){
                blockchain.clubReceipt(club.address).then(async(receipt) => {
                    res.send(receipt)
                })
            }
            else if (club.flag === 'DB'){
                for (let receipt of club.receipt) {
                    receipt_list.push(receipt)
                }
                res.send(receipt_list)
            }
        }
    })
}
exports.getJoinedUser = function(data, res) {
    Club.findOne({_id : data.club_id}, (err, club) => {
        if (err) { res.send(err) }
        else if (!club) { res.send({ success : false, message : "해당 클럽이 존재하지 않습니다."}) }
        else {
            if(club.flag === 'BC') {
                blockchain.clubUsers(club.address).then(async(users) => {
                    let user_info_list = []
                    for (let temp_user of users){
                        user_info_list.push({user_name : temp_user.name, user_id : temp_user.id})
                    }
                    res.send(user_info_list)
                })
            }
            else if (club.flag === 'DB') {
                let user_info_list = []

                const temp = async function() {
                    for(let temp_id of club.joined_user) {
                        await User.findOne({_id : temp_id}).then(async (user) => {
                            user_info_list.push({ user_name : user.name, user_id : user._id })
                        })
                    }
                    return user_info_list
                }
                temp().then(() => { res.send(user_info_list)} )
            }
        }
    })
}

exports.allClub = function(res) {
    Club.find().then(result => res.send(result))
}
exports.allUser = function(res) {
    User.find().then(result => res.send(result))
}
exports.rmUser = function (data, res) {
    // 수정한 부분 : 유저가 삭제된 경우, 유저가 속한 클럽들을 조회하고, 해당 클럽들에서 user._id를 삭제한다.
    // 수정해야 하는 부분 : 이때, 유저가 모임의 리더인 경우 어떻게 처리할지..?
    // 해당 모임도 삭제 해버린다. or 모임을 먼저 삭제해야 한다.
    User.findOneAndDelete({ id : data.user_id}, {},(err, isDeleted) => {
        if (err) { res.send(err) }
        else if (!isDeleted) {
            res.send({ success : false, message : "해당 id의 유저가 없습니다. "})
        }
        else {
            res.send({ success : true })
        }
    })
}
exports.rmClub = function (data, res) {
    Club.findOneAndDelete({ _id : data.club_id}, {}, (err, club) => {
        if(err) { res.send(err) }
        res.send({ success : true, message : club })
        console.log(club)
    })
}

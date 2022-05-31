const mongoose = require('mongoose')
const config = require("./config/dev")
const {User} = require("./model/User.js")
const {Club} = require("./model/Club.js")
const blockchain = require('./blockchain')

// mongodb 연결
exports.connenctdb = function () {
    mongoose.connect(config.mongoURI)
        .then(() => console.log('DB connected...'))
        .catch(err => console.log('DB connection fail', err));
}

// 회원가입
exports.register = async function (body, res) {
    const existed = await User.findOne({ email : body.email })
    if (existed) {
        console.log('register fail, email existed')
        res.send({ success : false, message : '중복된 이메일 입니다.' })
        break
    }

    const new_user = new User(body);
    new_user.address = await blockchain.makeAccount(body.name)
    await new_user.save().then(() => {
        console.log(body.name, '회원가입')
        res.send({ success : true })
    })
}

// 로그인
exports.login = async function (body, res) {
    const existed_user = User.findOne({ email : body.email })
    if(!existed_user) {
        console.log('login fail, no user')
        res.send({ success : false })
        break
    }
    
    const isMatch = await existed_user.comparePassword(body.password)
    blockchain.unlockAccount(existed_user.address, existed_user.name)

    console.log(existed_user.name, '로그인')
    res.send({
        success : true,
        user_id : existed_user._id,
        user_name : existed_user.name,
        user_email : existed_user.email,
        user_address : existed_user.address
    })
}

// 모임 생성
exports.createClub = async function (body, res) {
    // 일반 DB 모임 방식
    if(body.flag === "DB") {
        // Club 데이터 initialization
        const new_club = new Club(body)
        const id_size = String(new_club._id).length

        new_club.club_balance = 0;
        new_club.club_leader_name = body.user_name;
        new_club.club_leader_id = body.user_id;
        new_club.joined_user = [body.user_id]
        new_club.joined_member = [{user_id : body.user_id, department : "leader"}]
        new_club.club_number = String(new_club._id).slice(id_size-5, id_size)
        new_club.deployed_time = Math.round(Date.now()/1000)

        const promise_list = [
            new_club.save(),
            User.findOneAndUpdate({ _id : body.user_id}, {$push : { joined_club : new_club._id}})
        ]

        Promise.all(promise_list).then(() => {
            console.log('DB 클럽 생성')
            res.send({ success : true })
        })
    }

    // 블록체인 DB 방식
    else if (body.flag === 'BC') {
        const new_club = new Club()
        const id_size = String(new_club._id).length

        new_club.flag = 'BC'
        new_club.club_number = String(new_club._id).slice(new_club_id_size-5, new_club_id_size)
        new_club.address = await blockchain.createClub(body)

        const promise_list = [
            new_club.save(),
            User.findOneAndUpdate({ _id : body.user_id}, {$push : { joined_club : new_club._id}})
        ]

        Promise.all(promise_list).then(() => {
            console.log('DB 클럽 생성')
            res.send({ success : true })
        })
    }
    else { console.log('wrong flag') }
}

// 유저의 모임 목록
exports.userClubList = async function (body, res) {
    const existed_user = await User.findOne({ _id : body.user_id })
    if(!existed_user) {
        console.log('userClubList fail, no user')
        res.send({ success : false })
        break
    }

    let promise_list = []

    existed_user.joined_club.forEach((club_id) => {
        promise_list.push(
            Club.findOne({ _id : club_id }).then((club) => {
                if (club.flag === 'BC') {

                }
                else if (club.flag === 'DB') {
                    
                }
                else {}
            })
        )
    })
    User.findOne({_id : body.user_id}, async (err, user) => {
        if (!user) { res.send({ success : false, message : "해당 유저가 존재하지 않습니다."}) }
        else {
            let club_info_result = [];
            let promise_list = [];

            // 유저가 참가한 Club의 정보를 비동기로 가져옴
            // promise_list에 쿼리 요청을 모두 담아 두고, 한번에 병렬 비동기 처리
            user.joined_club.forEach((element) => {
                promise_list.push(
                    Club.findOne({_id: element}).then(async (club) => {
                        // 블록체인 DB 방식
                        if (club.flag === "BC") {
                            let member_id_list = []

                            const club_info = await blockchain.clubInfo(club.address, user.address)
                            const members = await blockchain.clubMembers(club.address, user.address)

                            for (let member of members) {
                                member_id_list.push(member.id)
                            }

                            club_info['members'] = member_id_list;
                            club_info['club_id'] = club._id;
                            club_info['flag'] = "BC"
                            club_info['user_id'] = body.user_id
                            club_info_result.push(club_info)

                        }
                        // 일반 DB 방식
                       else if (club.flag === "DB") {
                            let member_id_list =[]
                            for (let member of club.joined_member) {
                                member_id_list.push(member.user_id)
                            }
                            club_info_result.push({
                                club_id: String(club._id),
                                club_title: club.club_title,
                                club_balance: club.club_balance,
                                club_leader: club.club_leader_name,
                                club_leader_id : club.club_leader_id,
                                members : member_id_list,
                                user_id : body.user_id,
                                users: club.joined_user.length,
                                time : club.deployed_time,
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
    Club.findOne({ club_number : body.club_number},  (err, club) => {
        if (err) { res.send({ success : false, message : err}) }
        else if (!club) { res.send({ success : false, message : "해당 클럽이 존재하지 않습니다."}) }
        else {
            if (club.flag === "BC") {
                blockchain.addClubUser(club.address, body.user_address, body).then(() => {
                    User.findOneAndUpdate({_id: body.user_id}, {$push: {joined_club: club._id}}).then(() => {
                        res.send({ success: true })
                    })
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
        else if (!club) { res.send({ success: false, message: "존재하지 않는 클럽입니다."}) }
        else {
            if (club.flag === 'BC') {
                let temp_info = {'joined_user': [], 'receipt': []}

                blockchain.clubUsers(club.address, body.user_address).then(async (users) => {
                    let member_id_list = [];
                    await blockchain.clubMembers(club.address, body.user_address).then(async (members) => {
                        for (let member of members) {
                            member_id_list.push(member.id)
                        }
                    })

                    let user_info_list = []
                    for (let temp_user of users) {
                        if(member_id_list.includes(temp_user.id))
                        { continue }
                        user_info_list.push({ user_name: temp_user.name, user_id: temp_user.id })
                    }
                    temp_info['joined_user'] = user_info_list;

                    await blockchain.clubReceipt(club.address, body.user_address).then(receipt_info => {
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
                let member_id_list = []

                for (let member of club.joined_member) {
                    member_id_list.push(member.user_id)
                }

                temp_info['receipt'] = club.receipt

                let promise_list = []
                club.joined_user.forEach((element) => {
                    promise_list.push(
                        // promise function
                        User.findOne({ _id : element}).then((user) => {
                            if (!member_id_list.includes(String(user._id))) {
                                temp_info['joined_user'].push({
                                    user_name: user.name,
                                    user_id: user._id
                                })
                            }
                        })
                    )
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
                let promise_list = []

                body.members.forEach((member) => {
                    promise_list.push(User.findOne({ _id : member.user_id}).then(   (user) => {
                        blockchain.addClubMember(club.address, body.user_address, user, 'member')
                    }))
                })
                Promise.all(promise_list)
                    .then(() => { res.send({ success : true })} )
                    .catch(() => { res.send({ success : false })} )
            }
            else if (club.flag === 'DB') {
                let promise_list = []

                body.members.forEach((member) => {
                    let temp = {user_id : member.user_id, department : 'member'}
                    promise_list.push(Club.findOneAndUpdate({_id : body.club_id}, {$push : { joined_member : temp }}) )
                })
                Promise.all(promise_list)
                    .then(() => { res.send({ success : true })})
                    .catch(() => { res.send({ success : false })})
            } else { res.send({ success : false }) }
        }
    })
}
exports.removeClub = function(body, res) {
    User.findOneAndUpdate({ _id : body.user_id}, {$pop : { joined_club : body.club_id}}, (err, isPoped) => {
        if (err) { res.send({ success : false, message : err}) }
        else {
            res.send({ success : true })
        }
    })
}

exports.allClub = function(res) {
    Club.find().then(result => res.send(result))
}
exports.allUser = async function(res) {
    const data = await User.find()
    res.send(data)
}
exports.rmUser = function (body, res) {
    User.findOneAndDelete({ id : body.user_id}, {},(err, user) => {
        if (!user) { res.send({ success : false, message : "해당 id의 유저가 없습니다. "}) }
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

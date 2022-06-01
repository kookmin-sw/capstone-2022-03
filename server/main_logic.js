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
        return
    }

    const new_user = new User(body);
    new_user.address = await blockchain.makeAccount(body.name)

    new_user.save().then(() => {
        console.log(body.name, '회원가입')
        res.send({ success : true })
    })
}

// 로그인
exports.login = async function (body, res) {
    const existed_user = await User.findOne({ email : body.email })
    if(!existed_user) {
        console.log('login fail, no user')
        res.send({ success : false })
        return
    }

    existed_user.comparePassword(body.password, (err, isMatch) => {
        if(!isMatch) {
            console.log('login fail, wrong password')
            res.send({ success : false })
            return
        }

        blockchain.unlockAccount(existed_user.address, existed_user.name)
        console.log(existed_user.name, '로그인')
        res.send({
            success : true,
            user_id : existed_user._id,
            user_name : existed_user.name,
            user_email : existed_user.email,
            user_address : existed_user.address
        })
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
        new_club.club_number = String(new_club._id).slice(id_size-5, id_size)
        new_club.address = await blockchain.createClub(body)

        const promise_list = [
            new_club.save(),
            User.findOneAndUpdate({ _id : body.user_id}, {$push : { joined_club : new_club._id}})
        ]

        Promise.all(promise_list).then(() => {
            console.log('BC 클럽 생성')
            res.send({ success : true })
        })
    }
    else { console.log('wrong flag') }
}

// 유저의 모임 목록 조회
exports.userClubList = async function (body, res) {
    const existed_user = await User.findOne({ _id : body.user_id })
    if(!existed_user) {
        console.log('userClubList fail, no user')
        res.send({ success : false })
        return
    }

    let promise_list = []
    let club_info_list = []
    existed_user.joined_club.forEach((club_id) => {
        promise_list.push(
            Club.findOne({ _id : club_id }).then(async (club) => {
                if (club.flag === 'BC') {
                    const club_info = await blockchain.clubInfo(club.address, existed_user.address)
                    const members = await blockchain.clubMembers(club.address, existed_user.address)

                    let member_id_list = []
                    for (let member of members) {
                        member_id_list.push(member.id)
                    }

                    club_info['members'] = member_id_list;
                    club_info['club_id'] = club._id;
                    club_info['flag'] = "BC"
                    club_info['user_id'] = body.user_id
                    club_info_list.push(club_info)
                }
                else if (club.flag === 'DB') {
                    let member_id_list =[]
                    for (let member of club.joined_member) {
                        member_id_list.push(member.user_id)
                    }

                    club_info_list.push({
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
                }
                else {}
            })
        )
    })

    Promise.all(promise_list).then(() => {
        res.send(club_info_list)
    })
}

// 모임 참가
exports.joinClub = async function(body, res) {
    const club = await Club.findOne({ club_number : body.club_number })
    if (!club) {
        console.log('joinClub fail, no club')
        res.send({ success : false })
        return
    }

    if (club.flag === 'BC') {
        const promise_list = [
            blockchain.addClubUser(club.address, body.user_address, body),
            User.findOneAndUpdate({ _id : body.user_id}, {$push : { joined_club : club._id}})
        ]

        Promise.all(promise_list).then(() => {
            res.send({ success : true })
        })
    }
    else if (club.flag === 'DB') {
        const promise_list = [
            Club.findOneAndUpdate({club_number: body.club_number}, {$push: {joined_user: body.user_id}}),
            User.findOneAndUpdate({_id: body.user_id}, {$push: {joined_club: club._id}})
        ]

        Promise.all(promise_list).then(() => {
            res.send({ success : true })
        })
    }
    else {}
}

// 모임 선택 후 이동
exports.gotoClub = async function(body, res) {
    const club = await Club.findOne({ _id : body.club_id })
    if (!club) {
        console.log('gotoClub fail, no club')
        res.send({ success : false })
        return
    }

    // 프론트로 반환할 데이터 구조
    let return_object = { 'joined_user' : [], 'receipt' : [] }

    if(club.flag === 'BC') {
        // 블록체인에서 정보 반환
        const users_list = await blockchain.clubUsers(club.address, body.user_address)
        const members_list = await blockchain.clubMembers(club.address, body.user_address)

        // 총무만 추출
        let members_id = []
        for (let member of members_list) {
            members_id.push(member.id)
        }
        // 유저만 추출
        for (let user of users_list) {
            if (!members_id.includes(user.id)) {
                return_object.joined_user.push({
                    user_name : user.name,
                    user_id : user.id
                })
            }
        }
        // 영수증 데이터 - 이미지 데이터 가공
        let receipt_for_return = club.receipt
        for(let receipt of receipt_for_return) {
            receipt.image = ""
        }
        return_object['receipt'] = receipt_for_return

        // 프론트로 정보 반환
        res.send(return_object)
    }
    else if (club.flag === 'DB') {
        // 영수증 데이터 - 이미지 데이터 가공
        let receipt_for_return = club.receipt
        for (let receipt of receipt_for_return) {
            receipt.image = ""
        }
        return_object['receipt'] = receipt_for_return

        // 총무만 추출
        let members_id = []
        for (let member of club.joined_member) {
            members_id.push(member.user_id)
        }
        // 유저만 추출
        let promise_list = []
        club.joined_user.forEach((user_id) => {
            promise_list.push(
                User.findOne({ _id : user_id}).then((user) => {
                    if(!members_id.includes(String(user._id))) {
                        return_object.joined_user.push({
                            user_name: user.name,
                            user_id: user._id
                        })
                    }
                })
            )
        })
        Promise.all(promise_list).then(() => {
            // 프론트로 정보 반환
            res.send(return_object)
        })
    }
    else {}
}

// 모임 회비 추가
exports.addClubFee = async function(body, res) {
    const club = await Club.findOne({ _id : body.club_id })
    if (!club) {
        console.log('addClubFee fail, no club')
        res.send({ success : false })
        return
    }

    if (club.flag === 'BC') {
        const new_balance = await blockchain.addClubFee(club.address, body.user_address, body.fee)
        res.send({ success : true, balance : new_balance, club_title : club.club_title })
    }
    else if (club.flag === 'DB') {
        await Club.findOneAndUpdate({ _id : body.club_id}, { $inc : { club_balance : body.fee}})
        const new_balance = club.club_balance + body.fee
        res.send({ success : true, balance : new_balance, club_title : club.club_title })
    }
    else {}
}

// 모임 영수증 추가
exports.addClubReceipt = async function(body, res) {
    const club = await Club.findOne({ _id : body.club_id })
    if (!club) {
        console.log('addClubReceipt fail, no club')
        res.send({ success : false })
        return
    }

    if (club.flag === 'BC') {
        await blockchain.addClubReceipt(club.address, body.user_address, body.receipt)
        await Club.findOneAndUpdate({ _id : body.club_id}, {$push : { receipt : body.receipt}})
        const balance = await blockchain.clubBalance(club.address, body.user_address)
        res.send({ success : true, balance : balance, club_title : club.club_title })
    }
    else if (club.flag === 'DB') {
        if (club.club_balance < body.receipt.cost) {
            console.log('addClubReceipt fail, no balance')
            res.send({ success : false })
            return
        }

        await Club.findOneAndUpdate({ _id : body.club_id}, {$push : { receipt : body.receipt}, $inc : { club_balance : -1 * body.receipt.cost}})
        res.send({ success : true, balance : club.club_balance - body.receipt.cost, club_title : club.club_title })
    }
    else {}
}

// 모임 총무 추가
exports.addClubMember = async function(body, res) {
    const club = await Club.findOne({ _id : body.club_id })
    if (!club) {
        console.log('addClubMember fail, no club')
        res.send({ success : false })
        return
    }

    if (club.flag === 'BC') {
        let promise_list = []

        body.members.forEach((member) => {
            promise_list.push(
                User.findOne({ _id : member.user_id}).then((user) => {
                    blockchain.addClubMember(club.address, body.user_address, user, 'member')
                })
            )
        })
        Promise.all(promise_list).then(() => {
            res.send({ success : true })
        })
    }
    else if (club.flag === 'DB') {
        let promise_list = []

        body.members.forEach((member) => {
            let user_data_to_push = { user_id : member.user_id, department : 'member' }
            promise_list.push(Club.findOneAndUpdate({ _id : body.club_id }, { $push : { joined_member : user_data_to_push }}))
        })

        Promise.all(promise_list).then(() => {
            res.send({ success : true })
        })
    }
    else {}
}

// 영수증 이미지 불러오기
exports.receiptImage = function(body, res) {
    Club.findOne({ _id : body.club_id},async (err, club) => {
        if (!club) {
            console.log("receiptImage fail, no club")
            res.send({ success : false })
        } else {
            const target_object = await club.receipt.find(receipt => String(receipt._id) === body.receipt_id)
            res.send({ success : true, image : target_object.image })
        }
    })
}

// 관리자용 함수
exports.allClub = function(res) {
    Club.find().then(result => res.send(result))
}
exports.allUser = function(res) {
    User.find().then(result => res.send(result))
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
exports.userReset = function(body, res) {
    let promise_list = []

    body.list.forEach((element) => {
        promise_list.push(
            User.findOneAndRemove({ _id : element._id })
        )
    })

    Promise.all(promise_list).then(() => {
        res.send('done')
    })
}
exports.clubReset = function(body, res) {
    let promise_list = []

    body.list.forEach((element) => {
        promise_list.push(
            Club.findOneAndRemove({ _id : element._id })
        )
    })

    Promise.all(promise_list).then(() => {
        res.send('done')
    })
}

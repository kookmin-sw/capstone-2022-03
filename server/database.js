const mongoose = require('mongoose')
const config = require("./config/dev")
const {User} = require("./model/User.js")
const {Club} = require("./model/Club.js")
const blockchain = require('./blockchain')

exports.connenct = function () {
    mongoose.connect(config.mongoURI)
        .then(() => console.log('DB connected...'))
        .catch(err => console.log('DB err', err));
}
exports.register = function (data, address, res) {
    data['address'] = address;
    const user = new User(data)

    user.save((err, userInfo) => {
        if (err) {
            return res.json({ success : false, message : err })
        } else {
            return res.status(200).json({ success : true })
        }
    })
}
exports.login = function (data, res) {
    User.findOne({ email : data.email }, (err, user) => {
        if (!user) { return res.json({ success : false, message : "제공된 이메일에 해당하는 유저가 없습니다!" }) }

        user.comparePassword(data.password, (err, isMatch) => {
            if(!isMatch){ return res.json({ success : false, message : "비밀번호가 틀렸습니다." }) }

            user.generateToken((err, user) => {
                if (err) { return res.send({ success : false, message : "토큰 생성 오류"}) }

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
                    console.log(data)
                    const temp = { user_id : user._id, user_name : user.name, user_email : user.email, user_address : user.address }
                    res.cookie("x_auth", user.token)
                        .status(200)
                        .json({ success : true, message : temp })
                })
            })
            console.log(user.name, "님이 로그인 하였습니다.")
        })
    })
}
exports.createClub = function(data, res) {
    const club = new Club(data)
    club.club_id = String(club._id).slice(String(club._id).length-5, String(club._id).length);
    club.club_balance = 0;
    club.club_leader_id = data.user_id;
    club.club_leader_name = data.user_name;
    club.joined_user.push(data.user_id);
    club.joined_member.push(data.user_id);

    club.save()
    User.findOneAndUpdate({_id : data.user_id}, { $push: { joined_club : club._id }}, (err, user) => {
        if (err) {
            return res.json({ success : false, message : err })
        } else {
            return res.status(200).json({ success : true })
        }
    })
}
exports.createBlockchainClub = function(data, address, res) {
    const club = new Club()
    club.club_id = String(club._id).slice(String(club._id).length-5, String(club._id).length);
    club.joined_user = data.user_id;
    club.joined_member = data.user_id;
    club.address = address;
    club.flag = "BC";

    club.save()
    User.findOneAndUpdate({_id : data.user_id}, { $push: { joined_club : club._id }}, (err, user) => {
        if (err) {
            return res.json({ success : false, message : err })
        } else {
            return res.status(200).json({ success : true })
        }
    })
}
exports.userJoinedClub = async function (data) {
    return await User.findOne({_id : data.user_id})
        .then(user => { return user.joined_club })
}
exports.myClubs = async function (joined_club, res) {
    let club_info_list = []
    const get_all_club_info = async function() {
        for(let club_id of joined_club) {
            await Club.findOne({_id : club_id}).clone().then(async (club) => {
                if (club.flag === 'BC') {
                    await blockchain.clubInfo(club.address).then((club_info) => {
                        club_info['club_id'] = club._id
                        club_info['flag'] = "BC"
                        club_info_list.push(club_info)
                    })
                } else if (club.flag === 'DB') {
                    let club_info = {
                        club_id: club._id,
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
        return club_info_list
    }
    return await get_all_club_info().then(result => { res.send(result)} )
}
exports.gotoClub = async function(data, res) {
    // 반환해줄 값
    // 모임 이름, 모임 번호(5자리), 잔액, 영수증들

    Club.findOne({_id : data.club_id}, (err, club) => {
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
        else if(club.flag === 'DB') {
            const temp = {
                club_id: club._id,
                club_title: club.club_title,
                club_balance: club.club_balance,
                club_leader: club.club_leader_name,
                users: club.joined_user.length,
                club_receipts : club.receipts
            }
            res.send(temp)
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
    User.findOneAndDelete({ name : data.name}, {},(err, user) => {
        // const temp_joined_club = user.joined_club
        // for(let i of temp_joined_club) {
        //     Club.findOneAndUpdate({_id : i}, {$pull : {joined_user : user._id}}, (err, club) => {
        //         console.log(club)
        //     })
        // }
        console.log(user)
        res.send({ success : true, message : user })
    })
}
exports.rmClub = function (data, res) {
    Club.findOneAndDelete({ _id : data.club_id}, {}, (err, club) => {
        if(err) { res.send(err)}
        res.send({ success : true, message : club })
        console.log(club)
    })
}

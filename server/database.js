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
                    console.log(data.user_name, " 님이 DB 클럽을 생성했습니다.")
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
        if (err) {
            res.send(err)
        }
        // user_id를 잘못 입력함
        else if (!user) {
            res.send({ success : false, message : "user_id 입력 오류 "})
        }
        else {
            let joined_club = user.joined_club
            let club_info_list = []

            const get_all_club_info = async function() {
                for (let club_id of joined_club) {
                    await Club.findOne({ _id : club_id}, async (err, club) => {
                        // DB 오류
                        if (err) { res.send(err)}
                        // 정상 경로
                        else {
                            // 블록체인 클럽인 경우
                            if (club.flag === "BC") {
                                await blockchain.clubInfo(club.address).then((club_info) => {
                                    club_info['club_id'] = club._id
                                    club_info['flag'] = "BC"
                                    club_info_list.push(club_info)
                                })
                            }
                            // 일반 DB 클럽인 경우
                            else if (club_flag === "DB") {
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
                        }
                    }).clone()
                }
                return club_info_list
            }

            return await get_all_club_info().then((result) => { res.send(result) })
        }
    })
}
exports.gotoClub = function(data, res) {
    // 반환해줄 값
    // 모임 이름, 모임 번호(5자리), 잔액, 영수증들

    Club.findOne({_id : data.club_id}, (err, club) => {
        // DB 에러
        if (err) { res.send(err) }
        // 존재하지 않는 클럽
        else if (!club) {
            res.send({ success : false, message : "존재하지 않는 클럽입니다."})
        }
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
                    club_receipts : club.receipts
                }
                res.send(temp)
            }
        }
    })
}
exports.joinClub = function(data, res) {
    Club.findOne({club_id : data.club_id}, (err, club) => {
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
                console.log(data.user_name, " 님이 ", club.club_title, "에 참가했습니다.")
                res.send({ success : true })
            }
            // 일반DB 클럽
            else if (club.flag === "DB") {
                Club.findOneAndUpdate({_id : data.club_id}, {$push : { joined_user : data.user_id}}, (err, isPushed) => {
                    if(err) { res.send(err) }
                    else if (!isPushed) {
                        res.send({ success : false, message : "클럽DB에 해당 유저를 추가하지 못했습니다."})
                    }
                })
                User.findOneAndUpdate({_id : data.user_id}, {$push : { joined_club : club._id}}, (err, isPushed) => {
                    if(err) { res.send(err) }
                    else if (isPushed) {
                        res.send({ success : false, message : "유저DB에 해당 클럽을 추가하지 못했습니다."})
                    }
                    console.log(data.user_name, " 님이 ", club.club_title, "에 참가했습니다.")
                    res.send({ success : true })
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
                        await blockchain.addClubMember(club.address, user, data.department)
                        console.log(club.club_title ," 에", user.name, " 님이 추가되었습니다. ")
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
                        console.log(club.club_title ," 에", user.name, " 님이 추가되었습니다. ")
                        res.send({ success : true })
                    }
                })
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
        if(err) { res.send(err) }
        res.send({ success : true, message : club })
        console.log(club)
    })
}

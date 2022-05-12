const mongoose = require('mongoose')
const config = require("./config/dev")
const {User} = require("./model/User.js")
const {Club} = require("./model/Club.js")

// 테스트 완료 함수
exports.myClubs = function(data, res) {
    User.findOne({_id : data.user_id}, (err, user) => {
        let list = [];
        const temp = async function() {
            for (let i of user.joined_club) {
                await Club.findOne({_id : i})
                    .clone()
                    .then((club) => {
                        list.push({ club_title : club.club_title, balance : club.club_balance, leader : user.name, users : club.joined_user.length})
                    })
            }
        }
        temp().then(() => {
            res.json({success: true, clubs : list})
        })
    })
}
exports.joinClub = function(data, res) {
    Club.findOneAndUpdate({ club_id : data.club_id}, {$push : { joined_user: data.user_id }}, (err, club) => {
        if(err) { return res.json({ success : false, message : err })
        } else {
            User.findOneAndUpdate({_id : data.user_id}, {$push : { joined_club : club._id}}, (err, user) => {
                if(err) { return res.json({ success : false, message : err })
                }
            })
            return res.status(200).json({ success : true, message : club })
        }
    })
}
exports.addMember = function(data, res) {
    User.findOne({name : data.member_name, email : data.member_email}, (err, user) => {
        if (err) {
            return res.json({success : false, message : err})
        } else {
            Club.findOneAndUpdate({ _id : data.club_id}, {$push : { joined_member : user._id}}, (err, club) => {
                if(err) {
                    return res.json({success: false, message: err})
                } else if (!club.joined_user.includes(user._id)){
                    return res.json({
                        success : false, message : '모임에 없는 사람입니다.'
                    })
                } else {
                    return res.json({ success : true, message : club.joined_member })
                }
            })
        }
    })
}
exports.addFee = function(data, res) {
    Club.findOneAndUpdate({ _id : data.club_id}, {$inc: { club_balance: data.fee }}, (err, club)=>{
        res.send(club);
    })
}






exports.userAddress = function(data, res) {
    User.findOne({ _id : data.user_id }, (err, user) => {
        if (!user) {
            console.log(err)
            return res.json({ message : 'there is not user' })
        } else {
            return res.status(200).json({ user_address : user.address })
        }
    })
}
exports.addReceipt = function(data, res) {
    Club.findOneAndUpdate({_id : data.club_id}, {$push : { receipt: data.receipt}}, (err, isPushed) => {
        console.log(data.receipt);

        if(!isPushed) { return res.json({ isPushed : false, message: "영수증 저장에 실패하였습니다." })}
        else { return res.json({ isPushed : true, message: "영수증 저장에 성공하였습니다." })}
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
        const temp_joined_club = user.joined_club
        for(let i of temp_joined_club) {
            Club.findOneAndUpdate({_id : i}, {$pull : {joined_user : user._id}}, (err, club) => {
                console.log(club)
            })
        }
        console.log(user)
        res.status(200).send({ success : true, message : user })
    })
}
exports.rmClub = function (data, res) {
    Club.findOneAndDelete({ club_title : data.club_title}, {}, (err, club) => {
        const temp_joined_user = club.joined_user
        for(let i of temp_joined_user) {
            User.findOneAndUpdate({_id : i}, {$pull : { joined_club : club._id}}, (err, user) => {
                if (err) {
                    res.json({ success : false, message : err })
                } else {
                    console.log(user)
                }
            })
        }
        console.log(club)
    })
}

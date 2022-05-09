const mongoose = require('mongoose')
const config = require("../config/key")
const {User} = require("../model/User.js")
const {Club} = require("../model/Club.js")

exports.connenct = function () {
    mongoose.connect(config.mongoURI)
        .then(() => console.log('DB connected...'))
        .catch(err => console.log('DB err', err));
}
exports.register = function (data) {
    const user = new User(data)

    user.save((err, userInfo) => {
        if (err) { return res.json({ success : false, err}) }
        return res.status(200).json({ success : true })
    })
}
exports.login = function (data) {
    User.findOne({ email : data.email }, (err, user) => {
        if (!user) { return res.json({ loginSuccess : false, message : "제공된 이메일에 해당하는 유저가 없습니다!"}) }

        user.comparePassword(data.password, (err, isMatch) => {
            if(!isMatch){ return res.json({ loginSuccess : false, message : "비밀번호가 틀렸습니다." }) }

            user.generateToken((err, user) => {
                if (err) { return res.status(400).send(err); }

                console.log('user joined club :', user.joined_club);

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
                    res.cookie("x_auth", user.token)
                        .status(200)
                        .json({ loginSuccess : true, userId : user._id, name : user.name, joined_club : data })
                })
            })
            console.log(user._id, user.name, "님이 로그인 하였습니다.")
        })
    })
}

exports.makeClub = function(data) {
    const club = new Club(data)

    console.log(club._id);
    club.save((err, clubInfo) => {
        if (err) { return res.json({ success : false, err })}
        return res.status(200).json({ success : true })
    })
}
exports.gotoClub = function(data) {
    Club.findOne({_id : data.club_id}, (err, isMatch) => {
        if(!isMatch) { return res.json({ gotoClub : false, message: "제공된 club_id에 해당하는 모임이 없습니다!" })}
        else { return res.json({ gotoClub : true, message: "해당 club으로 이동이 완료되었습니다." })}
    })
}
exports.joinClub = function(data) {
    Club.findOneAndUpdate({_id : data.club_id}, { $push: { joined_user: data.user_id}}, (err, isPushed_1) => {
        if(isPushed_1) { return res.json({ isPushed_1 : false, message : "모임 참가에 실패하였습니다." })}
        else {
            User.findOneAndUpdate({ _id : data.user_id}, {$push : {joined_club: data.club_id}}, (err, isPushed_2) => {
                if(!isPushed_2) { return res.json({ isPushed_2 : false, message : "모임 참가에 실패하였습니다." })}
                else { res.json({ success : true, message : "모임 참가에 성공하였습니다. "}) }
            })}
    })
}
exports.addReceipt = function(data) {
    Club.findOneAndUpdate({_id : data.club_id}, {$push : { receipt: data.receipt}}, (err, isPushed) => {
        console.log(data.receipt);

        if(!isPushed) { return res.json({ isPushed : false, message: "영수증 저장에 실패하였습니다." })}
        else { return res.json({ isPushed : true, message: "영수증 저장에 성공하였습니다." })}
    })
}
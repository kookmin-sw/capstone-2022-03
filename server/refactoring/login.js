const mongoose = require('mongoose')
const config = require("../config/key")
const {User} = require("../model/User")

exports.DBconnenct = function () {
    mongoose.connect(config.mongoURI)
        .then(() => console.log('DB connected...'))
        .catch(err => console.log('DB err', err));
}


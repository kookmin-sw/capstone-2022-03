const mongoose = require('mongoose');
const {Schema, SchemaTypes, Types} = require("mongoose");

const roleSchema = new mongoose.Schema( {
    user_id : {
        type: String
    },
    department : {
        type : String
    }
})
const itemSchema = new mongoose.Schema({
    item_name: {
        type: String
    },
    item_cost: {
        type: Number
    }
})

const receiptSchema = new mongoose.Schema({
    owner: {
        type: String
    },
    place: {
        type: String
    },
    cost: {
        type: Number
    },
    date: {
        type: String
    },
    detail: {
        type: [itemSchema]
    },
    imag : {
        type : String
    }
});

const clubSchema = mongoose.Schema({
    flag : {
        type : String
    },
    club_title: {
        type: String
    },
    club_number: {
        type: String
    },
    club_leader_name: {
        type : String
    },
    club_balance: {
        type: Number
    },
    club_bank_account: {
        type: String
    },
    club_bank_name: {
        type : String
    },
    club_bank_holder: {
        type : String
    },
    joined_user: {
        type: [String]
    },
    joined_member: {
        type: [roleSchema]
    },
    receipt: {
        type: [receiptSchema]
    },
    address : {
        type : String
    },
    deployed_time : {
        type : Number
    }
});

const Club = mongoose.model('Club', clubSchema)

module.exports = { Club }

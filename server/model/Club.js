const mongoose = require('mongoose');
const {Schema, SchemaTypes, Types} = require("mongoose");

const itemSchema = new mongoose.Schema({
    item_name: {
        type: String
    },
    item_cost: {
        type: Number
    },
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
        type: Date, default: Date.now
    },
    detail: {
        type: [itemSchema]
    },
});

const clubSchema = mongoose.Schema({
    flag : {
        type : String
    },
    club_title: {
        type: String
    },
    club_id: {
        type: String
    },
    club_leader_id: {
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
    image: String,
    joined_user: {
        type: [String]
    },
    joined_member: {
        type: [String]
    },
    receipt: {
        type: [receiptSchema]
    },
    address : {
        type : String
    }
});

const Club = mongoose.model('Club', clubSchema)

module.exports = { Club }
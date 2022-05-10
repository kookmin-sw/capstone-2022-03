const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    item_name: {
        type: String
    },
    item_cost: {
        type: Number
    },
})

const receiptSchema = new mongoose.Schema({
    user_id: {
        type: String
    },
    payment_place: {
        type: String
    },
    payment_cost: {
        type: Number
    },
    payment_date: {
        type: Date, default: Date.now
    },
    payment_item: {
        type: [itemSchema]
    },
});

const clubSchema = mongoose.Schema({
    club_title: {
        type: String
    },
    club_address: {
        type: String
    },
    club_id: {
        type: String
    },
    club_leader_id: {
        type: String
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
    contract : {
        type : String
    }
});

const Club = mongoose.model('Club', clubSchema)

module.exports = { Club }
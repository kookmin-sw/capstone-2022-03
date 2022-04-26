const receiptSchema = mongoose.Schema({
    payment_place: {
        type: String,
        required : true
    },
    payment_amount: {
        type: Number,
        required : true
    },
    payment_date: {
        type: String,
        required : true
    },
    payment_item: {
        type: String
    }
})

const clubSchema = mongoose.Schema({
    club_title: {
        type: String,
        required: true
    },
    club_id: {
        type: Number,
        required: true
    },
    bank_account_number: {
        type: String,
        required: true
    },
    bank_owner_name: {
        type: String,
        required: true
    },
    club_balance: {
        type: Number
    },
    joined_user: {
        type: [String]
    },
    receipts: {
        type: [receiptSchema]
    }

})
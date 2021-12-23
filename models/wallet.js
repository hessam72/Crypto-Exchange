const mongoose = require('mongoose')


const walletSchema = new mongoose.Schema({
    user_id: {
        type: ObjectId,
        required: true
    },
    coin_id: {
        type: ObjectId,
        required: true
    },
    coin_amount: {
        type: Decimal,
        default: 0,

    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true } // So `console.log()` and other functions that use `toObject()` include virtuals

}, );



walletSchema.pre('remove', async function(next) {
    const user = this

    // dont know why next() throw error
    next()
})

walletSchema.pre('save', async function(next) {
    const user = this

    next()
})


walletSchema.methods.toJSON = function() {
    const user = this
    const walletSchema = user.toObject()
        // delete userObject.password
        // delete userObject.tokens
        // delete userObject.avatar
    return walletSchema
}



const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
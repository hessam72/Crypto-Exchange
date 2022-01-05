const mongoose = require('mongoose')


const assetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    coin: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Coin'
    },
    symbol: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        default: 0,
        required: true,
        min: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true } // So `console.log()` and other functions that use `toObject()` include virtuals

}, );



assetSchema.pre('remove', async function(next) {
    const user = this

    // dont know why next() throw error
    next()
})

assetSchema.pre('save', async function(next) {
    const user = this

    next()
})


assetSchema.methods.toJSON = function() {
    const user = this
    const assetSchema = user.toObject()
        // delete userObject.password
        // delete userObject.tokens
        // delete userObject.avatar
    return assetSchema
}



const Asset = mongoose.model('Asset', assetSchema);

module.exports = Asset;
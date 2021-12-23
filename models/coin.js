const mongoose = require('mongoose')


const coinSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    last_updated: {
        type: Date,
        required: true
    },
    quote: {
        type: Object,
        required: true
    },
    status: {
        type: Number,
        // 1 active - 0 : suspended
        default: 1
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true } // So `console.log()` and other functions that use `toObject()` include virtuals

}, );



coinSchema.pre('remove', async function(next) {
    const user = this

    // dont know why next() throw error
    next()
})

coinSchema.pre('save', async function(next) {
    const user = this

    next()
})


coinSchema.methods.toJSON = function() {
    const user = this
    const coinSchema = user.toObject()
        // delete userObject.password
        // delete userObject.tokens
        // delete userObject.avatar
    return coinSchema
}



const Coin = mongoose.model('Coin', coinSchema);

module.exports = Coin;
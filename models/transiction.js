const mongoose = require('mongoose')


const transictionSchema = new mongoose.Schema({
    user_id: {
        type: ObjectId,
        required: true
    },
    coin_id: {
        type: ObjectId,
        required: true
    },
    amount: {
        type: Decimal,
        required: true
    },
    status: {
        type: Number,
        required: true
            //1 : waiting for cinonfirmation -2:sending - 3 :sent -0:rejected - 4:canceld 
    },
    tx_id: {
        type: String,

    }


}, {
    timestamps: true,
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true } // So `console.log()` and other functions that use `toObject()` include virtuals

}, );



transictionSchema.pre('remove', async function(next) {
    const user = this

    // dont know why next() throw error
    next()
})

transictionSchema.pre('save', async function(next) {
    const user = this

    next()
})


transictionSchema.methods.toJSON = function() {
    const user = this
    const transictionSchema = user.toObject()
        // delete userObject.password
        // delete userObject.tokens
        // delete userObject.avatar
    return transictionSchema
}



const Transiction = mongoose.model('Transiction', transictionSchema);

module.exports = Transiction;
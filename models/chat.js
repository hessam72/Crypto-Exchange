const mongoose = require('mongoose')


const chatSchema = new mongoose.Schema({
    user1_id: {
        type: ObjectId,
        required: true
    },
    user2_id: {
        type: ObjectId,
        required: true
    },
    room_id: {
        type: String,
        required: true
    },
    content: {
        type: Array,
        // containing objects with: {sender: , message: , date: }
    }


}, {
    timestamps: true,
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true } // So `console.log()` and other functions that use `toObject()` include virtuals

}, );



chatSchema.pre('remove', async function(next) {
    const user = this

    // dont know why next() throw error
    next()
})

chatSchema.pre('save', async function(next) {
    const user = this

    next()
})


chatSchema.methods.toJSON = function() {
    const user = this
    const chatSchema = user.toObject()
        // delete userObject.password
        // delete userObject.tokens
        // delete userObject.avatar
    return chatSchema
}



const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
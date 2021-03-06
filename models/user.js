const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('must be email!')
            }
        }
    },
    phone_number: {
        type: Number,
        unique: true,
        required: true
    },
    password: {
        required: true,
        type: String,
        trim: true,
        validate(value) {
            if (value.length < 6 || value.toLowerCase() === "password") {
                throw new Error(`pass isn't valid`)
            }
        }
    },
    role: {
        type: Number,
        // 1:admin - 2:normal user -3:support
        default: 2
    },
    status: {
        type: Number,
        //1 active - 0: de active
        default: 1

    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],

}, {
    timestamps: true,
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true } // So `console.log()` and other functions that use `toObject()` include virtuals

}, );

userSchema.virtual('assets', {
    ref: 'Asset',
    localField: '_id',
    foreignField: 'user'
})

userSchema.pre('remove', async function(next) {
    const user = this
        // delete user wallet and chat 
    next()
})

userSchema.pre('save', async function(next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})


userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.AUTH_KEY)

    user.tokens = user.tokens.concat({ token })

    await user.save()


    return token
}

userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('unable.. to login')
    }
    if (user.status === 0) {
        throw new Error('you are currently not allowed to log in')
    }
    return user

}


const User = mongoose.model('User', userSchema);

module.exports = User;
const mongoose = require('mongoose')
const rp = require('request-promise');


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

//price update method
coinSchema.statics.updatePrice = async(symbol, convert) => {

    return new Promise(function(resolve, reject) {
        try {
            console.log('inside model')
            const requestOptions = {
                method: 'GET',
                uri: 'https://pro-api.coinmarketcap.com/v1/tools/price-conversion',
                qs: {
                    'amount': '1',
                    'symbol': symbol,
                    'convert': convert
                },
                headers: {
                    'X-CMC_PRO_API_KEY': process.env.X_CMC_PRO_API_KEY
                },
                json: true,
                gzip: true
            };

            rp(requestOptions).then(response => {


                resolve(response)

            }).catch((err) => {
                throw new Error(err.message)
            });

        } catch (e) {
            reject(e.message)
        }
    })
}


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
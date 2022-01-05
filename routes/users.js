var express = require('express');
var router = express.Router();
// const AuthUser = require('../middleware/auth_user')
const Asset = require('../models/asset')
const Coin = require('../models/coin')
    /* GET users listing. */


router.get('/profile', (req, res) => {
    console.log('fdfdfd')
    res.send(req.user)
})

//asset routes
router.post('/asset', async(req, res) => {
    try {
        const user_id = req.user._id
        const asset = new Asset({
            user: user_id,
            coin: req.body.coin_id,
            symbol: req.body.coin_symbol,
            amount: req.body.amount
        })
        await asset.save();
        res.send('done')
    } catch (err) {
        res.send(err.toString())
    }
})

//fetch user assets
router.get('/asset', async(req, res) => {
    try {
        var assets = new Array()
        const convert = req.query.convert.toUpperCase()
            // fetch user assets
        const data = await req.user.populate('assets')
        const init_assets = data.assets
        var i = 0
            //loop throut all assets and fetch live price for each one 
        for (const coin of init_assets) {
            const update_data = await Coin.updatePrice(coin.symbol, convert)
            const data = update_data.data.quote
            const price = checkCurrency(data, convert)
            const value = price * coin.amount
            var obj = {};
            obj[i] = {
                symbol: coin.symbol,
                price,
                amount: coin.amount,
                current_value: value
            };
            assets.push(obj)
            i++
        }
        res.send(assets)
    } catch (err) {
        res.send(err.toString())
    }
})


const checkCurrency = (data, convert) => {

    switch (convert) {
        case "USD":
            return data.USD.price
            break;
        case "EUR":
            return data.EUR.price
            break;
        default:
            throw new Error('not supported currency')
            break;
    }
}


module.exports = router;
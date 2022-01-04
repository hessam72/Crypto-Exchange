var express = require('express');
var router = express.Router();
// const { singUp, login } = require('t-login-singup')
const User = require('../models/user')
const Coin = require('../models/coin')
const rp = require('request-promise');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Crypto Exchange Web Application' });
});
router.post('/singup', async(req, res) => {
    if (!(req.body.fullname && req.body.email &&
            req.body.password && req.body.phone_number)) {
        return res.send('please insert all of required cridentials')
    }
    try {
        const user = new User({
            ...req.body
        })
        await user.save()
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(500).send('error' + e)
    }
})
router.post('/login', async(req, res) => {
    try {

        const user = await User.findByCredentials(req.body.email, req.body.password)

        if (!user) {
            throw new Error('Wrong credentials')
        }
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })

    } catch (e) {
        res.send('error: ' + e)
    }
})


router.get('/fetch_api', (req, res) => {
    //for price change
    // uri: 'https://pro-api.coinmarketcap.com/v1/tools/price-conversion',
    // qs: {
    //     'amount': '1',
    //     'symbol': 'BTC',
    //     'convert': 'USD'
    // },

    const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
        qs: {
            'start': '1',
            'limit': '4',
            'convert': 'USD'
        },
        headers: {
            'X-CMC_PRO_API_KEY': 'adaac974-14ff-4dbd-b878-b895d4d42cf3'
        },
        json: true,
        gzip: true
    };

    rp(requestOptions).then(response => {
        res.send(response)
    }).catch((err) => {
        res.send(err.message)
    });


})

router.get('/save_coins', async(req, res) => {
    return
    try {

        const requestOptions = {
            method: 'GET',
            uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
            qs: {
                'start': '1',
                'limit': '50',
                'convert': 'USD'
            },
            headers: {
                'X-CMC_PRO_API_KEY': 'adaac974-14ff-4dbd-b878-b895d4d42cf3'
            },
            json: true,
            gzip: true
        };

        rp(requestOptions).then(response => {

            response.data.forEach(async(coin) => {
                const new_coin = new Coin({
                    name: coin.name,
                    symbol: coin.symbol,
                    slug: coin.slug,
                    last_updated: coin.last_updated,
                    quote: {
                        USD: coin.quote.USD
                    }
                })
                await new_coin.save()
            })





            res.send('done')
        }).catch((err) => {
            res.send(err.message)
        });


    } catch (e) {
        res.send(e.toString())
    }
})

router.get('/coin_price_update', async(req, res) => {
    try {
        const requestOptions = {
            method: 'GET',
            uri: 'https://pro-api.coinmarketcap.com/v1/tools/price-conversion',
            qs: {
                'amount': '1',
                'symbol': req.body.symbol,
                'convert': 'USD'
            },
            headers: {
                'X-CMC_PRO_API_KEY': 'adaac974-14ff-4dbd-b878-b895d4d42cf3'
            },
            json: true,
            gzip: true
        };

        rp(requestOptions).then(response => {
            res.send(response)
        }).catch((err) => {
            res.send(err.message)
        });



    } catch (e) {
        res.send(e.toString())
    }
})

//search coin by name symbol and slug and sort and paginate
router.get('/list_coins', async(req, res) => {
    try {
        const text = req.query.text

        let query = {}
        if (req.query.search_text) {
            query = {
                $text: { $search: req.query.search_text },
            }
        }
        const sort = {}
            //sorting
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }

        // //pagination the results
        const limit = req.query.limit ? parseInt(req.query.limit) : 0
        const skip = req.query.skip ? parseInt(req.query.skip) : 0

        const coins = await Coin.find({
                $or: [
                    { "name": { $regex: ".*" + text + ".*" } },
                    { "symbol": { $regex: ".*" + text + ".*" } },
                    { "slug": { $regex: ".*" + text + ".*" } }
                ]
            })
            .sort(sort)
            .limit(limit)
            .skip(skip)


        res.send(coins)
    } catch (err) {
        res.send(err.toString())
    }
})

module.exports = router;
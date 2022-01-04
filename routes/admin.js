var express = require('express');
var router = express.Router();
const AuthAdmin = require('../middleware/auth_admin')
const Coin = require('../models/coin')

/* GET home page. */
router.get('/profile', AuthAdmin, (req, res) => {
    // res.render('index', { title: 'Crypto Exchange Web Application' });
    res.send(req.admin)
});

router.post('/edit_coin_status', AuthAdmin, async(req, res) => {
    try {
        const status = req.body.status
        const _id = req.body.coin_id
        const coin = await Coin.updateOne({ _id }, { status })

        res.send(coin)

    } catch (e) {
        res.send(e.toString())
    }
})

module.exports = router;
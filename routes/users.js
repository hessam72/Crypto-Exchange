var express = require('express');
var router = express.Router();
const AuthUser = require('../middleware/auth_user')
    /* GET users listing. */


router.get('/profile', AuthUser, (req, res) => {
    console.log('fdfdfd')
    res.send(req.user)
})

module.exports = router;
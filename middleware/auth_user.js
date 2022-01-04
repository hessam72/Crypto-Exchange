const User = require('../models/user')
const jwt = require('jsonwebtoken')


const auth = async(req, res, next) => {
    try {

        const token = req.header('Authorization').replace('Bearer ', '')
            // verify the token is valid with comparing to private key
        const decoded = jwt.verify(token, process.env.AUTH_KEY)

        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })


        if (!user) {
            throw new Error()
        }
        if (user.role != 2) {
            throw new Error()
        }

        // for not having to fetch user from db again and easily accssesing it from request
        req.user = user
        req.token = token
        next()


    } catch (e) {
        res.status(401).send('not authenticated...')
    }

}


module.exports = auth
const mongoose = require('mongoose')

mongoose.connect(process.env.FULL_DB_URL, {
    useNewUrlParser: true,
    // useCreateIndex: true
})
const mongoose = require('mongoose')
const connection = mongoose.connect( "mongodb+srv://test:123@cluster0.qy83a.mongodb.net/lenskart?retryWrites=true&w=majority")

module.exports = connection
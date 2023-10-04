const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017')
mongoose.connection.on('connected',()=>console.log('connected'))
setTimeout(()=>{},10000)
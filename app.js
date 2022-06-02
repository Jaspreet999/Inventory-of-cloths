require('dotenv').config()

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')

const indexRoutes = require('./routes/index')

const app = express()


app.use(bodyParser.json())
app.use(bodyParser.urlencoded(
   { extended:false}
))

app.use(express.static(path.join(__dirname,"public")))



var port = (process.env.PORT || 1314)


mongoose.connect(url,{useNewUrlParser:true, useUnifiedTopology: true})

var db = mongoose.connection;
db.on('error',console.error.bind(console,"Connection Error"))


//set view engine
app.set('views',path.join(__dirname,'views'))
app.set('view engine','pug')


app.use('/',indexRoutes)


app.listen(port,(req,res) =>{
    console.log("server is running "+ port);
})

module.exports = app

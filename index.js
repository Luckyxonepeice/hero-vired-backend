const express = require('express')
const app = express()
const PORT = process.env.PORT  ? process.env.PORT : 5000;
const enroll = require('./routes/program.js')
const draftprogram= require('./routes/draftporgram.js')

app.use(express.json())

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();}
);
app.use('/program', enroll);
app.use('/draftprogram',draftprogram);


app.listen(PORT, ()=>{
    console.log(`Server is Running in ${PORT}`)
})

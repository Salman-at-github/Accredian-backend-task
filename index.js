// for env
require('dotenv').config()
const express = require('express')
const app = express()


// Parse JSON bodies
app.use(express.json());


app.get('/testing', async(req,res)=>{
    res.status(200).json("Success")
})
app.use('/api', require('./routes/userRoutes'))


const port = 8000;
app.listen(port, ()=>{
    console.log("App running on port 8k")
})
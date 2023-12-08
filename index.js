// for env
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')

// Parse JSON bodies
app.use(express.json());

//enable cors only from specified source
const corsOptions = {
    origin: process.env.CORS_HOST,
    optionsSuccessStatus: 204,
    methods: 'GET,POST,PUT,DELETE,HEAD',
    credentials: true
}
app.use(cors(corsOptions))
app.use('/api', require('./routes/userRoutes'))


const port = 8000;
app.listen(port, ()=>{
    console.log(`App running on port ${port}`)
})
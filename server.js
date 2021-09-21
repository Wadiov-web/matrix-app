const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')


const app = express()


// web socket init
const server = require('http').createServer(app)
const socketIO = require('socket.io')(server, { cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "UPDATE", "DELETE"],
    credentials: true
}})



// MongoDB init 
mongoose.connect('mongodb://localhost/myusers', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) {
        console.log('database connection failed' + err)
    } else {
        console.log('database connection established')
        server.listen(4000, () => {
            console.log('Server is listening on port 4000')
        })
    }
})

/*
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "UPDATE", "DELETE"],
    credentials: true
})); */


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(session({
    secret: 'secretSess',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 1000 * 60 * 24 * 2
    }
}))



app.use('/uploads', express.static(path.join(__dirname, '/routes/uploads')))




module.exports = socketIO
app.use(require('./routes/router'))



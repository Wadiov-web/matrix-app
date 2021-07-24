const express = require('express')
const router = express.Router()
const User = require('../model/user')
//const PreviousRecords = require('../model/previousRecords')
const path = require('path')

const suggestedUsers = require('./suggestedUsers')
const notifications = require('./notifications')
const friendsAndMessages = require('./friends&messages')
//const profileApi = require('./profileApi')
//const visitedUserApi = require('./visitedUserApi')

const multer = require('multer')
const bcrypt = require('bcrypt')


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, __dirname + '/uploads');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});


const upload = multer({ storage })
// const upload = multer({ dest: __dirname + '/uploads' })

// ---------------------------------------- Register user -------------------------------------------------------------

router.post('/signup', upload.single('image'), (req, res) => {

    const {username, email, password, gender, birthday, image} = req.body;
    console.log('from sign up api')
    console.log(req.body)
    console.log(req.file)
        
    if(username && email && password && gender && birthday && req.file){

        PreviousRecords.findOne({email: email})
        .then(emailRec => {
            if(emailRec) {
                res.json({msg: 'email is already registered'})
                console.log('email is already registered')
            } else {
                console.log('email is not registered')

                User.findOne({username: username})
                .then(user => {

                    let shouldRegister = true
                    if(user) {
                        res.json({msg: 'username is already taken'})
                        console.log('username is already taken')
                        shouldRegister = false
                    }
                    if(password.length < 8 || password.length > 30) {
                        res.json({msg: 'password length inapropriate'})
                        console.log('password length inapropriate')
                        shouldRegister = false
                    }

                    if(shouldRegister) {
                        bcrypt.genSalt(10)
                        .then(salt => {
                            bcrypt.hash(password, salt)
                            .then(hash => {
                                
                                const newUser = new User({
                                    username,
                                    email,
                                    password: hash,
                                    gender,
                                    birthday,
                                    userImage: req.file.filename
                                })
                                newUser.save()
                                .then(result => res.json({msg: 'user added to database successfully'}))
                                .catch(err => console.log(err))
                                
                                const emailRecord = new PreviousRecords({ email })
                                emailRecord.save()
                                .then(result => console.log('email record is added'))
                                .catch(err => console.log(err))

                            }).catch(err => console.log(err))
                        }).catch(err => console.log(err))
                    }
                }).catch(err => console.log(err))
            }
        })
    } else {
        res.json({msg: 'provide all data please'});
        console.log('provide all data please')
    }
})

function isAuth(req, res, next){
    if(req.session.userID){
        return next()
    } else {
        console.log('not auth')
        return res.json({msg: 'you are not authenticated'})
    }
}

// ---------------------------------------- ACTIVATE ACCOUNT -----------------------------------------------
router.post('/signin/activate-account', (req, res) => {

})

// ---------------------------------------- Login user -------------------------------------------------------------

router.post('/signin', (req, res) => {

    const {email, password} = req.body
    if (email && password) {
        User.findOne({email: email})
        .then(user => {
            if (!user) {
                console.log('user not found');
                return res.json({msg: 'user not found'});
            }
            bcrypt.compare(password, user.password)
            .then(isValid => {
                if (!isValid) {
                    console.log('password incorrect')
                    return res.json({msg: 'password incorrect'})
                } else {
                    req.session.userID = user._id
                    console.log(req.session)
                    console.log('session ID = ' + req.sessionID)
                    return res.json({loggedIn: true})
                }
            }).catch(err => console.log(err))
            
        }).catch(err => {
            console.log(err)
            res.json({error: 'something wrong in the server'})
        })
    } else {
        res.json({msg: 'please fill in all fields'})
    }
})




// ---------------------------------------- Get user -------------------------------------------------------------

router.get('/api/user', isAuth, (req, res) => {
    // req.session.views += 1;
    User.findOne({_id: req.session.userID})
    .then(user => {
        res.json({loginId: user._id, username: user.username})

    }).catch(err => console.log(err))
})
//------------------------------------------------------------------------------------------------------------------


router.use(suggestedUsers)
router.use(notifications)
router.use(friendsAndMessages)
// router.use(profileApi)
// router.use(visitedUserApi)










router.post('/api/start-message', (req, res) => {
    const {to, msg} = req.body    
    // save Msg to me
    User.findOne({_id: req.session.userID})
    .then(loggedIn => {
        const exactFriend = loggedIn.userFriends.filter(friend => friend.friendId == to)[0]
        exactFriend.conversations.push({
            me: msg
        })
        // add friend to conversationFriends[]

        const exists = loggedIn.conversationFriends.find(user => user.id == to)
        if(!exists) {
            loggedIn.conversationFriends.push({id: to})
        }

        loggedIn.save()


        // save Msg to him
        User.findOne({_id: to})
        .then(recepient => {
            
            const exactFriend = recepient.userFriends.filter(friend => friend.friendId == loggedIn._id)[0]
            exactFriend.news = true
            exactFriend.conversations.push({
                him: msg
            })
            // add friend to friendConversatios[]
            const exists2 = recepient.conversationFriends.find(user => user.id == loggedIn._id)
            console.log('exists2')
            console.log(exists2)
            if(!exists2) {
                recepient.conversationFriends.push({id: loggedIn._id})
            }
            recepient.save()
        }).catch(err => console.log(err))

    }).catch(err => console.log(err))
})











































//------------------------------------------- 404 page -------------------------------------------------------------------------

router.use(express.static(path.join(__dirname, '/404')))

router.use((req, res) => {
    res.sendFile(path.join(__dirname, '404/noApi.html'))
})




module.exports = router
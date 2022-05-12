const express = require('express')
const router = express.Router()
const User = require('../model/user')
const PreviousRecords = require('../model/previousRecords')
const path = require('path')
const suggestedUsers = require('./suggestedUsers')
const notifications = require('./notifications')
const friendsAndMessages = require('./friends&messages')
const profileApi = require('./profileApi')
const visitedProfileApi = require('./visitedProfileApi')
const multer = require('multer')
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer")
const { v4: uuidv4 } = require('uuid')


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, __dirname + '/uploads')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter
})
const handleFile =  upload.single('image')
// ---------------------------------------- Register user -------------------------------------------------------------
router.post('/signup', handleFile, (req, res) => {
    const { username, email, password, gender, birthday } = req.body
    if(username && email && password && gender && birthday && req.file){
        PreviousRecords.findOne({email: email})
        .then(emailRec => {
            if(emailRec) {
                res.json({msg: 'email is already registered'})
            } else {
                User.findOne({username: username})
                .then(user => {
                    let shouldRegister = true
                    if(user) {
                        res.json({msg: 'username is already taken'})
                        shouldRegister = false
                    }
                    if(password.length < 8 || password.length > 30) {
                        res.json({msg: 'password length must be between 8 char and 30'})
                        shouldRegister = false
                    }
                    if(shouldRegister) {
                        bcrypt.genSalt(10)
                        .then(salt => {
                            bcrypt.hash(password, salt)
                            .then(hash => {
                                const token = uuidv4()
                                const newUser = new User({
                                    username,
                                    email,
                                    password: hash,
                                    gender,
                                    birthday,
                                    userImage: req.file.filename,
                                    isActivated: false,
                                    activationToken: token
                                })
                                let transporter = nodemailer.createTransport({
                                    service: "Gmail",
                                    auth: {
                                        user: process.env.EMAIL,
                                        pass: process.env.EMAIL_PASS,
                                    }
                                })
				                const url = `${process.env.ACTIVATION_URL}/${token}`
                                transporter.sendMail({
                                    from: `"Dating App" <${process.env.EMAIL}>`, 
                                    to: email, 
                                    subject: "Account activation", 
                                    text: "Hello world?", 
                                    html: `<h1>Hello there this is Node.js App</h1>
					                        <b>activate account please</b>
					                        <a href=${url}>click here to activate your account</a>`, 
                                }).then(info => {
                                    const emailRecord = new PreviousRecords({ email })
                                    emailRecord.save()
                                    .then(record => {
                                        newUser.save()
                                        .then(myuser => {
                                            res.json({msg: 'user added to database successfully'})
                                        }).catch(err => {
                                            PreviousRecords.findOneAndRemove({email: email})
                                        })
                                    }).catch(err => {
                                        console.log(err)
                                    })
                                }).catch(err => console.log(err))
                            }).catch(err => console.log(err))
                        }).catch(err => console.log(err))
                    }
                }).catch(err => console.log(err))
            }
        }).catch(err => console.log(err))
    } else {
        res.json({msg: 'Provide all data or the right data types and size not exceeding 5MB please'});
    }
})

function isAuth(req, res, next){
    if(req.session.userID){
        return next()
    } else {
        return res.json({msg: 'you are not authenticated'})
    }
}

// ---------------------------------------- ACTIVATE ACCOUNT -----------------------------------------------
router.get('/signin/activate-account/:id', (req, res) => {
    User.findOne({activationToken: req.params.id})
    .then(user => {
        if (!user) {
            return res.json({message: 'token is invalid'})
        }
        if (user.isActivated == false){
            user.isActivated = true
            user.save()
            .then(result => {
                return res.redirect(`${process.env.CLIENT1}/signin`)
            }).catch(err => console.log(err))
        } else {
            return res.json({message: 'account is already activated'})
        } 
    }).catch(err => console.log(err))
})

// ---------------------------------------- Login user -------------------------------------------------------------
router.post('/signin', (req, res) => {
    const {email, password} = req.body
    if (email && password) {
        User.findOne({email: email})
        .then(user => {
            if (!user) {
                return res.json({msg: 'user not found'})
            }
            if (!user.isActivated) {
                return res.json({msg: 'account is not activated'})
            }
            bcrypt.compare(password, user.password)
            .then(isValid => {
                if (!isValid) {
                    return res.json({msg: 'password incorrect'})
                } else {
                    req.session.userID = user._id
                    return res.json({loggedIn: true})
                }
            }).catch(err => console.log(err))
        }).catch(err => {
            res.json({error: 'something wrong in the server'})
        })
    } else {
        res.json({msg: 'please fill in all fields'})
    }
})

// ---------------------------------------- RESET PASS EMAIL -------------------------------------------------------------
function generateCode(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters[Math.floor(Math.random() * charactersLength)]
    }
    return result;
}

function expireCode(id){
	setTimeout(() => {
		User.findOne({_id: id})
        .then(user => {
            if(user.resetPassToken !== null){
                user.resetPassToken = null
                user.save()
            }
		}).catch(err => console.log(err))
	}, 60000 * process.env.EXPIRE_CODE)
}

router.post('/forgot-password', (req, res) => {
    if (req.body.email) {
        User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                return res.json({msg: 'email is invalid'})
            }
            if (user.resetPassToken == null){
                const token = generateCode(8)
                user.resetPassToken = token
                user.save()
                .then(result => {
                    let transporter = nodemailer.createTransport({
                        service: "Gmail",
                        auth: {
                            user: process.env.EMAIL,
                            pass: process.env.EMAIL_PASS,
                        }
                    })
                    transporter.sendMail({
                        from: `"Dating App" <${process.env.EMAIL}>`, 
                        to: user.email, 
                        subject: "Password reset",  
                        html: `<h1>Hello from Node.js App</h1>
                                <p>Hi ${user.username}, Look's like you want to reset your password</p>
                                <b>Reset password please, here's the code</b>
                                <p>${token}</p>`, 
                    }).then(info => {
                        expireCode(user._id)
                        return res.json({msg: 'reset email is sent'})
                    }).catch(err => console.log(err))
                }).catch(err => console.log(err))
            } else {
                return res.json({msg: 'reset password email is already sent'})
            }
        }).catch(err => console.log(err))
    } else {
        return res.json({msg: 'please fill in field'})
    }
})

// ---------------------------------------- RESET PASS EMAIL -------------------------------------------------------------

router.post('/reset-forgot-password/:token', (req, res) => {
    const {password, confirmPass} = req.body
    if(password && confirmPass && req.params.token) {
        User.findOne({resetPassToken: req.params.token})
        .then(user => {
            if (!user) {
                return res.json({msg: 'code is invalid or had expired'})
            } else {
                if (password === confirmPass) {
                    if(password.length > 8 && password.length < 30) {
                        bcrypt.genSalt(10)
                        .then(salt => {
                            bcrypt.hash(password, salt)
                            .then(hash => {
                                user.password = hash
                                user.resetPassToken = null
                                user.save()
                                .then(result => {
                                    return res.status(200).json({msg: 'password is reset successfully'})
                                }).catch(err => console.log(err)) 

                            }).catch(err => console.log(err))
                        }).catch(err => console.log(err))
                    } else {
                        return res.status(200).json({msg: 'password length must be between 8 char and 30'})
                    }
                } else {
                    return res.status(200).json({msg: 'confirmation passwords are not the same'})
                }
            }
        }).catch(err => console.log(err))
    } else {
        return res.json({msg: 'please fill in all fields'})
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
router.use(profileApi)
router.use(visitedProfileApi)

router.post('/api/start-message', isAuth, (req, res) => {
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
            if(!exists2) {
                recepient.conversationFriends.push({id: loggedIn._id})
            }
            recepient.save()
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
})

router.post('/api/update-image', isAuth, handleFile, (req, res) => {
    User.findOne({_id: req.session.userID})
    .then(loggedIn => {
        if(req.file){
            loggedIn.userImage = req.file.filename
            loggedIn.save()
            .then(result => {
                res.status(200).json({msg: 'Image is updated successfully'})
            }).catch(err => console.log(err))
        } else {
            res.status(200).json({msg: 'Provide file or the right data types and size not exceeding 5MB please'})
        }
    }).catch(err => console.log(err))
})

//------------------------------------------- 404 page -------------------------------------------------------------------------

router.use(express.static(path.join(__dirname, '/404')))

router.use((req, res) => {
    res.sendFile(path.join(__dirname, '404/noApi.html'))
})



module.exports = router
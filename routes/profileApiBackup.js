const express = require('express')
const router = express.Router()
const User = require('../model/user')
const PreviousRecord = require('../model/previousRecords')
const bcrypt = require('bcrypt')





//------------------------------ UPDATE USERNAME ----------------------------------------

router.post('/api/update-username', (req, res) => {
   
    User.findOne({_id: req.session.userID})
    .then(loggedIn => {
        
        // chech for password compatibility...
        // if true update username
        // if false res.json({result:'password incorrect'})

        
    }).catch(err => console.log(err)) 
})

//------------------------------ GET INFOS ----------------------------------------
router.get('/api/get-infos', (req, res) => {
   
    User.findOne({_id: req.session.userID})
    .then(loggedIn => {
        
        let contact = {phone: '', address: '', email: '', site: ''}
        let places = {currentCity: '', homeTown: ''}

        let basics = {
            username: loggedIn.username,
            email: loggedIn.email,
            birthday: loggedIn.birthday,
            gender: loggedIn.gender, 
            accountDate: loggedIn.accountDate
        }

        if(loggedIn.contact == undefined && loggedIn.places == undefined) {
            console.log('both null')
            res.status(200).json({basics, contact, places})
        } else {
            res.status(200).json({basics, contact: loggedIn.contact, places: loggedIn.places})
        }
        
    }).catch(err => console.log(err)) 
})


//------------------------------ SET INFOS ----------------------------------------

/* I check on the server the exact similarity of the data as well to make sure that
nobody else overloads my server with a ton of requests that could possibly crash it, 
by using this approach I'm only updating the database server with legitmate requests */

router.post('/api/update-infos', (req, res) => {
   
    User.findOne({_id: req.session.userID})
    .then(loggedIn => {
            const {newPhone, newAddress, newEmail, newSite, newCity, newHometown} = req.body
            let shouldSave = false

            if(loggedIn.contact !== undefined && loggedIn.places !== undefined)  {
                const {phone, address, email, site} = loggedIn.contact
                const {currentCity, hometown} = loggedIn.places
                console.log(' set info both true')
                if(newPhone !== phone
                || newAddress !== address
                || newEmail !== email
                || newSite !== site
                || newCity !== currentCity
                || newHometown !== hometown) {

                    console.log('you can add changes')
                    loggedIn.contact = {phone: newPhone, address: newAddress, email: newEmail, site: newSite}
                    loggedIn.places = {currentCity: newCity, hometown: newHometown}
                    shouldSave = true
                } else {
                    console.log('you can noooot add changes')
                }

            } else {
                console.log(' set Info both false')
                loggedIn.contact = {phone: newPhone, address: newAddress, email: newEmail, site: newSite}
                loggedIn.places = {currentCity: newCity, hometown: newHometown}
                shouldSave = true
            }

            if(shouldSave) {
                loggedIn.save()
                .then(result => {
                    res.status(200).json({contact: result.contact, places: result.places})
                }).catch(err => {
                    console.log(err)
                    res.status(500).json(err)
                }) 
            }
        
    }).catch(err => console.log(err)) 
})

//------------------------------ GET FRIEND COUNT----------------------------------------

router.get('/api/get-friendCount', (req, res) => {
   
    User.findOne({_id: req.session.userID})
    .then(loggedIn => {

        res.status(200).json(loggedIn.userFriends.length)
    }).catch(err => console.log(err)) 
})

//------------------------------ GET ABOUT ME ----------------------------------------

router.get('/api/get-aboutMe', (req, res) => {
   
    User.findOne({_id: req.session.userID})
    .then(loggedIn => {
        
        if (loggedIn.aboutMe !== undefined) {
            console.log('there is aboutMe data')
            res.status(200).json(loggedIn.aboutMe)
        } else {
            res.status(204).json({msg: 'No aboutMe infos'})
        }
      
    }).catch(err => console.log(err)) 
})

//------------------------------ SET ABOUT ME ----------------------------------------

router.post('/api/update-aboutMe', (req, res) => {
   
    User.findOne({_id: req.session.userID})
    .then(loggedIn => {
        
        if(loggedIn.aboutMe !== undefined) {
            if(req.body.aboutMe !== loggedIn.aboutMe) {
                console.log('comparing data')
                loggedIn.aboutMe = req.body.aboutMe
            }
        } else {
            console.log('adding directly')
            loggedIn.aboutMe = req.body.aboutMe
        }
        
        loggedIn.save()
        .then(result => {
            res.status(200).json(result.aboutMe)
        }).catch(err => {
            console.log(err)
            res.status(500).json(err)
        }) 
    }).catch(err => console.log(err)) 
})

//------------------------------ GET FRIENDS ----------------------------------------

router.get('/api/get-friends', (req, res) => {
   
    User.findOne({_id: req.session.userID})
    .then(loggedIn => {
        
        res.status(200).json(loggedIn.userFriends)
        
    }).catch(err => console.log(err)) 
})

//------------------------------ DELETE FRIENDS ----------------------------------------

router.post('/api/delete-friends/:id', (req, res) => {
    const deletedId = req.params.id
    User.findOne({_id: req.session.userID})
    .then(loggedIn => {

        loggedIn.userFriends = loggedIn.userFriends.filter(friend => friend.friendId !== deletedId)
        loggedIn.conversationFriends = loggedIn.conversationFriends.filter(convf => convf.id !== deletedId)
        



        User.findOne({_id: deletedId})
        .then(friend => {

            friend.userFriends = friend.userFriends.filter(friend => friend.friendId !== loggedIn.id)
            friend.conversationFriends = friend.conversationFriends.filter(convf => convf.id !== loggedIn.id)
            
            friend.save()
            .then(result => {
                console.log('removing logged in user from friend user')
            }).catch(err => {
                console.log(err)
                res.status(500).json(err)
            }) 
        }).catch(err => console.log(err)) 




        loggedIn.save()
        .then(result => {
            res.status(200).json(result.userFriends)
        }).catch(err => {
            console.log(err)
            res.status(500).json(err)
        }) 
    }).catch(err => console.log(err)) 
})

//------------------------------  UPDATE PASSWORD ----------------------------------------

router.post('/api/update-password', (req, res) => {
    const {currentPass, newPass, newPassConf} = req.body
    if(currentPass && newPass && newPassConf) {
        User.findOne({_id: req.session.userID})
        .then(loggedIn => {
            // compare current password with requested one
            bcrypt.compare(currentPass, loggedIn.password)
            .then(isValid => {
                if (isValid) {
                    
                    if (newPass === newPassConf) {
                        if(currentPass !== newPassConf) {
                            if(newPassConf.length > 8 && newPassConf.length < 30) {
                                bcrypt.genSalt(10)
                                .then(salt => {
                                    bcrypt.hash(newPassConf, salt)
                                    .then(hash => {
                                        loggedIn.password = hash
                                        
                                        loggedIn.save()
                                        .then(result => {
                                            res.status(200).json({msg: 'password updated successfully'})
                                        }).catch(err => console.log(err)) 
                                    }).catch(err => console.log(err))
                                }).catch(err => console.log(err))
                            } else {
                                res.status(200).json({msg: 'password length must be between 8 char and 20'})
                            }
                        } else {
                            res.status(200).json({msg: 'password are the same'})
                        }
                    } else {
                        res.status(200).json({msg: 'confirmation passwords are not the same'})
                    }
                } else {
                    res.status(200).json({msg: 'password is wrong'})
                }
            }).catch(err => console.log(err))
        }).catch(err => console.log(err))


    } else {
        res.json({msg: 'please fill in all fields'})
    }
})






//------------------------------  DELETE USER ACCOUNT ----------------------------------------

router.post('/api/remove-user-account/', (req, res) => {

    const { password } = req.body

    if(password){
        User.findOne({_id: req.session.userID})
        .then(loggedIn => {
            bcrypt.compare(password, loggedIn.password)
            .then(isValid => {
                if (!isValid) {
                    res.json({msg: 'password incorrect'})
                } else {

                }
            }).catch(err => console.log(err))

        }).catch(err => console.log(err))
    } else {
        res.json({msg: 'Please type password'})
    }

    // User.find()
    // .then(allUsers => {
       

    //     allUsers.filter(user => user._id !== req.session.userID)

    //     allUsers.save()
    //     .then(result => {
    //         res.json({m})
    //     })
    //     .catch(err => console.log(err))

    //     res.status(200).json({deleted: true})

    // }).catch(err => console.log(err)) 
})

module.exports = router
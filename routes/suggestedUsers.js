const express = require('express')
const router = express.Router()
const User = require('../model/user')

function isAuth(req, res, next){
    if(req.session.userID){
        return next()
    } else {
        return res.json({msg: 'you are not authenticated'})
    }
}

// ---------------------------------------- Get Suggested user -------------------------------------------------------------

router.get('/api/suggested-users', isAuth, (req, res) => {
    const allUsers = []
    User.find()
    .then(users => {
        User.findOne({_id: req.session.userID})
        .then(loggedIn => {
            // Checking if all are empty
            if(loggedIn.userFriends.length <= 0 && loggedIn.requestIsSent.length <= 0 && loggedIn.newInvitations.length <= 0) {
                users.forEach(user => {
                    if (user._id == loggedIn._id.toString()) {
                       return null
                    } else {
                        return allUsers.push({id: user._id, username: user.username, userImage: user.userImage})
                    }
                })
                res.status(200).json(allUsers)
            }
            // Checking if all are full
            if(loggedIn.userFriends.length > 0 && loggedIn.requestIsSent.length > 0 && loggedIn.newInvitations.length > 0) {
                let f1 = users.filter(user => user._id != loggedIn._id.toString())
                loggedIn.requestIsSent.forEach(request => {
                    f1 = f1.filter(user => user._id != request.userId)
                })
                loggedIn.userFriends.forEach(friend => {
                    f1 = f1.filter(user => user._id != friend.friendId)
                })
                loggedIn.newInvitations.forEach(invit => {
                    f1 = f1.filter(user => user._id != invit.from)
                })
                f1.forEach(elmt => allUsers.push({id: elmt._id, username: elmt.username, userImage: elmt.userImage}))
                res.status(200).json(allUsers)
            }                             
                       
            // Checking Friends && RequestIsSent
            if (loggedIn.userFriends.length > 0 && loggedIn.requestIsSent.length > 0 && loggedIn.newInvitations.length <= 0) {
                let f1 = users.filter(user => user._id != loggedIn._id.toString())
                loggedIn.requestIsSent.forEach(request => {
                    f1 = f1.filter(user => user._id != request.userId)
                })
                loggedIn.userFriends.forEach(friend => {
                    f1 = f1.filter(user => user._id != friend.friendId)
                })
                f1.forEach(elmt => allUsers.push({id: elmt._id, username: elmt.username, userImage: elmt.userImage}))
                res.status(200).json(allUsers)
            }

            // Checking Friends && NewInvitations
            if (loggedIn.userFriends.length > 0 && loggedIn.newInvitations.length > 0 && loggedIn.requestIsSent.length <= 0) {
                let f1 = users.filter(user => user._id != loggedIn._id.toString())
                loggedIn.userFriends.forEach(friend => {
                    f1 = f1.filter(user => user._id != friend.friendId)
                })
                loggedIn.newInvitations.forEach(invit => {
                    f1 = f1.filter(user => user._id != invit.from)
                })
                f1.forEach(elmt => allUsers.push({id: elmt._id, username: elmt.username, userImage: elmt.userImage}))
                res.status(200).json(allUsers)
            }
            // Checking NewInvitations && RequestIsSent
            if (loggedIn.requestIsSent.length > 0 && loggedIn.newInvitations.length > 0 && loggedIn.userFriends.length <= 0) {
                let f1 = users.filter(user => user._id != loggedIn._id.toString())
                loggedIn.requestIsSent.forEach(request => {
                    f1 = f1.filter(user => user._id != request.userId)
                })
                loggedIn.newInvitations.forEach(invit => {
                    f1 = f1.filter(user => user._id != invit.from)
                })
                f1.forEach(elmt => allUsers.push({id: elmt._id, username: elmt.username, userImage: elmt.userImage}))
                res.status(200).json(allUsers)
            }
            // Checking Friends
            if (loggedIn.userFriends.length > 0 && loggedIn.requestIsSent.length <= 0 && loggedIn.newInvitations.length <= 0) {
                let f1 = users.filter(user => user._id != loggedIn._id.toString())
                loggedIn.userFriends.forEach(friend => {
                    f1 = f1.filter(user => user._id != friend.friendId)
                })
                f1.forEach(elmt => allUsers.push({id: elmt._id, username: elmt.username, userImage: elmt.userImage}))
                res.status(200).json(allUsers)
            }
            // Checking requestIsSent
            if (loggedIn.requestIsSent.length > 0 && loggedIn.userFriends.length <= 0 && loggedIn.newInvitations.length <= 0) {     
                let f1 = users.filter(user => user._id != loggedIn._id.toString())
                loggedIn.requestIsSent.forEach(invit => {
                    f1 = f1.filter(user => user._id != invit.userId)
                })
                f1.forEach(elmt => allUsers.push({id: elmt._id, username: elmt.username, userImage: elmt.userImage}))
                res.status(200).json(allUsers)
            }
            // Checking NewInvitations
            if (loggedIn.newInvitations.length > 0 && loggedIn.userFriends.length <= 0 && loggedIn.requestIsSent.length <= 0) {
                let f1 = users.filter(user => user._id != loggedIn._id.toString())
                loggedIn.newInvitations.forEach(invit => {
                    f1 = f1.filter(user => user._id != invit.from)
                })
                f1.forEach(elmt => allUsers.push({id: elmt._id, username: elmt.username, userImage: elmt.userImage}))
                res.status(200).json(allUsers)
            }
        }).catch(err => console.log(err))          
    }).catch(err => console.log(err))
})
//---------------------------------------------------- Post Invitation ---------------------------------------------------------
router.post('/api/send-invitation/:id', isAuth, (req, res) => {
    const receiverId = req.params.id           
    User.findOne({_id: req.session.userID})
    .then(loggedIn => {
        User.findOne({_id: receiverId})
        .then(receiver => {
            const doesExist = receiver.requestIsSent.find(user => user.userId == loggedIn._id) 
            if(!doesExist) {
                loggedIn.requestIsSent.push({username: receiver.username, userId: receiverId})
                loggedIn.save()
                receiver.newInvitations.push({from: loggedIn._id, username: loggedIn.username})
                receiver.save()
                .then(result => {
                    res.status(200).json({msg: 'invitation is sent'})
                }).catch(err => {
                    res.status(500).json({msg: 'server error'})
                    console.log(err)
                })
            }
        }).catch(err => console.log(err))
    }).catch(err => {
        console.log(err)
        res.status(500).json({msg: 'server error'})
    })
})

//------------------------------------------------------ SEARCH USERS ---------------------------------------------------------
router.post('/api/search-user', isAuth, (req, res) => {
    User.findOne({_id: req.session.userID})
    .then(loggedIn => {
        User.findOne({username: req.body.username})
        .then(searchedOne => {
            if (searchedOne.username !== loggedIn.username) {
                let found = false
                if (found === false) {
                    loggedIn.requestIsSent.forEach(request => {
                        if(request.username === searchedOne.username) {
                            res.status(200).json({searchedImage: searchedOne.userImage, searchedId: searchedOne._id, username: searchedOne.username, status: 'requestIsSent'})
                            found = true
                        }
                    })
                }
                if (found === false) {
                    loggedIn.newInvitations.forEach(invit => {
                        if(invit.username === searchedOne.username) {
                            res.status(200).json({searchedImage: searchedOne.userImage, searchedId: searchedOne._id, username: searchedOne.username, status: 'newInvitations'})
                            found = true
                        }
                    })
                }
                if (found === false) {
                    loggedIn.userFriends.forEach(friend => {
                        if(friend.friendName === searchedOne.username) {
                            res.status(200).json({searchedImage: searchedOne.userImage, searchedId: searchedOne._id, username: searchedOne.username, status: 'userFriends'})
                            found = true
                        }
                    })
                }
                if(found === false) {
                    res.status(200).json({searchedImage: searchedOne.userImage, searchedId: searchedOne._id, username: searchedOne.username, status: 'suggested'})
                }
            }
        }).catch(err => {
            console.log(err)
            res.status(404).json({msg: 'user not found'})
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({msg: 'server error'})
    })
})

module.exports = router
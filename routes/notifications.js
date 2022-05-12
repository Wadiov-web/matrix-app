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

function getImage(invits, cb){ 
    let finalInvits = []
    for(let i = 0; i < invits.length; i++){
        User.findOne({_id: invits[i].from})
        .then(specUser => {
            finalInvits.push({
                    image: specUser.userImage,
                _id: invits[i]._id,
                    from: invits[i].from,
                    username: invits[i].username,
                    date: invits[i].date 
                })   
                if(i === invits.length - 1) return cb(finalInvits)
        }).catch(err => console.error(err))
    }
}

//---------------------------------------------- Getting Invitations -------------------------------------------------------------------------------
router.get('/api/get-invitations', isAuth, (req, res) => {
    User.findOne({_id: req.session.userID})
    .then(loggedIn => {
        if (loggedIn.newInvitations.length > 0){    
            let invits = loggedIn.newInvitations
            getImage(invits, result => {
                res.status(200).json(result)    
            })
	    } else {
            res.status(204).json({message: 'No invitations were found'})
        }
    }).catch(err => console.log(err)) 
})

//------------------------------------------------------------------- DENY INVITATION ------------------------------------------------------
router.post('/api/deny-invitations', isAuth, (req, res) => {
    User.findOne({_id: req.session.userID})
    .then(loggedIn => {
        loggedIn.notifs.push({
            username: req.body.invitUsername,
            msg: 'you have denied his invitation request'
        })
        // Remove user from requestIsSent
        User.findOne({_id: req.body.from})
        .then(inviter => {
            const f = inviter.requestIsSent.filter(reqt => reqt.userId != loggedIn._id)
            inviter.requestIsSent = f
            inviter.save()
        }).catch(err => console.log(err))
        const ready = loggedIn.newInvitations.filter(invit => req.body.from != invit.from)
        loggedIn.newInvitations = ready
        loggedIn.save()
        .then(resp => {
	        getImage(loggedIn.newInvitations, result => {
		        res.status(200).json({invitations: result, notifications: loggedIn.notifs})
            })
        }).catch(err => console.log(err)) 
    }).catch(err => console.log(err)) 
})

//----------------------------------------------------- CONFIRM INVITATION ------------------------------------------------------------
router.post('/api/confirm-invitations', isAuth, (req, res) => {    
    User.findOne({_id: req.session.userID})
    .then(loggedIn => {
        // Inviter part
        User.findOne({_id: req.body.from})
        .then(inviter => {
            // add me (loggedIn) to inviter's userFriends[]
            inviter.userFriends.push({friendImage: loggedIn.userImage, friendId: loggedIn._id, friendName: loggedIn.username, news: false})
            // add to inviter's notifs[]
            inviter.notifs.push({username: loggedIn.username, msg: 'has accepted your invitation request'})
            // remove me from inviter's requestIsSent[]
            const f2 = inviter.requestIsSent.filter(reqt => reqt.userId != loggedIn._id)
            inviter.requestIsSent = f2
            inviter.save()
            .then(result => {
                console.log('inviter part is successfully done ' + result)
            }).catch(err => console.log(err)) 
            // loggedIn part
            // add user to my userFriends[]
            loggedIn.userFriends.push({friendImage: inviter.userImage, friendId: req.body.from, friendName: req.body.invitUsername, news: false})
            // add to my notifs[]
            loggedIn.notifs.push({username: req.body.invitUsername, msg: 'you have accepted his invitation request'})
            // remove inviter from newInvitations[]
            const f = loggedIn.newInvitations.filter(invit => req.body.from != invit.from)
            loggedIn.newInvitations = f
            loggedIn.save()
            .then(resp => {
		        getImage(loggedIn.newInvitations, result => {
                    res.status(200).json({invitations: result, notifications: loggedIn.notifs})
                })
            }).catch(err => console.log(err))
        }).catch(err => console.log(err)) 
    }).catch(err => console.log(err)) 
})

//--------------------------------------------------- GET NOTIFS ----------------------------------------------------------------
router.get('/api/get-notifications', isAuth, (req, res) => {
    User.findOne({_id: req.session.userID})
    .then(loggedIn => {
        if (loggedIn.notifs.length > 0){
            res.status(200).json(loggedIn.notifs)
        } else {
            res.status(204).json({message: 'No notifications were found'})
        }
    }).catch(err => console.log(err)) 
})


module.exports = router
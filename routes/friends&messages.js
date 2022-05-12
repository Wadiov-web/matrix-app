const express = require('express')
const router = express.Router()
const User = require('../model/user')

const webSocket = require('../server')
const fs = require('fs');
const path = require('path');

function isAuth(req, res, next){
    if(req.session.userID){
        return next()
    } else {
        return res.json({msg: 'you are not authenticated'})
    }
}

//------------------------------------------------------- GET PREVIOUS MESSAGES ---------------------------------------------------
router.get('/api/get-msgs/:id', isAuth, (req, res) => {
    const exactFriendId = req.params.id
    User.findOne({_id: req.session.userID})
    .then(loggedIn => {
        const exactFriend = loggedIn.userFriends.filter(friend => friend.friendId == exactFriendId)[0]
        if (exactFriend.conversations.length > 0) {
	     	exactFriend.conversations.forEach(conv => {
                if(conv.imgMe){
                    try{
                        const data = fs.readFileSync(path.join(__dirname, `/messageImages/${conv.imgMe}`), 'utf8')
                        conv.imgMe = data
                    } catch(err){
                        console.error(err)
                    }
                }
                if(conv.imgHim){
                    try{
                        const data = fs.readFileSync(path.join(__dirname, `/messageImages/${conv.imgHim}`), 'utf8')
                        conv.imgHim = data
                    } catch(err){
                        console.error(err)
                    }
                }
		    })
            res.status(200).json(exactFriend.conversations)
        } else {
            res.status(204).json({message: 'No conversations were found'})
        }
    }).catch(err => console.log(err))
})

//------------------------------------------------------- INIT WEBSOCKET CONNECTION ---------------------------------------------------
let users = []
webSocket.on('connection', (socket) => {
    console.log('a user connected')
    let loggedInId
    socket.on('signin', data => {
        loggedInId = data.userId
        let existed = false
        users.forEach(user => {
            if(user.username == data.username){
                user.sid = socket.id
                existed = true
            }
        })
        if(!existed){
            users.push({userId: data.userId, username: data.username, sid: socket.id})
        }
    })
    // Private messaging
    socket.on('private', (packet) => {
        let connected = false
        users.forEach(user => {
            if (user.userId == packet.to) {
                connected = true
                webSocket.to(user.sid).emit('incoming', packet)
                webSocket.to(user.sid).emit('newMsg', packet)
                // And save msg to database
                // save Msg to me
		        const filename = `image${Date.now()}.txt`
                User.findOne({_id: loggedInId})
                .then(loggedIn => {
                    const exactFriend = loggedIn.userFriends.filter(friend => friend.friendId == packet.to)[0]
                    if(packet.type === 'text'){
                        exactFriend.conversations.push({me: packet.msg})
                    } else {
                        // write to file here    
                        fs.writeFile(path.join(__dirname, `./messageImages/${filename}`), packet.msg, err => {
                            if(err){
                                console.error(err)
                            }
                            return
                        })
                        exactFriend.conversations.push({imgMe: filename})
		            }
		            loggedIn.save()
                }).catch(err => console.log(err)) 
                // // save Msg to him
                User.findOne({_id: packet.to})
                .then(recepient => {
                    const exactFriend = recepient.userFriends.filter(friend => friend.friendId == loggedInId)[0]
                    if(packet.type === 'text'){
                        exactFriend.conversations.push({him: packet.msg})
                    } else {
                        exactFriend.conversations.push({imgHim: filename})
                    }
                    recepient.save()
                }).catch(err => console.log(err))
            } 
        })
        if (!connected) {
            // And save msg to database
            // save Msg to me
		    const filename = `image${Date.now()}.txt`
            User.findOne({_id: loggedInId})
            .then(loggedIn => {
                const exactFriend = loggedIn.userFriends.filter(friend => friend.friendId == packet.to)[0]
                if(packet.type === 'text'){
                    exactFriend.conversations.push({me: packet.msg})
                } else {
                    // write to file here
                    fs.writeFile(path.join(__dirname, `/messageImages/${filename}`), packet.msg, err => {
                        if(err){
                            console.error(err)
                        }
                        return
                    })
                    exactFriend.conversations.push({imgMe: filename})
		        }
		        loggedIn.save()
            }).catch(err => console.log(err)) 
            // save Msg to him
            User.findOne({_id: packet.to})
            .then(recepient => {
                const exactFriend = recepient.userFriends.filter(friend => friend.friendId == loggedInId)[0]
                if(packet.type === 'text'){
                    exactFriend.conversations.push({him: packet.msg})
                } else {
                    exactFriend.conversations.push({imgHim: filename})
                }
                exactFriend.news = true
                recepient.save()
            }).catch(err => console.log(err))
	    }
    })
})

//--------------------------------------------------- GET FRIENDS ----------------------------------------------------------------
function getImage(onUsers, cb){
    let finalFriends = []
    for(let i = 0; i < onUsers.length; i++){
        User.findOne({_id: onUsers[i].friendId})
        .then(specUser => {
            finalFriends.push({
                friendImage: specUser.userImage,
                friendId: onUsers[i].friendId,
                friendName: onUsers[i].friendName,
		        news: onUsers[i].news,
		        connected: onUsers[i].connected
            })
            if(i === onUsers.length - 1) return cb(finalFriends)
        }).catch(err => console.error(err))
    }
}

router.get('/api/get-friends', isAuth, (req, res) => {
    User.findOne({_id: req.session.userID})
    .then(loggedIn => {
        if (loggedIn.userFriends.length > 0 && loggedIn.conversationFriends.length > 0) {
            let f = []
            loggedIn.conversationFriends.forEach(user => {
                let found = loggedIn.userFriends.find(friend => friend.friendId == user.id)
                f.push(found)
            })
            const onUsers = []
            f.forEach((user) => {
                let found = false
                users.forEach((user2) => {
                    if(user.friendId == user2.userId){
                        onUsers.push({
                            friendName: user.friendName,
                            friendId: user.friendId,
                            news: user.news,
                            connected: true
                        })
                        found = true
                    }
                })
                if (!found) {
                    onUsers.push({
                        friendName: user.friendName,
                        friendId: user.friendId,
                        news: user.news,
                        connected: false
                    })
                }
            })
            getImage(onUsers, result => {
                res.status(200).json(result)
            })
        } else {
            res.status(204).json({message: 'No conversations were found'})
        }
    }).catch(err => console.log(err)) 
})

// Turn news to False
router.post('/api/remove-news', isAuth, (req, res) => {
    const id = req.body.friendId
    User.findOne({_id: req.session.userID})
    .then(loggedIn => {
        const exactFriend = loggedIn.userFriends.filter(friend => friend.friendId == id)[0]
        if (exactFriend.news === true) {
            exactFriend.news = false
        }
        loggedIn.save()
    }).catch(err => console.log(err)) 
})

// Turn news to True
router.post('/api/add-news', isAuth, (req, res) => {
    const id = req.body.friendId
    User.findOne({_id: req.session.userID})
    .then(loggedIn => {
        const exactFriend = loggedIn.userFriends.filter(friend => friend.friendId == id)[0]
        if (exactFriend.news === false) {
            exactFriend.news = true
            loggedIn.save()
        }
    }).catch(err => console.log(err)) 
})

// ---------------------------------------- Logout user ----------------------------------------------------------------------
router.post('/logout', isAuth, (req, res) => {
    users = users.filter(user => user.userId == req.session.userId)
    req.session.destroy(err => {
        if(err){
            return res.status(500).json({msg: 'error'})
        }
        return res.status(200).json({loggedIn: false})
    })
})

module.exports = router
const express = require('express')
const router = express.Router()
const User = require('../model/user')

const webSocket = require('../server')


//------------------------------------------------------- GET PREVIOUS MESSAGES ---------------------------------------------------

router.get('/api/get-msgs/:id', (req, res) => {
    const exactFriendId = req.params.id
    //console.log(exactFriendId)
    User.findOne({_id: req.session.userID})
    .then(loggedIn => {

        const exactFriend = loggedIn.userFriends.filter(friend => friend.friendId == exactFriendId)[0]
        //console.log(exactFriend)

        if (exactFriend.conversations.length > 0) {
            res.status(200).json(exactFriend.conversations)
        } else {
            res.status(204).json({message: 'No conversations were found'})
        }

    }).catch(err => console.log(err)) 

})




//------------------------------------------------------- INIT WEBSOCKET CONNECTION ---------------------------------------------------
let users = []
webSocket.on('connection', (socket) => {
    
    //console.log(socket.id)
    console.log('a user connected')

    let loggedInId
    socket.on('signin', data => {
        console.log('signin data')
        console.log(data)
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
        console.log(users)
    })
    
    // Private messaging
    socket.on('private', (packet) => {
        let connected = false
        users.forEach(user => {
            if (user.userId == packet.to) {
                console.log('user connected')
                connected = true
                webSocket.to(user.sid).emit('incoming', packet)
                webSocket.to(user.sid).emit('newMsg', packet)
                // And save msg to database

                 // save Msg to me
                User.findOne({_id: loggedInId})
                .then(loggedIn => {
                    
                    const exactFriend = loggedIn.userFriends.filter(friend => friend.friendId == packet.to)[0]
                    exactFriend.conversations.push({
                        me: packet.msg
                    })
                    loggedIn.save()

                }).catch(err => console.log(err)) 

                // // save Msg to him
                User.findOne({_id: packet.to})
                .then(recepient => {
                
                    const exactFriend = recepient.userFriends.filter(friend => friend.friendId == loggedInId)[0]
                    exactFriend.conversations.push({
                        him: packet.msg
                    })
                    recepient.save()

                }).catch(err => console.log(err))
            } 
        })

        if (!connected) {
            console.log('user not connected')
            // And save msg to database
                // save Msg to me
            User.findOne({_id: loggedInId})
            .then(loggedIn => {

            console.log('loggedIn')
            console.log(loggedInId)
            console.log(loggedIn)
                
                const exactFriend = loggedIn.userFriends.filter(friend => friend.friendId == packet.to)[0]
                exactFriend.conversations.push({
                    me: packet.msg
                })
                loggedIn.save()
            }).catch(err => console.log(err)) 

            // save Msg to him
            User.findOne({_id: packet.to})
            .then(recepient => {
            console.log('recepient')
            console.log(recepient)
                const exactFriend = recepient.userFriends.filter(friend => friend.friendId == loggedInId)[0]
                exactFriend.news = true
                exactFriend.conversations.push({
                him: packet.msg
                })
                recepient.save()
            }).catch(err => console.log(err)) 
        }
    })
})



//--------------------------------------------------- GET FRIENDS ----------------------------------------------------------------

router.get('/api/get-friends', (req, res) => {
   
    User.findOne({_id: req.session.userID})
    .then(loggedIn => {



        if (loggedIn.userFriends.length > 0 && loggedIn.conversationFriends.length > 0) {
            let f = []
            loggedIn.conversationFriends.forEach(user => {
                let found = loggedIn.userFriends.filter(friend => friend.friendId == user.id)[0]
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
            res.status(200).json(onUsers)

        } else {
            res.status(204).json({message: 'No conversations were found'})
        }

    }).catch(err => console.log(err)) 
})

//------------------------------------------------------------------------------------------------------------------------------------



// Turn news to False
router.post('/api/remove-news', (req, res) => {

    const id = req.body.friendId

    User.findOne({_id: req.session.userID})
        .then(loggedIn => {
            console.log('1111 loggedIn')
            console.log(loggedIn)
            console.log('userFriends Array')
            console.log(loggedIn.userFriends)


            const exactFriend = loggedIn.userFriends.filter(friend => friend.friendId == id)[0]
            if (exactFriend.news === true) {
                exactFriend.news = false
            }
            loggedIn.save()
        }).catch(err => console.log(err)) 
})

// Turn news to True
router.post('/api/add-news', (req, res) => {

    const id = req.body.friendId
    console.log('Add News')
    User.findOne({_id: req.session.userID})
        .then(loggedIn => {
    
            const exactFriend = loggedIn.userFriends.filter(friend => friend.friendId == id)[0]
            if (exactFriend.news === false) {
                exactFriend.news = true
            }
            loggedIn.save()
        }).catch(err => console.log(err)) 
})

// ---------------------------------------- Logout user ----------------------------------------------------------------------

router.post('/logout', (req, res) => {

    users = users.filter(user => user.userId == req.session.userId)
   

    req.session.destroy(err => {
        if(err){
            return res.status(500).json({msg: 'error'})
        }
        console.log('User is logged out')
        return res.status(200).json({loggedIn: false})
    })
})

module.exports = router
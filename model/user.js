const mongoose = require('mongoose');





// ---------------------------------------- User Friends -----------------------------------

const convs = new mongoose.Schema({
    me: {
        type: String
    },
    him: {
        type: String
    }
})


const userFriends = new mongoose.Schema({
    friendImage: {
        type: String
    },
    friendId: {
        type: String
    },
    friendName: {
        type: String
    },
    news: {
        type: Boolean
    },
    conversations: [convs]
})

//---------------------------------------- Notification -----------------------------------

const invit = new mongoose.Schema({
    from: {
        type: String
    },
    username: {
        type: String
    },
    inviterImage: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
})


 const news = new mongoose.Schema({
    username: {
        type: String
    },
    msg: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
 })

 //-------------------------------------------- Request sent ------------------------------------------
const sent = new mongoose.Schema({
    username: {
        type: String
    },
    userId: {
        type: String
    }
})

// ---------------------------------------- Root Schema -----------------------------------

const myUser = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userImage: {
        type: String
    },
    accountDate: {
        type: String,
        default: Date.now
    },

    userFriends: [userFriends],

    newInvitations: [invit],
    notifs: [news],
    
    requestIsSent: [sent],

    conversationFriends: [{id: {type: String}}],

    birthday: { type: String },
    gender: { type: String },


    contact: {
		phone : {type: String},
		address : {type: String},
		email : {type: String},
		site : {type: String}
	},
	places: {
		currentCity : {type: String},
		hometown : {type: String}
	},
	aboutMe : {type: String},

    isActivated: { type: Boolean }
})





const User = mongoose.model('User', myUser)

module.exports = User;
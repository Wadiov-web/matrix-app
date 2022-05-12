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

//------------------------------ GET ABOUT ME ----------------------------------------
router.get('/api/get-visited-aboutMe/:id', isAuth, (req, res) => {
    User.findOne({_id: req.params.id})
    .then(visited => {
        if (visited.aboutMe !== undefined) {
            res.status(200).json({aboutMe: visited.aboutMe})
        } else {
            res.status(200).json({aboutMe: ''})
        }
    }).catch(err => console.log(err)) 
})

//------------------------------ GET INFOS ----------------------------------------
router.get('/api/get-visited-infos/:id', isAuth, (req, res) => {
    User.findOne({_id: req.params.id})
    .then(visited => {
        let contact = {phone: '', address: '', email: '', site: ''}
        let places = {currentCity: '', hometown: ''}
        let basics = {
            birthday: visited.birthday,
            gender: visited.gender, 
        }
        if(visited.contact == undefined && visited.places == undefined) {
            res.status(200).json({basics, contact, places})
        } else {
            res.status(200).json({basics, contact: visited.contact, places: visited.places})
        }
    }).catch(err => console.log(err))
})

module.exports = router
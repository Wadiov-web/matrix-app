const express = require('express')
const router = express.Router()
const User = require('../model/user')


//------------------------------ GET ABOUT ME ----------------------------------------
router.get('/api/get-visited-aboutMe/:id', (req, res) => {
    
    console.log('req.params.id')
    console.log(req.params.id)

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
router.get('/api/get-visited-infos/:id', (req, res) => {
    
    
    console.log('req.params.id')
    console.log(req.params.id)

    User.findOne({_id: req.params.id})
    .then(visited => {
        
        let contact = {phone: '', address: '', email: '', site: ''}
        let places = {currentCity: '', hometown: ''}

        let basics = {
            birthday: visited.birthday,
            gender: visited.gender, 
        }

        if(visited.contact == undefined && visited.places == undefined) {
            console.log('both null')
            res.status(200).json({basics, contact, places})
        } else {
            res.status(200).json({basics, contact: visited.contact, places: visited.places})
        }
        
    }).catch(err => console.log(err))
})

module.exports = router
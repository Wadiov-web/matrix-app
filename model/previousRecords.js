const mongoose = require('mongoose');




const previousRecords = new mongoose.Schema({
   email: {
       type: String
   }
})



const PreviousRecords = mongoose.model('previousRecords', previousRecords)

module.exports = PreviousRecords
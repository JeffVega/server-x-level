const mongoose = require('mongoose')
const moment = require('moment')

const foodSchema = new mongoose.Schema({
  food:{type:String, required:true,},
  calories:{type:String, required:true},
  create: {type: String,  default: moment((Date.now())).format('hh:mmA MM/DD/YY')},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})


  foodSchema.set('toObject',{
    transform: function(doc,ret){
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;

    }
  })
  module.exports = mongoose.model('Food',foodSchema)
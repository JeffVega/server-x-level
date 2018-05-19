const mongoose = require('mongoose')


const foodSchema = new mongoose.Schema({
  food:{type:String, required:true,},
  calories:{type:String, required:true},
  create: {type: Date, default: Date.getDate()},
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
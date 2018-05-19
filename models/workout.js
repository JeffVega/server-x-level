
const mongoose = require('mongoose')
const moment = require('moment')
const workoutSchema = new mongoose.Schema({
  title:{type:String, required:true},
  muscle:{type:String, required:true},
  weight:{type:String,required:true},
  content:{type:String},
  create: {type: String,  default: moment((Date.now())).format(' MM/DD/YY hh:mmA')},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }

})

workoutSchema.set('toObject',{
  transform:function (doc,ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    }
})


module.exports = mongoose.model('Workout',workoutSchema)
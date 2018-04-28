
const mongoose = require('mongoose')

const workoutSchema = new mongoose.Schema({
  title:{type:String, required:true},
  muscle:{type:String, required:true},
  weight:{type:Number,required:true},
  content:{type:String},
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
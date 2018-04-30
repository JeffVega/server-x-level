const mongoose = require('mongoose')

const calculatorSchema = new mongoose.Schema({
  feet:{type:Number, required:true},
  inches:{type:Number, required:true},
  weight:{type:Number, required:true},
  age:{type:Number, required:true},
  sex:{type:String, required:true},
  level:{type:Number, required:true},
  percent:{type:Number, required:true},
  calories:{type:Number},
  protein:{type:Number},
  fat:{type:Number},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  create:{type:Date, default:Date.now}
})

    calculatorSchema.set('toObject',{
      transform:function(doc,ret){
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    })

    module.exports = mongoose.model('Calculator',calculatorSchema)
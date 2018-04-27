const mongoose = require('mongoose');


const marcosSchema = new mongoose.Schema({
  calories:{type:Number},
  protein:{type:Number},
  fat:{type:Number}
})



  marcosSchema.set('toObject',{
    transform:function(doc,ret){
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }


  })
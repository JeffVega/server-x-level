

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Cal = require('../models/calculator')




router.get('/cal',(req,res,next)=>{
  const userId = req.user.id;
  let filter = {userId}
  Cal.find(filter)
  .sort('created')
  .then(results => {
    res.json(results)
  })
  .catch(err => {
    next(err)
  })
});




router.post('/cal', (req, res, next) => {
  const userId =req.user.id;
  


  // const {
  //   feet,
  //   inches,
  //   weight,
  //   age,
  //   sex,
  //   level,
  //   percent  
  // } = req.body;

const newWeight = {
  feet:parseInt(req.body.feet),
  inches:parseInt(req.body.inches),
  weight:parseInt(req.body.weight),
  age:parseInt(req.body.age),
  sex:req.body.sex,
  level:parseInt(req.body.level),
  percent:parseInt(req.body.percent),
  userId:req.user.id
}

const calories = calWeightLost(newWeight.feet,newWeight.inches,newWeight.weight,newWeight.age,newWeight.sex,newWeight.level,newWeight.percent)
const protein = calProteinToWeight(newWeight.weight)
const fat = calFatToCalories(calories)
// res.json({
//   calories,
//   protein,
//   fat
// })
const newWeight2 = {
  ...newWeight,
  calories,
  protein,
  fat
}
Cal.create(newWeight2)
    .then(result => {
      res.status(201).json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('That Cal already exists');
        err.status = 400;
      }
      next(err);
    });
});

function calHeightToCm(feet, inches) {
  // ABV = (og – fg) * 131.25
  let cm = (feet * 12) + inches;
  let newCm = cm * 2.54
  return Math.round(newCm)
}

function calPoundsToKg(weight) {
  let kg = weight * 0.45359237;
  return Math.round(kg)

}
console.log(calPoundsToKg(200))

function activityLevel(level) {
  if (level === 1) {
    return 1.2
  }
  if (level === 2) {
    return 1.375
  }
  if (level === 3) {
    return 1.55
  }
  if (level === 4) {
    return 1.725
  }

}

function percentOfWeightLose(percent) {
  if (percent === 1) {
    return 0.10
  }
  if (percent === 2) {
    return 0.20
  }
}

function calWeightLost(feet,inches,weight,age,sex,level,percent){
  let height2 = calHeightToCm(feet,inches)
  let weight2 = calPoundsToKg(weight)
  let level2 = activityLevel(level)
  let percent2 = percentOfWeightLose(percent)
  if(sex === "male"){
  let weight3 =  10 * weight2 + 6.25 * height2 - 5 * age +5
  let weight4 = weight3 * level2
  let weight5 = weight4 - (weight4 * percent2)
  let finalWeight = Math.round(weight5)
  return finalWeight;
   
  }
  if(sex === "female"){
  let weight3 = 10 * weight + 6.25 * height2 - 5 * age - 161  
  let weight4 = weight3 * level2
  let weight5 = weight4 - (weight4 * percent2)
  let finalWeight = Math.round(weight5)
  return finalWeight;
  }
}
  function calProteinToWeight(weight){
    console.log("this is weight",weight)
    let proteinOutput = weight * 0.825
    console.log("this is next weight",proteinOutput)
    let finalProtein = Math.round(proteinOutput)
    return finalProtein
  }
  function calFatToCalories(calories){
    console.log("this is calories",calories)
    calories2 = calories * 0.25 / 9 
    let finalCalories = Math.round(calories2)
    return finalCalories
  }

module.exports = router
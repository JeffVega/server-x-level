const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Cal = require('../models/calculator')

router.post('/calculator', (req, res, next) => {

  const {
    feet,
    inches,
    weight,
    age,
    sex,
    level,
    percent
  } = req.body;

const newWeight = {
  feet,
  inches,
  weight,
  age,
  sex,
  level,
  percent
}

const calories = calWeightLost(feet,inches,weight,age,sex,level,percent)
const protein = calProteinToWeight(weight)
const fat = calFatToCalories(calories)

res.json({
  calories,
  protein,
  fat
})
.catch(err => {
  return  next(err);
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
  let weight3 = 10 * weight + 6.25 * height - 5 * age - 161  
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
const mongoose = require('mongoose')


const {DATABASE_URL} = require('../config')
const Food = require('../models/food')
const User = require('../models/user')
const Work = require('../models/workout')
const seedUser = require('../db/seed/users')
const seedFood = require('../db/seed/foods')
const seedWorkout= require('../db/seed/workouts')
mongoose.connect(DATABASE_URL)
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() => {
    return Promise.all([
      Food.insertMany(seedFood),
      User.insertMany(seedUser),
      Work.insertMany(seedWorkout)
    ]);
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });
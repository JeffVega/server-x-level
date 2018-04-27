const mongoose = require('mongoose')


const {DATABASE_URL} = require('../config')
const Food = require('../models/food')
const User = require('../models/user')
const seedUser = require('../db/seed/users')
const seedFood = require('../db/seed/foods')
mongoose.connect(DATABASE_URL)
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() => {
    return Promise.all([
      Food.insertMany(seedFood),
      User.insertMany(seedUser)
    ]);
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });
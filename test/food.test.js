'use strict';
const app = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const {
  TEST_MONGODB_URI,
  JWT_SECRET
} = require('../config');

const Food = require('../models/food');
const User = require('../models/user')
const seedFood = require('../db/seed/foods');
const seedUsers = require('../db/seed/users')

const expect = chai.expect;
chai.use(chaiHttp);

describe.only('X-level  - Food', function () {
  let user;
  let token;

  
  before(function () {
    return mongoose.connect(TEST_MONGODB_URI)
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function () {
    return Promise.all([
      User.insertMany(seedUsers),
      Food.insertMany(seedFood),
      Food.ensureIndexes()
    ]).then(([users]) => {

      user = users[0];
      token = jwt.sign({
        user
      }, JWT_SECRET, {
        subject: user.username
      })
    });
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });
  it.only('should return the correct number of folders', function () {
    const dbPromise = Food.find({
      userId: user.id
    });
    const apiPromise = chai.request(app)
      .get('/api/food')
      .set('Authorization', `Bearer ${token}`);
    return Promise.all([dbPromise, apiPromise])
      .then(([data, res]) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(data.length);
      });
  });

});
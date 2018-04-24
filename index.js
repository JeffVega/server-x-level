'use strict';
const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport')
const { PORT, CLIENT_ORIGIN,JWT_SECRET} = require('./config');
console.log("here",JWT_SECRET)
const { dbConnect } = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');
const localStrategy = require('./passport/local')
const jwtStrategy = require('./passport/jwt')
const userRouter = require('./routes/users');
const app = express();

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);
//CConfigure passport
passport.use(localStrategy);
passport.use(jwtStrategy);
//Mount Router 
app.use('/api',userRouter);

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };

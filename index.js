'use strict';
const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport')
const { PORT, CLIENT_ORIGIN,JWT_SECRET} = require('./config');
const { dbConnect } = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');
const localStrategy = require('./passport/local')
const jwtStrategy = require('./passport/jwt')
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth')
const foodRouter = require('./routes/food')
const calRouter = require('./routes/calculator')
const workRouter = require('./routes/workout')
const app = express();

app.use(express.json());
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
app.use('/api',authRouter);
app.use(passport.authenticate('jwt', { session: false, failWithError: true }));
app.use('/api',foodRouter);
app.use('/api',calRouter)
app.use('/api',workRouter)

// Catch-all 404
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Catch-all Error handler
// Add NODE_ENV check to prevent stacktrace leak
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: app.get('env') === 'development' ? err : {}
  });
});


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

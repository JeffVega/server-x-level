

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Work = require('../models/workout')

/* ========== GET/READ ALL ITEMS ========== */
router.get('/workout',(req,res,next) => {
  const userId = req.user.id;

  let filter = {userId}
  // const userId = req.user.id;

  Work.find(filter)
  .sort('created')
  .then(results => {
    res.json(results)
  })
  .catch(err => {
    next(err)
  })
});
/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/workout/:id', (req, res, next) => {
  const { id } = req.params;
  const userId =req.user.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Work.findOne({_id:id,userId})
    .populate('created')
    .then(result => {
      if (result) {
     return   res.json(result);
      } else {
      return  next();
      }
    })
    .catch(err => {
     return  next(err);
    });
});
router.post('/workout', (req, res, next) => {
  const { title,muscle,weight } = req.body;
  const userId =req.user.id;
  const newWork = { title,muscle,weight,userId };
  /***** Never trust users - validate input *****/
  if (!Work) {
    const err = new Error('Missing `Work` in request body');
    err.status = 400;
    return next(err);
  }

  Work.create(newWork)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('That Work already exists');
        err.status = 400;
      }
      next(err);
    });
});


/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/workout/:id', (req, res, next) => {
  const { id } = req.params;
  const { Work } = req.body; 
  const userId = req.user.id;
  const updateWork = {Work,userId};
   // name ,userId 
  // const userId = req.user.id;
  /***** Never trust users - validate input *****/
  if (!Work) {
    const err = new Error('Missing `Work` in request body');
    err.status = 400;
    return next(err);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

 

  Work.findByIdAndUpdate(id, updateWork,{ new: true })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The Work  already exists');
        err.status = 400;
      }
      next(err);
    });
});
router.delete('/workout/:id', (req, res, next) => {
  const { id } = req.params;

  Work.findByIdAndRemove(id)
    .then(() => {
     return res.status(204).end();
    })
    .catch(err => {
     return next(err);
    });
});

module.exports = router;
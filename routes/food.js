

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Food = require('../models/food')
/* ========== GET/READ ALL ITEMS ========== */
router.get('/food',(req,res,next) => {
  const userId = req.user.id;
  let filter = {userId}
  Food.find(filter)
  .sort('created')
  .then(results => {
    res.json(results)
  })
  .catch(err => {
    next(err)
  })
});
/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/food/:id', (req, res, next) => {
  const { id } = req.params;
  const userId =req.user.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Food.findOne({_id:id,userId})
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
router.post('/food', (req, res, next) => {
  const { food } = req.body;
  const userId =req.user.id;
  const newFood = { food,userId};

  /***** Never trust users - validate input *****/
  if (!food) {
    const err = new Error('Missing `food` in request body');
    err.status = 400;
    return next(err);
  }

  Food.create(newFood)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('That Food already exists');
        err.status = 400;
      }
      next(err);
    });
});


/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/food/:id', (req, res, next) => {
  const { id } = req.params;
  const { food } = req.body; 
 // name ,userId 
  const userId = req.user.id; 
   const updateFood = {food,userId};
  /***** Never trust users - validate input *****/
  if (!food) {
    const err = new Error('Missing `food` in request body');
    err.status = 400;
    return next(err);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

 

  Food.findByIdAndUpdate(id, updateFood,{ new: true })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The food  already exists');
        err.status = 400;
      }
      next(err);
    });
});
router.delete('/food/:id', (req, res, next) => {
  const { id } = req.params;

  Food.findByIdAndRemove(id)
    .then(() => {
     return res.status(204).end();
    })
    .catch(err => {
     return next(err);
    });
});

module.exports = router;
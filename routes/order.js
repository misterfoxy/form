const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

router.get('/LSTEE', function(req, res){
  res.render('LSTEE');
});

router.get('/SSTEE', function(req, res){
  res.render('SSTEE');
});

router.get('/SNAPBACK', function(req, res){
  res.render('SNAPBACK');
});

router.get('/TRUCKER', function(req, res){
  res.render('TRUCKER');
});

router.get('/REVIVAL', function(req, res){
  res.render('REVIVAL');
});

router.get('/LSTEE/select', function(req,res){
  res.render('SELECT');
});



module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

router.get('/LSTEE', function(req, res){
  res.render('LSTEE');
});
module.exports = router;

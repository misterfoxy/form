const express = require('express');
const router = express.Router();
const session = require('express-session');

router.get('/', function(req, res){
  res.render('index');
});

router.get('/order', function(req,res){
  res.render('order');
})

module.exports = router;

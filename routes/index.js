var express = require('express');
var router = express.Router();

require('dotenv').config(); //read .env file

/* GET home page. */
router.get('/', function(req, res, next) {
  //console.log('secret ket: ', require('crypto').randomBytes(256).toString('hex')); --> create secret ket token
  res.render('index', { title: 'Express', secret: process.env.TOKEN_SECRET });
});

module.exports = router;

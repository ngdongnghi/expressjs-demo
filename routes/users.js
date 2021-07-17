var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var passport = require('passport');

var auth = require('../middlewares/authenticate');
var Users = require('../models/user');
const { route } = require('.');

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  Users.register(new Users({ username: req.body.username }), req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('ContentType', 'application/json');
      res.json({err: err});
    }
    else {
      if(req.body.firstname) 
        user.firstname = req.body.firstname;
      if(req.body.lastname)
        user.lastname = req.body.lastname;
      user.save((err, user) => {
        if(err) {
          res.statusCode = 500;
          res.setHeader('ContentType', 'application/json');
          res.json({err: err});
          return;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('ContentType', 'application/json');
          res.json({ success: true, status: 'Registration Successful!'});
        });
      });
    }
  });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if(err) {
      return next(err);
    }
    if(!user) {
      res.statusCode = 401;
      res.setHeader('ContentType', 'application/json');
      res.json({ success: false, status: 'Login Unsuccessful', err: info });
    }
    req.logIn(user, (err) => {
      if(err) {
        res.statusCode = 401;
        res.setHeader('ContentType', 'application/json');
        res.json({ success: false, status: 'Login Unsuccessful!', err: info });
      }
      var token = auth.getToken({ _id: req.user._id });
      res.statusCode = 200;
      res.setHeader('ContentType', 'application/json');
      res.json({ success: true, token: token });
    });
  }) (req, res, next);
});

router.get('/checkJWTtoken', (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if(err) {
      return next(err);
    }
    if(!user) {
      res.statusCode = 401;
      res.setHeader('ContentType', 'application/json');
      res.json({ success: false, status: 'JWT invalid', err: info });
    }
    else {
      res.statusCode = 200;
      res.setHeader('ContentType', 'application/json');
      res.json({ success: true, status: 'JWT valid', user: user});
    }
  }) (req, res);
});

router.get('/logout', (req, res, next) => {
  if(req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = router;

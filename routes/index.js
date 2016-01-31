var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Koynas', user: req.user, message: req.flash('success') });
});

router.get('/login', function(req, res) {
  res.render('login', { message: req.flash('error') });
});

router.post('/login',
  passport.authenticate('local', {failureRedirect: '/login',
                                  successRedirect: '/',
                                  successFlash: true,
                                  failureFlash: true })
);

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;

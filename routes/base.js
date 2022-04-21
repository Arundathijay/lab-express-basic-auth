const express = require('express');
const User = require('./../models/user');
const bcryptjs = require('bcryptjs');
const router = new express.Router();
const routeGuard = require('./../middleware/route-guard');

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  let user;
  const { username, password } = req.body;

  User.findOne({ username })
    .then((check) => {
      if (!check) {
        throw new Error('there is no user');
      } else {
        user = check;
        return bcryptjs.compare(password, user.passwordHashAndSalt);
      }
    })
    .then((compare) => {
      if (compare) {
        req.session.userId = user._id;
        res.redirect('/private');
      } else {
        throw new Error('Wrong password or username');
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  bcryptjs
    .hash(password, 10)
    .then((passwordHashAndSalt) => {
      return User.create({
        username,
        passwordHashAndSalt
      });
    })
    .then((user) => {
      req.session.userId = user._id;
      res.redirect('/private');
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/private', (req, res) => {
  res.render('private');
});

router.get('/profile', (req, res) => {
  res.render('profile');
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;

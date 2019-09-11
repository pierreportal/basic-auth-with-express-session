const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt')

router.get('/login', (req, res) => {
  if (req.session.currentUser) return res.redirect('/private');
  res.render('../views/login')
});

router.get('/signup', (req, res) => {
  if (req.session.currentUser) return res.redirect('/private');
  res.render('../views/signup')
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/auth/login'));
});


// POST

router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.render('../views/signup', { message: "Both fields are required!" });
  User.findOne({ username }).then(match => {
    if (match) return res.render('../views/signup', { message: "Username not available." });
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    User.create({ username, password: hash }).then(newUser => {
      req.session.currentUser = newUser;
      res.redirect('/private')
    })
  }).catch(err => {
    console.log(err);
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.render('../views/login', { message: "Both fields are required!" });
  User.findOne({ username }).then(match => {
    if (!match) return res.render('../views/login', { message: "Invalid credentials" });
    const matchPasswords = bcrypt.compareSync(password, match.password)
    if (!matchPasswords) return res.render('../views/login', { message: "Invalid credentials" });
    req.session.currentUser = match;
    res.redirect('/private')
  }).catch(err => {
    console.log(err);
  });
});

module.exports = router; 
const express = require('express');
const router = express.Router();


const logCheck = () => {
  return (req, res, next) => {
    req.session.currentUser ? next() : res.redirect('/auth/login')
  }
}


router.get('/', logCheck(), (req, res) => {
  res.render('../views/private/perso', { user: req.session.currentUser })
});

module.exports = router


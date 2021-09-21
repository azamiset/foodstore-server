// (1) import package yang diperlukan
const router = require('express').Router();
const multer = require('multer');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// (2) import auth/controller.js
const controller = require('./controller');

passport.use(new LocalStrategy({ usernameField: 'email' }, controller.localStrategy));


// (3.1) router untuk endpoint register pada Auth
router.post('/register', multer().none(), controller.register);

// (3.2) router untuk endpoint login pada Auth
router.post('/login', multer().none(), controller.login);

// (3.3) router untuk endpoint logout pada Auth
router.post('/logut', multer().none(), controller.logout);

// (4) export router
module.exports = router;
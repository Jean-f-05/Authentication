const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require("../controllers/users")
const {isLoggedIn, validateSignUp} = require("../utils/middleware");

router.route('/register')
    .get(userController.registerPage)
    .post(validateSignUp, userController.register)

router.route('/login')
    .get(userController.loginPage)
    .post(passport.authenticate('local', {failureFlash:true, failureRedirect:"/"} ),userController.login)


router.get('/mainPage',isLoggedIn, userController.mainPage)

router.get('/logout', userController.logout)

router.get('/activation/:userID/:token', userController.activation)

module.exports = router;
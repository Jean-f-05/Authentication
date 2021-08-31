const express = require('express');
const router = express.Router();
const {isLoggedIn, validateResetPassword, validateForgotPassword, validateUnkownPassword} = require("../utils/middleware");
const resetController = require("../controllers/reset")
const Token = require("../models/token")
const sendEmail = require("../utils/nodemailer")


router.get('/resetPage', isLoggedIn, resetController.renderReset)

router.post('/reset',isLoggedIn, validateResetPassword, resetController.resetUser)

router.get('/forgotPassword', resetController.forgotPassword)

router.post('/resetpassword', validateForgotPassword, resetController.resetPassword)

router.route('/:userID/:token')
    .get(resetController.renderResetPassword)    
    .post(validateUnkownPassword,resetController.ResetPassword)

module.exports = router;
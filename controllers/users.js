const User = require('../models/users');
const newError = require('../utils/newError');
const sendEmail = require('../utils/nodemailer')
const Token = require("../models/token");
const crypto = require('crypto');


module.exports.loginPage=(req,res)=>{
  res.render("login")
}

module.exports.login = (req, res) =>{
 if(!req.body.checkbox)
  req.session.cookie.expires=false;
  req.flash('success', `Welcome back ${req.session.passport.user}`)
  res.redirect("/index/mainPage")
}

module.exports.mainPage = (req,res)=>{
  res.render("mainPage")

}

module.exports.logout = (req,res)=>{
  req.logout();
  res.redirect("/")
}



//REGISTER CONTROLLER
module.exports.registerPage = (req,res)=>{
  res.render('register')
}
module.exports.register = async(req,res)=>{
  const {username,password,email} = req.body;   
  const emailCheck = await User.findOne({email:email})
  try {  
  
  if(emailCheck)
      throw new newError(email + ' is already registered',400)
    

    const user = new User({email, username, active: false});
    await User.register(user,password);
    
    token = await new Token ({
      userID : user._id,
      token : crypto.randomBytes(32).toString('hex')      
    }).save();

    const link = `${process.env.ACTIVATION_URL}/${user._id}/${token.token}` 
    await sendEmail(email, "Account registration & activation link", link);

    req.flash('success', 'REGISTRATION SUCCESSFUL! Please check your email...');
    res.redirect("/");

  } catch (error) {
      req.flash('error', `${error.message}`);
      res.redirect('/');
  }
};

module.exports.activation = async(req,res)=>{
try{
  const user = await User.findById(req.params.userID);
    if(!user) throw new newError("Invalid request or link",400)


  const token = await Token.findOne({userID : user._id});
    if(!token) throw new newError("Invalid request or link",400)

  user.active= true;
  await user.save();
  await token.delete();

  req.flash('success', 'Account activated! You can now login')
  res.redirect('/')

}catch(error){
  req.flash('error', `${error}`)
  res.redirect('/')
}
}





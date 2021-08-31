const User = require("../models/users");
const Token = require("../models/token");
const newError = require("../utils/newError");
const crypto = require('crypto');
const sendEmail = require("../utils/nodemailer");

module.exports.renderReset = (req,res)=>{
    res.render('resetPage');
  }
  
module.exports.resetUser = async(req,res)=>{
  try {
    const {username=req.user.username,old_password,password} = req.body;   
    const user = await User.findByUsername(username) 
    await user.changePassword(old_password,password)
    user.save()
    req.flash('success',' Password Updated!')
    res.redirect("/")
    } catch (error) {
    req.flash('error', `${error}`)
    res.redirect("/resetPage")  
    }
  }
  
module.exports.forgotPassword= async(req,res)=>{
  res.render('forgotPage')
}

module.exports.resetPassword = async(req,res)=>{
  try {
    const user = await User.findOne({email: req.body.email})
    if (!user){
      req.flash("error", `${req.body.email} not found!`);
      res.redirect("/index/password-reset/forgotPassword");   
    }
    

    let token = await Token.findOne({userID : user._id});
      if(!token){
        token = await new Token ({
          userID : user._id,
          token : crypto.randomBytes(32).toString('hex')      
        }).save();
      }

      const link = `${process.env.BASE_URL}/${user._id}/${token.token}`;
      await sendEmail(user.email,"Password Reset", link);
      req.flash("success","Email sent, check your mailbox")
      res.redirect("/")
 

  } catch (error) {
    req.flash("error", `${error}`)
}
}
  
module.exports.renderResetPassword = (req,res)=>{
  const data = req.params;
  res.render('resetForgotPage',{data})
}


module.exports.ResetPassword = async(req,res)=>{
  try {
    const user = await User.findById(req.params.userID);
      if (!user) throw newError("invalid or expired link", 400);


      const token = await Token.findOne({
        userID:user._id,
        token:req.params.token
      });
    if(!token) throw newError("invalid or expired link", 400);
    
    const {password} = req.body
      await user.setPassword(password)
      await user.save();
      await token.delete();
      req.flash("success","Password updated!")
      res.redirect("/")


  } catch (error) {
    req.flash("error", `${error}`)
    res.redirect("/")
  }
}









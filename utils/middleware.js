const {
  signUpSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
  resetUnkownPasswordSchema
      } = require("../utils/joySchemas");



module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
      res.redirect("/")
    }else{
      next()
    }
}


module.exports.validateSignUp = (req,res,next)=>{
  const {error} = signUpSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el=>el.message).join(",");
    req.flash('error', `${msg}`)
    res.redirect("/")
  }else{
    next()
  }
}

module.exports.validateResetPassword = (req,res,next)=>{
  const {error} = resetPasswordSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el=>el.message).join(",");
    req.flash('error', `${msg}`)
    res.redirect("/index/password-reset/resetPage")
  }else{
    next()
  }
}

module.exports.validateForgotPassword = (req,res,next)=>{
  const {error} = forgotPasswordSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el=>el.message).join(",");
    req.flash('error', `${msg}`)
    res.redirect("/index/password-reset/forgotPassword")
  }else{
      next()
    }
}


module.exports.validateUnkownPassword = (req,res,next)=>{
  const {error} = resetUnkownPasswordSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el=>el.message).join(",");
    req.flash('error', `${msg}`)
    res.redirect("/")
  }else{
      next()
    }
}





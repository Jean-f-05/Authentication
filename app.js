if(process.env.NODE_ENV !== "production"){
  require("dotenv").config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/users');
const passport = require('passport');
const LocalStrategy = require('passport-local')
const session = require('express-session');
const usersRoute = require("./routes/usersRoute");
const passResetRoute = require("./routes/passResetRoute");
const newError = require("./utils/newError")
const flash = require('connect-flash');




app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'pug')

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "Public")));

const dburl = process.env.dburl || 'mongodb://localhost:27017/authentication';
mongoose.connect(dburl, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
  });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MONGOOSE ERROR'));
db.once('open', () => {
  console.log("MONGOOSE CONNECTED!")
});

const sessionConfig = 
{
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  name:"HELLOswak",
  cookie:{
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24,
    maxAge:  1000* 60 * 60 * 24
  }}


app.use(session(sessionConfig))
app.use(flash());

app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// SESSION & PASSPORT 

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//ROUTES

app.get("/", (req,res)=>{
  res.render("index")
});

app.use("/index", usersRoute);
app.use("/index/password-reset", passResetRoute);
         

app.all("*", (req,res,next)=>{
  next(new newError('Page not found!',404))
});

app.use((error, req, res, next) => {
  const {statusCode = 500} = error;
  if(!error.message) err.message="Oh no,something went wrong!"
  req.flash('error', `${error.message}`);
  res.status(statusCode).redirect("/");
  // res.status(statusCode).send(err.message);
});
const port = process.env.PORT || 3000;

app.listen(port, (req,res)=>{
    console.log(`listening on port ${port}`)
});
//C:\Program Files\MongoDB\mongosh-2.2.10-win32-x64\bin
if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}

const dbUrl = process.env.ATLAS_DB_URL;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/user");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter: 24*3600
})

app.use(session({
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000, secure: false, httpOnly: true }
}));

const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");

mongoose.connect(dbUrl)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log("Connection error:", err));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

app.get("/", (req,res)=>{
    res.redirect("/listings");
})

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
})

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Something went wrong' } = err;
  res.status(statusCode).render("error.ejs", { err });
});

app.listen(8080, (req,res) => {
    console.log("server is listening");
})
const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const server = express();
const passport = require("./config/passportConfig");
const session = require("express-session");
const flash = require("connect-flash");
const isLoggedIn = require("./config/loginBlocker");
require("dotenv").config();
/*

*/

/*-- Connect to MongoDB */
mongoose.connect(
  process.env.MONGODBURL,
  {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false,
  },
  () => {
    console.log("MongoDB connected!");
  }
);

server.use(express.static("public")); //look for static files in public folder
server.use(express.urlencoded({ extended: true })); //collects form data
server.set("view engine", "ejs"); //view engine setup
server.use(expressLayouts); //Express EJS layout to make views into block



/*-- These must be place in the correct place */
server.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 360000 }
  })
);
//-- passport initialization
server.use(passport.initialize());
server.use(passport.session());
server.use(flash());

//set global variable for ejs files
server.use(function(request, response, next) {
  // before every route, attach the flash messages and current user to res.locals
  response.locals.alerts = request.flash();
  response.locals.currentUser = request.user;
  next();
});

//ROUTES
server.use("/auth", require("./routes/auth.route"));
server.use("/", isLoggedIn, require("./routes/user.route"));
// server.use("/", require("./routes/dashboard.route")); //Add isLoggedIn?

//CONNECT TO PORT
server.listen(process.env.PORT, () =>
  console.log(`connected to express on ${process.env.PORT}`)
);

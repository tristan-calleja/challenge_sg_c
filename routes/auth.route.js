const router = require("express").Router();
const User = require("../models/user.model");
const passport = require("../config/passportConfig");
// const isLoggedIn = require("../config/loginBlocker");

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res) => {
  try {
    let { firstname, lastname, dateOfBirth, address, phone, password, role, isSenior, isHelper } = req.body;

    let user = new User({
      firstname,
      lastname,
      dateOfBirth,
      address,
      phone,
      password,
      role,
      isSenior,
      isHelper,
    });
    console.log(user);

    if(role == "isSenior"){
      user.isSenior = true;
    }
    if(role == "isHelper"){
      user.isHelper = true;
    }
    let savedUser = await user.save();

    if (savedUser) {
      res.redirect("/home");//Shall we leave it to "/" as before instead?
    }
  } catch (error) {
    console.log(error);
  }
});

//-- Login Route

router.get("/signin", (req, res) => {
  res.render("auth/signin");
});

router.post(
  "/auth/signin",
  passport.authenticate("local", {
    successRedirect: "/home", //after login success
    failureRedirect: "/auth/signin", //if fail
    failureFlash: "Invalid Username or Password",
    successFlash: "You have logged In!"
  })
);

//--- Logout Route
router.get("/auth/logout", (request, response) => {
  request.logout(); //clear and break session
  request.flash("success", "Dont leave please come back!");
  response.redirect("/auth/signin");
});

module.exports = router;
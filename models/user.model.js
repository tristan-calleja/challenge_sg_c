const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

var userSchema = new mongoose.Schema({
  firstname: String,
    lastname: String,
    dateOfBirth: String,
    address: {
        houseNumber: Number,
        street: String,
        city : String,
        zipcode: String,
    },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  // role: {
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isSenior: {
    type: Boolean,
    default: false,
  },
  isHelper: {
    type: Boolean,
    default: false,
  },
// },
  lists: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "List",
  },
});

userSchema.pre("save", function(next) {
  var user = this;
  // Only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  //hash the password
  var hash = bcrypt.hashSync(user.password, 10);

  // Override the cleartext password with the hashed one
  user.password = hash;
  next();
});

userSchema.methods.validPassword = function(password) {
  // Compare is a bcrypt method that will return a boolean,
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;

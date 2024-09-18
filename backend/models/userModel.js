const mongoose = require("mongoose");
const bycrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

//static sign up method
userSchema.statics.signUp = async function (email, password) {
  //validate email
  if (!email || !password) {
    throw Error("Email and password are required");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email is not invalid");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error("Password is not strong enough");
  }

  const exist = await this.findOne({ email });
  if (exist) {
    throw new Error("Email already exists");
  }

  //bcrypt password is hashed
  const salt = await bycrypt.genSalt(10);
  const hash = await bycrypt.hash(password, salt);

  const user = await this.create({ email, password: hash });

  return user;
};

//static login method
userSchema.statics.login = async function (email, password) {
  //validate email and password
  if (!email || !password) {
    //throw error if email and password are not provided
    throw Error("Email and password are required");
  }
  if (!validator.isEmail(email)) {
    //throw error if email is not valid
    throw Error("Email is not invalid");
  }

  const user = await this.findOne({ email });
  //Can't find user? Throw error
  if (!user) {
    throw new Error("Email does not exist");
  }

  //compare password
  const match = await bycrypt.compare(password, user.password);

  //Password does not match? Throw error
  if (!match) {
    throw new Error("Password is incorrect");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);

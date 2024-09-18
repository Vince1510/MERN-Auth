const express = require("express");

//controller functions
const { signupUser, loginUser } = require("../controllers/userController");

const router = express.Router();

//Login route
router.post("/login", ("./login", loginUser));

//signup route
router.post("/signup", ("./signup", signupUser));
module.exports = router;

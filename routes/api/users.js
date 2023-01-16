const express = require("express");
const router = express.Router();
const {
  registerUser,
  getUsers,
  loginUser,
  logOut,
  getCurrentUser,
} = require("../../controllers/users");
const authMiddlewere = require("../../helpers/authMiddlewere");
const { validateUser } = require("../../helpers/validationsUserJoi");

router.get("/", getUsers);
router.post("/signup", validateUser, registerUser);
router.post("/login", loginUser);
router.post("/logout", authMiddlewere, logOut);
router.post("/getcurrentuser", authMiddlewere, getCurrentUser);

module.exports = router;

const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  registerUser,
  getUsers,
  loginUser,
  logOut,
  getCurrentUser,
  updateAvatar,
  verifyToken,
  verifyEmail,
} = require("../../controllers/users");
const authMiddlewere = require("../../helpers/authMiddlewere");
const { validateUser } = require("../../helpers/validationsUserJoi");

const upload = multer({ dest: "tmp/" });

router.get("/", getUsers);
router.post("/signup", validateUser, registerUser);
router.post("/login", loginUser);
router.post("/logout", authMiddlewere, logOut);
router.post("/getcurrentuser", authMiddlewere, getCurrentUser);
router.patch("/avatars", authMiddlewere, upload.single("avatar"), updateAvatar);
router.get("/verify/:verificationToken", verifyToken);
router.post("/verify", verifyEmail);
module.exports = router;

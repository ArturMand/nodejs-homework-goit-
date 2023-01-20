const express = require("express");
const { getStaticAvatar } = require("../../controllers/avatarController");
const router = express.Router();

// const authMiddlewere = require("../../helpers/authMiddlewere");
// const { validateUser } = require("../../helpers/validationsUserJoi");

router.get("/:reqAvatar", getStaticAvatar);

module.exports = router;

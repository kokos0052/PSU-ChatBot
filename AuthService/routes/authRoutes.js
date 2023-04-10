const express = require("express");
const { refreshToken, authUser, createUser } = require("../controllers/authController");


const router = express.Router();

router.route("/token").post(refreshToken)
router.route("/login").post(authUser)
router.route("/create").post(createUser)

module.exports = router;

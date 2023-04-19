const express = require("express");
const { appendPhrase } = require("../controllers/saveController");


const router = express.Router();

router.route("/create").post(appendPhrase);

module.exports = router;

const express = require("express");
const router = express.Router();

const LogController = require('../controllers').log;

router.post("/create", LogController.create);

module.exports = router;
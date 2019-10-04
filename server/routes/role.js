const express = require("express");
const router = express.Router();

const RoleController = require('../controllers').role;

router.post("/create", RoleController.create);

module.exports = router;
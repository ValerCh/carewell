const express = require("express");
const router = express.Router();

const AttendanceController = require('../controllers').attendance;
const AuthHelper = require('../helpers/auth');

const checkNurse = (req, res, next) => { AuthHelper.checkToken(req, res, next, ['nurse'])};
const checkFamily = (req, res, next) => { AuthHelper.checkToken(req, res, next, ['family'])};
const checkToken = (req, res, next) => { AuthHelper.checkToken(req, res, next, ['nurse', 'family'])};

router.post("/getToday", checkNurse, AttendanceController.getToday);
router.post("/getList", checkToken, AttendanceController.getList);

module.exports = router;
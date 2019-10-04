const express = require("express");
const router = express.Router();

const ScheduleController = require('../controllers').schedule;
const AuthHelper = require('../helpers/auth');

const checkToken = (req, res, next) => { AuthHelper.checkToken(req, res, next, ['nurse', 'family', 'admin'])};

router.post("/create", ScheduleController.create);
router.post("/getList", checkToken, ScheduleController.getList);
router.post("/getTodayList", checkToken, ScheduleController.getTodayList);

module.exports = router;
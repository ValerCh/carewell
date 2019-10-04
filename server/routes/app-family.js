const express = require("express");
const router = express.Router();

const AppFamilyController = require('../controllers').appFamily;
const AuthHelper = require('../helpers/auth');

const checkFamily = (req, res, next) => { AuthHelper.checkToken(req, res, next, ['family'])};

router.post("/getAttendanceListForHomepage", checkFamily, AppFamilyController.getAttendanceListForHomepage);
router.post("/getAttendanceListByDateRange", checkFamily, AppFamilyController.getAttendanceListByDateRange);
router.post("/getScheduleListForMonth", checkFamily, AppFamilyController.getScheduleListForMonth);
router.post("/approve", checkFamily, AppFamilyController.approve);
router.post("/disapprove", checkFamily, AppFamilyController.disapprove);
router.post("/getNurseList", checkFamily, AppFamilyController.getNurseList);
router.post("/getActivityForWeek", checkFamily, AppFamilyController.getActivityForWeek);
router.post("/approveActivity", checkFamily, AppFamilyController.approveActivity);
module.exports = router;
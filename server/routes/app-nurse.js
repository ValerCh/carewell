const express = require("express");
const router = express.Router();

const AppNurseController = require('../controllers').appNurse;
const AuthHelper = require('../helpers/auth');

const checkNurse = (req, res, next) => { AuthHelper.checkToken(req, res, next, ['nurse'])};

router.post("/getListHomepage", checkNurse, AppNurseController.getListHomepage);
router.post("/getAttendanceByScheduleId", checkNurse, AppNurseController.getAttendanceByScheduleId);
router.post("/getAttendanceListByDateRange", checkNurse, AppNurseController.getAttendanceListByDateRange);
router.post("/getScheduleListForMonth", checkNurse, AppNurseController.getScheduleListForMonth);
router.post("/clockIn", checkNurse, AppNurseController.clockIn);
router.post("/clockOut", checkNurse, AppNurseController.clockOut);
router.post("/cancelClockIn", checkNurse, AppNurseController.cancelClockIn);
router.post("/cancelClockOut", checkNurse, AppNurseController.cancelClockOut);
router.post("/getPatientList", checkNurse, AppNurseController.getPatientList);
router.post("/getActivityForWeek", checkNurse, AppNurseController.getActivityForWeek);
router.post("/set-activity", checkNurse, AppNurseController.setActivity);
router.post("/set-observation", checkNurse, AppNurseController.setObservation);
router.post("/set-additonal-comment", checkNurse, AppNurseController.setAdditionalComment);
router.post("/edit-additional-comment", checkNurse, AppNurseController.editAdditionalComment);
router.post("/delete-additional-comment", checkNurse, AppNurseController.deleteAdditionalComment);

module.exports = router;
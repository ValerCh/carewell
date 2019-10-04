const express = require("express");
const router = express.Router();

const PatientController = require('../controllers').patient;
const AuthHelper = require('../helpers/auth');

const checkNurse = (req, res, next) => { AuthHelper.checkToken(req, res, next, ['nurse'])};

router.post("/create", PatientController.create);
router.post("/getList", checkNurse, PatientController.getList);

module.exports = router;
const express = require("express");
const router = express.Router();

const FamilyController = require('../controllers').family;
const AuthHelper = require('../helpers/auth');

const checkFamily = (req, res, next) => { AuthHelper.checkToken(req, res, next, ['family'])};

router.post("/create", FamilyController.create);
router.post("/getFamilyByUserId", checkFamily, FamilyController.getFamilyByUserId);
router.post("/updateFamily", checkFamily, FamilyController.updateFamily);

module.exports = router;
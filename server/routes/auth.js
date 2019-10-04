const express = require("express");
const router = express.Router();

const AuthController = require('../controllers').auth;
const AuthHelper = require('../helpers/auth');

const checkToken = (req, res, next) => { AuthHelper.checkToken(req, res, next, ['family', 'nurse', 'patient', 'admin'])};

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", checkToken, AuthController.logout);

module.exports = router;
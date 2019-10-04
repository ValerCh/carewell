const express = require("express");
const router = express.Router();

const UserController = require('../controllers').user;
const AuthHelper = require('../helpers/auth');

const checkToken = (req, res, next) => { AuthHelper.checkToken(req, res, next, ['nurse', 'family'])};

router.post("/create", UserController.create);
router.post("/getUserById", checkToken, UserController.getUserById);
router.post("/updateUser", checkToken, UserController.updateUser);
router.post("/updatePassword", checkToken, UserController.updatePassword);

module.exports = router;
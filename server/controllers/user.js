const User = require('../models').User;
const Family = require('../models').Family;
const UserValidation = require('../validations/user');
const AuthHelper = require('../helpers/auth');

module.exports = {
    async create(req, res) {
        try {
            const {fields, logData} = req.body;

            let { errors, isValid } = UserValidation.validateCreateInput(fields);
            if (!isValid) {
                return res.json({ success: false, errors: errors });
            }
        
            let newUser = await User.create(fields);
            
            res.json({ success: true, user: newUser });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Create user error" } });
        }
    },

    async getUserById(req, res) {
        try {
            const {fields, logData} = req.body;
            const id = fields.id;
        
            let user = await User.findById(id);
            if (!user) {
                return res.json({ success: false, errors: { error: "User does not exist" } });
            }
            
            res.json({ success: true, user: user });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Create user error" } });
        }
    },

    async updateUser(req, res) {
        try {
            const {fields, logData} = req.body;
            console.log(fields)
        
            let user = await User.findById(fields.id);
            if (!user) {
                return res.json({ success: false, errors: { error: "User does not exist" } });
            }

            let result = await user.update(fields);
            
            res.json({ success: true, result: result });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Create user error" } });
        }
    },

    async updatePassword(req, res) {
        try {
            const {fields, logData} = req.body;
            console.log(fields)
        
            let user = await User.findById(fields.id);
            if (!user) {
                return res.json({ success: false, errors: { error: "User does not exist" } });
            }

            if (!AuthHelper.authenticateUser(user.password, fields.oldPassword)) {
                return res.json({ success: false, errors: { password: "Password incorrect" } });
            }

            let result = await user.update({password: AuthHelper.hashPassword(fields.newPassword)});
            
            res.json({ success: true, result: result });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Create user error" } });
        }
    }
};
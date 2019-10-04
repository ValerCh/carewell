const moment = require('moment');

const User = require('../models').User;
const Family = require('../models').Family;
const Role = require('../models').Role;
const Log = require('../models').Log;

const AuthValidation = require('../validations/auth');
const AuthHelper = require('../helpers/auth');

module.exports = {
    async register(req, res) {
        try {
            const {fields, logData} = req.body;
            // const fields = req.body;
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            // console.log(req.body);
            let { errors, isValid } = AuthValidation.validateRegisterInput(fields);
            if (!isValid) {
                return res.json({ success: false, errors: errors });
            }
        
            let user = await User.findOne({loginid: fields.username}, 'id');
            if (user) {
                return res.json({ success: false, errors: { loginid: "Username already exists" } });
            }
            
            let role = await Role.findById(fields.role_id);
            if (!role) {
                return res.json({ success: false, errors: { role_id: "Role id doese not exist" } });
            }
        
            let newUser = await User.create({
                ...fields,
                loginid: fields.username,
                password: AuthHelper.hashPassword(fields.password),
                currently_loggedin_from_ip: ip,
            });

            if (role.role_internal_name === 'family') {
                let newFamily = await Family.create({
                    user_id: newUser.id,
                    patient_id: fields.patient_id,
                    relationship_with_patient: fields.relationship_with_patient,
                    approving_authority: '0',
                    status: '0'
                });
                newUser.family_id = newFamily.id;
                await newUser.save();
            }
            
            res.json({ success: true, user: newUser });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Register Failed" } });
        }
    },
    async login(req, res) {
        try {
            const {fields, logData} = req.body;
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            var date = moment().format("MM/DD/YYYY HH:mm:ss");

            let { errors, isValid } = AuthValidation.validateLoginInput(fields);
            if (!isValid) {
              return res.json({ success: false, errors: errors });
            }
          
            let user = await User.findOne({loginid: fields.username})
                .populate({ path: 'role_id', select: ['role_internal_name', 'role_display_name'] })
                .populate({ path: 'family_id', select: ['patient_id'] });
            if (!user) {
                return res.json({ success: false, errors:  { username: "Username password combination is incorrect" } });
            }
          
            console.log(444);
            if (!AuthHelper.authenticateUser(user.password, fields.password)) {
                return res.json({ success: false, errors: { password: "Username password combination is incorrect" } });
            }

            console.log(555)
            let payload = {
                id: user.id,
                username: user.loginid,
                email: user.email,
                role: user.role_id.role_internal_name,
                first_name: user.first_name,
                last_name: user.last_name,
                org_id: user.org_id
            };
        
            if (user.role_id.role_internal_name === 'family') {
                payload = {
                    ...payload, 
                    patient_id: user.family_id.patient_id, 
                    family_id: user.family_id.id
                };
            }

            console.log(666)
            const {err, token} = await AuthHelper.generateToken(payload, 31556926);
            if (!token) {
                return res.json({ success: false, errors: { token: "Generate token failed" } });
            }

            console.log(777)
            await Log.create({ 
                action: 'login',
                ip: ip,
                date_time: date,
                user_id: user.id,
                username: user.loginid,
                lat: logData.location['lat'],
                long: logData.location['long'],
                device_id: logData.deviceId
            });

            console.log(888)
            res.json({ success: true, token: "Bearer " + token });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Login Failed" } });
        }
    },
    async logout(req, res) {
        try {
            const {logData} = req.body;
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            var date = moment().format("MM/DD/YYYY HH:mm:ss");

            await Log.create({
                action: 'logout',
                ip: ip,
                date_time: date,
                user_id: logData.user.id,
                username: logData.user.username,
                lat: logData.location['lat'],
                long: logData.location['long'],
                device_id: logData.deviceId
            });

            res.json({ success: true });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Logout Failed" } });
        }
    },
};
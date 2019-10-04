const moment = require('moment');

const Schedule = require('../models').Schedule;
const Attendance = require('../models').Attendance;
const ScheduleValidation = require('../validations/schedule');
const AuthHelper = require('../helpers/auth');

module.exports = {
    async create(req, res) {
        try {
            const {fields, logData} = req.body;
            // const fields = req.body;
            let currentUser = AuthHelper.currentUser(req, res);
            let { errors, isValid } = ScheduleValidation.validateCreateInput(fields);
            if (!isValid) {
                return res.json({ success: false, errors: errors });
            }
          
            let schedule = await Schedule.findOne(fields);
            if (schedule) {
                return res.json({ success: false, errors:  { duplicate: "Schedule already exists" } });
            }
            fields.org_id = currentUser.org_id;
            let newSchedule = await Schedule.create(fields);
            
            res.json({ success: true, schedule: newSchedule });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Create schedule error" } });
        }
    },

    async getList(req, res) {
        try {
            const {fields, logData} = req.body;
            
            let scheduleList = await Schedule.find(fields).populate({ 
                path: 'user_id', 
                select: ['first_name', 'last_name'] 
            }).populate({ 
                path: 'patient_id', 
                select: ['first_name', 'last_name', 'latitude', 'longitude'] 
            });
            if (!scheduleList) {
                return res.json({ success: false, errors:  { error: "DB error" } });
            }
            
            res.json({ success: true, scheduleList: scheduleList });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Get schedule list error" } });
        }
    },

    async getTodayList(req, res) {
        try {
            const {fields, logData} = req.body;

            var date = moment().format('MM/DD/YYYY');
            let scheduleList = await Schedule.find({...fields, date: date}).populate({ 
                path: 'user_id', 
                select: ['first_name', 'last_name'] 
            }).populate({ 
                path: 'patient_id', 
                select: ['first_name', 'last_name', 'latitude', 'longitude'] 
            });

            let attendanceList = await Attendance.find({...fields, date: date})
            
            res.json({ success: true, scheduleList: scheduleList, attendanceList: attendanceList });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Get schedule list error" } });
        }
    },
};
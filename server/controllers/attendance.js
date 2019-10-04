const moment = require('moment');

const Attendance = require('../models').Attendance;
const AttendanceValidation = require('../validations/attendance');

module.exports = {
    async getToday(req, res) {
        try {
            const {fields, logData} = req.body;

            var date = moment().format('MM/DD/YYYY');
            let attendance = await Attendance.findOne({...fields, date: date});
            
            res.json({ success: true, attendance: attendance });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Get today attendance error" } });
        }
    },
    async getList(req, res) {
        try {
            const {fields, logData} = req.body;

            let attendanceList = await Attendance.find(fields).populate({ 
                path: 'patient_id', 
                select: ['first_name', 'last_name'] 
            }).populate({ 
                path: 'user_id', 
                select: ['first_name', 'last_name'] 
            });
            if (!attendanceList) {
                return res.json({ success: false, errors:  { error: "DB error" } });
            }
            
            res.json({ success: true, attendanceList: attendanceList });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Get attendance list error" } });
        }
    },
};
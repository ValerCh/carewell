const moment = require('moment');

const Schedule = require('../models').Schedule;
const Attendance = require('../models').Attendance;
const Family = require('../models').Family;
const Patient = require('../models').Patient;
const User = require('../models').User;
const Role = require('../models').Role;
const Log = require('../models').Log;

module.exports = {
    async getAttendanceListForHomepage(req, res) {
        try {
            const {fields, logData} = req.body;

            let startDate = moment().endOf('day').subtract(7, 'days').toDate();
            let endDate = moment().endOf('day').toDate();
            let attendanceList = await Attendance.find({
                $and: [
                    {patient_id: fields.patient_id},
                    { $or: [
                        {status: 'Pending'},
                        {status: 'Not completed'},
                        { $and: [{status: "Approved"}, {clockin_time: {"$gte": startDate, "$lt": endDate}}] },
                        { $and: [{status: "Disapproved"}, {clockin_time: {"$gte": startDate, "$lt": endDate}}] }
                    ] }
                ]
            }).sort({clockin_time: 'desc'}).populate({ 
                path: 'patient_id', 
                select: ['first_name', 'last_name'] 
            }).populate({ 
                path: 'user_id', 
                select: ['first_name', 'last_name'] 
            });
            
            res.json({ success: true, attendanceList: attendanceList });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Get attendance list error" } });
        }
    },
    async getAttendanceListByDateRange(req, res) {
        try {
            const {fields, logData} = req.body;

            let startDate = moment(fields.startDate).startOf('day').toDate();
            let endDate = moment(fields.endDate).endOf('day').toDate();
            let attendanceList = await Attendance.find({
                patient_id: fields.patient_id,
                clockin_time: {"$gte": startDate, "$lt": endDate}
            }).sort({clockin_time: 'desc'}).populate({ 
                path: 'patient_id', 
                select: ['first_name', 'last_name'] 
            }).populate({ 
                path: 'user_id', 
                select: ['first_name', 'last_name'] 
            });
            
            res.json({ success: true, attendanceList: attendanceList });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Get attendance list error" } });
        }
    },

    async getScheduleListForMonth(req, res) {
        try {
            const {fields, logData} = req.body;
            
            let startDate = moment().startOf('day').toDate();
            let endDate = moment().add(30, 'days').endOf('day').toDate();
            let scheduleList = await Schedule.find({
                patient_id: fields.patient_id,
                date: {"$gte": startDate, "$lt": endDate}
            }).sort({date: 'asc'}).populate({ 
                path: 'user_id', 
                select: ['first_name', 'last_name'] 
            }).populate({ 
                path: 'patient_id', 
                select: ['first_name', 'last_name', 'latitude', 'longitude'] 
            });
            
            res.json({ success: true, scheduleList: scheduleList });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Get schedule list error" } });
        }
    },

    async approve(req, res) {
        try {
            const {fields, logData} = req.body;

            console.log(fields)
            let attendance = await Attendance.findById(fields.id);
            attendance.status = 'Approved';
            attendance.note = fields.note;
            attendance.save();

            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            var date = moment().format("MM/DD/YYYY HH:mm:ss");
            await Log.create({
                action: 'approve',
                ip: ip,
                date_time: date,
                user_id: logData.user.id,
                username: logData.user.username,
                lat: logData.location['lat'],
                long: logData.location['long'],
                device_id: logData.deviceId
            });
            
            res.json({ success: true, attendance: attendance });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Set attendance status error" } });
        }
    },
    async disapprove(req, res) {
        try {
            const {fields, logData} = req.body;

            console.log(fields)
            let attendance = await Attendance.findById(fields.id);
            attendance.status = 'Disapproved';
            attendance.note = fields.note;
            attendance.save();

            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            var date = moment().format("MM/DD/YYYY HH:mm:ss");
            await Log.create({
                action: 'approve',
                ip: ip,
                date_time: date,
                user_id: logData.user.id,
                username: logData.user.username,
                lat: logData.location['lat'],
                long: logData.location['long'],
                device_id: logData.deviceId
            });
            
            res.json({ success: true, attendance: attendance });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Set attendance status error" } });
        }
    },

    async getNurseList(req, res) {
        try {
            const {fields, logData} = req.body;

            let nurseList = await Attendance.find({
                patient_id: fields.patient_id
            }, '-_id user_id').populate({
                path: 'user_id',
                select: ['first_name', 'last_name']
            });
            nurseList = nurseList.filter((elem, index, self) => {
                return index === self.findIndex(elem1 => elem.user_id._id === elem1.user_id._id );
            }).map(user => user.user_id);
            
            
            let unapprovedActivityList = await ActivityReport.find({
                patient_id: fields.patient_id
            });

            unapprovedActivityList = unapprovedActivityList.filter((elem, index, self) => {
                return !!!elem.sign_status.status
            });

            res.json({ success: true, nurseList: nurseList, unsignedCount: unapprovedActivityList.length });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Get attendance list error" } });
        }
    },

    async getActivityForWeek(req, res) {
        try {
            const {fields, logData} = req.body;

            let startDate = fields.start_date.split('T')[0];
            let endDate = fields.end_date.split('T')[0];

            console.log(startDate, endDate);
            let attendanceList = await ActivityReport.findOne({
                user_id: fields.user_id,
                patient_id: fields.patient_id,
                start_date: startDate,
                end_date: endDate
            });

            let unapprovedActivityList = await ActivityReport.find({
                patient_id: fields.patient_id
            });

            unapprovedActivityList = unapprovedActivityList.filter((elem, index, self) => {
                return !!!elem.sign_status.status
            });
            
            res.json({ success: true, attendanceList: attendanceList, unsignedCount: unapprovedActivityList.length });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Get attendance list for week error" } });
        }
    },

    async approveActivity(req, res) {
        try {
            const {fields, logData} = req.body;

            let activity_id = fields.activity_id;
            let user_id = fields.user_id;
            console.log(user_id);
            let user = await User.findById(user_id);

            let activityReport = await ActivityReport.findById(activity_id);
            activityReport.sign_status = {
                status: true,
                date: new Date(),
                name: user.first_name + ' ' + user.last_name
            }

            await activityReport.save();
            
            let unapprovedActivityList = await ActivityReport.find({
                patient_id: user.patient_id
            });

            unapprovedActivityList = unapprovedActivityList.filter((elem, index, self) => {
                return !!!elem.sign_status.status
            });
            
            res.json({ success: true, sign_status: activityReport.sign_status, unsignedCount: unapprovedActivityList.length });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Get attendance list for week error" } });
        }
    }
};
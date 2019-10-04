const moment = require('moment');

const Schedule = require('../models').Schedule;
const Attendance = require('../models').Attendance;
const Family = require('../models').Family;
const Patient = require('../models').Patient;
const User = require('../models').User;
const Role = require('../models').Role;
const Log = require('../models').Log;
const Activity = require('../models').Activity;
const Observation = require('../models').Observation;
const AdditionalComment = require('../models').AdditionalComment;
const ActivityReport = require('../models').ActivityReport;
const AuthHelper = require('../helpers/auth');

const activityHeaders = [
    {
        id: 1,
        value: 'Complete /Partial Bath'
    }, {
        id: 2,
        value: 'Dress /Undress'
    }, {
        id: 3,
        value: 'Assist with Toileting'
    }, {
        id: 4,
        value: 'Transferring'
    }, {
        id: 5,
        value: 'Personal Grooming'
    }, {
        id: 6,
        value: 'Assist with Eating /Feeding'
    }, {
        id: 7,
        value: 'Ambulation'
    }, {
        id: 8,
        value: 'Turn /Change Position'
    }, {
        id: 9,
        value: 'Vital Signs'
    }, {
        id: 10,
        value: 'Assist with Self-Admin Medication'
    }, {
        id: 11,
        value: 'Bowel /Bladder'
    }, {
        id: 12,
        value: 'Wound Care'
    }, {
        id: 13,
        value: 'ROM'
    }, {
        id: 14,
        value: 'Supervision'
    }, {
        id: 15,
        value: 'Prepare Breakfast'
    }, {
        id: 16,
        value: 'Prepare Lunch'
    }, {
        id: 17,
        value: 'Prepare Dinner'
    }, {
        id: 18,
        value: 'Clean Kitchen /Wash Dishes'
    }, {
        id: 19,
        value: 'Make /Change Bed Linen'
    }, {
        id: 20,
        value: 'Clean Areas Used by Individual'
    }, {
        id: 21,
        value: 'Listing Supplies /Shopping'
    }, {
        id: 22,
        value: 'Individual’s Laundry'
    }, {
        id: 23,
        value: 'Medical Appointments'
    }, {
        id: 24,
        value: 'Work /School /Social'
    }, {
        id: 25,
        value: 'Other'
    }
];

const initActivityReportActivityJson = {
    'Complete /Partial Bath' : {
        status: false,
        comment: '',
        date: ''
    },
    'Dress /Undress': {
        status: false,
        comment: '',
        date: ''
    }, 
    'Assist with Toileting': {
        status: false,
        comment: '',
        date: ''
    }, 
    'Transferring': {
        status: false,
        comment: '',
        date: ''
    }, 
    'Personal Grooming': {
        status: false,
        comment: '',
        date: ''
    }, 
    'Assist with Eating /Feeding': {
        status: false,
        comment: '',
        date: ''
    }, 
    'Ambulation': {
        status: false,
        comment: '',
        date: ''
    }, 
    'Turn /Change Position': {
        status: false,
        comment: '',
        date: ''
    }, 
    'Vital Signs': {
        status: false,
        comment: '',
        date: ''
    }, 
    'Assist with Self-Admin Medication': {
        status: false,
        comment: '',
        date: ''
    }, 
    'Bowel /Bladder': {
        status: false,
        comment: '',
        date: ''
    }, 
    'Wound Care': {
        status: false,
        comment: '',
        date: ''
    }, 
    'ROM': {
        status: false,
        comment: '',
        date: ''
    }, 
    'Supervision': {
        status: false,
        comment: '',
        date: ''
    }, 
    'Prepare Breakfast': {
        status: false,
        comment: '',
        date: ''
    }, 
    'Prepare Lunch': {
        status: false,
        comment: '',
        date: ''
    }, 
    'Prepare Dinner': {
        status: false,
        comment: '',
        date: ''
    }, 
    'Clean Kitchen /Wash Dishes': {
        status: false,
        comment: '',
        date: ''
    }, 
    'Make /Change Bed Linen': {
        status: false,
        comment: '',
        date: ''
    }, 
    'Clean Areas Used by Individual': {
        status: false,
        comment: '',
        date: ''
    }, 
    'Listing Supplies /Shopping': {
        status: false,
        comment: '',
        date: ''
    }, 
    'Individual’s Laundry': {
        status: false,
        comment: '',
        date: ''
    }, 
    'Medical Appointments': {
        status: false,
        comment: '',
        date: ''
    }, 
    'Work /School /Social': {
        status: false,
        comment: '',
        date: ''
    }, 
    'Other': {
        status: false,
        comment: '',
        date: ''
    },
    check_in: '',
    check_out: '',
    hours: ''
};

const observationHeaders = [
    {
        id: 1, 
        value: '1. Did you observe any change in the individual’s physical condition?',
        status: false,
        comment: '',
        date: ''
    }, {
        id: 2,
        value: '2. Did you observe any change in the individual’s emotional condition?',
        status: false,
        comment: '',
        date: ''
    }, {
        id: 3,
        value: '3. Was there any change in the individual’s regular daily activities?',
        status: false,
        comment: '',
        date: ''
    }, {
        id: 4,
        value: '4. Do you have an observation about the individual’s response to services rendered?',
        status: false,
        comment: '',
        date: ''
    }
];

module.exports = {
    async getListHomepage(req, res) {
        try {
            const {fields, logData} = req.body;

            let attendance = await Attendance.findOne({
                user_id: fields.user_id, 
                status: 'Not completed'
            });

            let startDate = moment().startOf('day').toDate();
            let endDate = moment().endOf('day').toDate();
            let scheduleList = attendance ? await Schedule.find({
                $and: [
                    {user_id: fields.user_id},
                    { $or: [
                        {_id: attendance.schedule_id},
                        {date: {"$gte": startDate, "$lt": endDate}},
                    ] }
                ]
            }).populate({ 
                path: 'patient_id', 
                select: ['first_name', 'last_name', 'latitude', 'longitude'] 
            }) : await Schedule.find({
                user_id: fields.user_id, 
                date: {"$gte": startDate, "$lt": endDate}
            }).populate({ 
                path: 'patient_id', 
                select: ['first_name', 'last_name', 'latitude', 'longitude'] 
            });

            if(attendance) {
                attendance.activityList = [];
                attendance.observationList = [];
                attendance.additionalComment = [];

                for(let i=0; i<activityHeaders.length; i++) {
                    let activity = await Activity.findOne({
                        schedule_id: attendance.schedule_id, 
                        name: activityHeaders[i].value
                    });

                    if(!activity) {
                        activity = await Activity.create({
                            name: activityHeaders[i].value,
                            user_id: fields.user_id,
                            patient_id: attendance.patient_id,
                            schedule_id: attendance.schedule_id,
                            status: false,
                            comment: ""
                        });
                    }
                    attendance.activityList.push(activity);
                }

                var now = moment();
                var monday = now.clone().weekday(1).startOf('day').toDate();
                var sunday = now.clone().weekday(7).endOf('day').toDate();

                console.log(sunday, monday);
                for(let j=0; j<observationHeaders.length; j++) {
                    let observation = await Observation.findOne({
                        user_id: fields.user_id,
                        patient_id: attendance.patient_id,
                        name: observationHeaders[j].value,
                        update_date: {"$gte": monday, "$lt": sunday}
                    });
                    if(!observation) {
                        observation = await Observation.create({
                            name: observationHeaders[j].value,
                            user_id: fields.user_id,
                            patient_id: attendance.patient_id,
                            schedule_id: attendance.schedule_id,
                            status: false,
                            comment: ""
                        });
                    }
                    attendance.observationList.push(observation);
                }

                let additionalComments = await AdditionalComment.find({
                    user_id: fields.user_id,
                    patient_id: attendance.patient_id,
                    create_date: {"$gte": monday, "$lt": sunday}
                });

                // if(additionalComments.length) {
                //     for(let k=0; k<additionalComments.length; k++) {
                //         attendance.additionalComment += additionalComments[k].comment;
                //     }
                // }
                
                attendance.additionalComment = additionalComments;
            }
            res.json({ success: true, scheduleList: scheduleList, attendance: attendance });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Get schedule list error" } });
        }
    },

    async getAttendanceByScheduleId(req, res) {
        try {
            const {fields, logData} = req.body;

            let attendance = await Attendance.findOne({
                schedule_id: fields.schedule_id
            });
            
            if(attendance) {
                attendance.activityList = [];
                attendance.observationList = [];
                attendance.additionalComment = [];

                for(let i=0; i<activityHeaders.length; i++) {
                    let activity = await Activity.findOne({
                        schedule_id: attendance.schedule_id, 
                        name: activityHeaders[i].value
                    });

                    if(!activity) {
                        activity = await Activity.create({
                            name: activityHeaders[i].value,
                            user_id: attendance.user_id,
                            patient_id: attendance.patient_id,
                            schedule_id: attendance.schedule_id,
                            status: false,
                            comment: ""
                        });
                    }
                    attendance.activityList.push(activity);
                }
                
                var now = moment();
                var monday = now.clone().weekday(1).startOf('day').toDate();
                var sunday = now.clone().weekday(7).endOf('day').toDate();

                for(let j=0; j<observationHeaders.length; j++) {
                    let observation = await Observation.findOne({
                        user_id: attendance.user_id,
                        patient_id: attendance.patient_id,
                        name: observationHeaders[j].value,
                        update_date: {"$gte": monday, "$lt": sunday}
                    });
                    if(!observation) {
                        observation = await Observation.create({
                            name: observationHeaders[j].value,
                            user_id: attendance.user_id,
                            patient_id: attendance.patient_id,
                            schedule_id: attendance.schedule_id,
                            status: false,
                            comment: ""
                        });
                    }
                    attendance.observationList.push(observation);
                }

                let additionalComments = await AdditionalComment.find({
                    user_id: attendance.user_id,
                    patient_id: attendance.patient_id,
                    create_date: {"$gte": monday, "$lt": sunday}
                });

                // if(additionalComments.length) {
                //     for(let k=0; k<additionalComments.length; k++) {
                //         attendance.additionalComment += additionalComments[k].comment;
                //     }
                // }
                attendance.additionalComment = additionalComments;
            }
            
            res.json({ success: true, attendance: attendance });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Get attendance error" } });
        }
    },

    async getAttendanceListByDateRange(req, res) {
        try {
            const {fields, logData} = req.body;

            let startDate = moment(fields.startDate).startOf('day').toDate();
            let endDate = moment(fields.endDate).endOf('day').toDate();
            let attendanceList = await Attendance.find({
                user_id: fields.user_id,
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
                user_id: fields.user_id,
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

    async clockIn(req, res) {
        try {
            const {fields, logData} = req.body;
            let currentUser = AuthHelper.currentUser(req, res);

            // let { errors, isValid } = AttendanceValidation.validateClockIn(fields);
            // if (!isValid) {
            //     return res.json({ success: false, errors: errors });
            // }
        
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            
            let attendance = await Attendance.findOne({schedule_id: fields.schedule_id});
            if (attendance) {
                return res.json({ success: false, errors:  { clockin: "You cannot clockin again" } });
            }


            // Activity Report Section Start

            var now = moment();
            var firstDateOfWeek = now.clone().weekday(1).toISOString().split('T')[0];
            var lastDateOfWeek = now.clone().weekday(7).toISOString().split('T')[0];
            var nowDay = now.day();

            if(nowDay == 0) nowDay = 7;
            fields.org_id = currentUser.org_id;
            console.log(firstDateOfWeek, lastDateOfWeek);
            var activityReport = await ActivityReport.findOne({
                user_id: fields.user_id,
                patient_id: fields.patient_id,
                start_date: firstDateOfWeek,
                end_date: lastDateOfWeek
            });

            if(!activityReport) {
                activityReport = await ActivityReport.create({
                    user_id: fields.user_id,
                    patient_id: fields.patient_id,
                    start_date: firstDateOfWeek,
                    end_date: lastDateOfWeek,
                    activity: [
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson))
                    ],
                    observation: observationHeaders,
                    additionalComment: [],
                    sign_status: {
                        status: false
                    }
                });
            }

            var temp_activity = activityReport.activity;
            
            temp_activity[nowDay-1]['check_in'] = new Date();

            if(temp_activity[nowDay-1]['check_out']) {
                var hours = moment.duration(moment(temp_activity[nowDay-1]['check_out']).diff(moment(temp_activity[nowDay-1]['check_in']))).asHours();
                console.log(hours);
                if(hours < 0) {
                    temp_activity[nowDay-1]['hours'] = 24 + hours;
                } else {
                    temp_activity[nowDay-1]['hours'] = hours;
                }
            }
            
            tempActivityReport = await ActivityReport.findById(activityReport._id);
            tempActivityReport.activity = temp_activity;
            await tempActivityReport.save();


            // Activity Report Section End


            
            const time = moment().toDate();
            let newAttendance = await Attendance.create({
                ...fields,
                clockin_time: time,
                clockin_ip: ip,
                status: 'Not completed',
                additionalComment: ""
            });
            
            if(newAttendance) {
                newAttendance.activityList = [];
                newAttendance.observationList = [];
                newAttendance.additionalComment = [];

                for(let i=0; i<activityHeaders.length; i++) {
                    let activity = await Activity.findOne({
                        schedule_id: newAttendance.schedule_id, 
                        name: activityHeaders[i].value
                    });

                    if(!activity) {
                        activity = await Activity.create({
                            name: activityHeaders[i].value,
                            user_id: newAttendance.user_id,
                            patient_id: newAttendance.patient_id,
                            schedule_id: newAttendance.schedule_id,
                            status: false,
                            comment: ""
                        });
                    }
                    newAttendance.activityList.push(activity);
                }
                
                var now = moment();
                var monday = now.clone().weekday(1).toDate();
                var sunday = now.clone().weekday(7).toDate();

                for(let j=0; j<observationHeaders.length; j++) {
                    let observation = await Observation.findOne({
                        user_id: newAttendance.user_id,
                        patient_id: newAttendance.patient_id,
                        name: observationHeaders[j].value,
                        update_date: {"$gte": monday, "$lt": sunday}
                    });
                    if(!observation) {
                        observation = await Observation.create({
                            name: observationHeaders[j].value,
                            user_id: newAttendance.user_id,
                            patient_id: newAttendance.patient_id,
                            schedule_id: newAttendance.schedule_id,
                            status: false,
                            comment: ""
                        });
                    }
                    newAttendance.observationList.push(observation);
                }

                let additionalComments = await AdditionalComment.find({
                    user_id: newAttendance.user_id,
                    patient_id: newAttendance.patient_id,
                    create_date: {"$gte": monday, "$lt": sunday}
                });

                // if(additionalComments.length) {
                //     for(let k=0; k<additionalComments.length; k++) {
                //         newAttendance.additionalComment += additionalComments[k].comment;
                //     }
                // }
                newAttendance.additionalComment = additionalComments;
            }

            await Log.create({ 
                action: 'clockin',
                ip: ip,
                date_time: time,
                user_id: logData.user.id,
                username: logData.user.username,
                lat: logData.location['lat'],
                long: logData.location['long'],
                device_id: logData.deviceId
            });

            res.json({ success: true, attendance: newAttendance });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Clock in error" } });
        }
    },
    async clockOut(req, res) {
        try {
            const {fields, logData} = req.body;

            // let { errors, isValid } = AttendanceValidation.validateClockOut(fields);
            // if (!isValid) {
            //     return res.json({ success: false, errors: errors });
            // }
        
            let attendance = await Attendance.findById(fields.id);
            if (!attendance) {
                return res.json({ success: false, errors:  { clockin: "You need to clock in first" } });
            }

            let time = moment().toDate();
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            attendance.clockout_time = time;
            attendance.clockout_ip = ip;
            attendance.clockout_lat = fields.clockout_lat;
            attendance.clockout_long = fields.clockout_long;
            attendance.clockout_device_id = fields.clockout_device_id;
            attendance.clockout_distance_from_address = fields.clockout_distance_from_address;
            attendance.additionalComment = fields.additionalComment;
            attendance.activityList = fields.activityList;
            attendance.observationList = fields.observationList;
            attendance.status = 'Pending';

            

            // Activity Report Section Start

            var now = moment();
            var firstDateOfWeek = now.clone().weekday(1).toISOString().split('T')[0];
            var lastDateOfWeek = now.clone().weekday(7).toISOString().split('T')[0];
            var nowDay = now.day();

            if(nowDay == 0) nowDay = 7;

            console.log(firstDateOfWeek, lastDateOfWeek);
            var activityReport = await ActivityReport.findOne({
                user_id: attendance.user_id,
                patient_id: attendance.patient_id,
                start_date: firstDateOfWeek,
                end_date: lastDateOfWeek
            });

            if(!activityReport) {
                activityReport = await ActivityReport.create({
                    user_id: attendance.user_id,
                    patient_id: attendance.patient_id,
                    start_date: firstDateOfWeek,
                    end_date: lastDateOfWeek,
                    activity: [
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson))
                    ],
                    observation: observationHeaders,
                    additionalComment: [],
                    sign_status: {
                        status: false
                    }
                });
            }

            var temp_activity = activityReport.activity;
            
            temp_activity[nowDay-1]['check_out'] = new Date();
            
            if(temp_activity[nowDay-1]['check_in']) {
                var hours = moment.duration(moment(temp_activity[nowDay-1]['check_out']).diff(moment(temp_activity[nowDay-1]['check_in']))).asHours();
                console.log(hours);
                if(hours < 0) {
                    temp_activity[nowDay-1]['hours'] = 24 + hours;
                } else {
                    temp_activity[nowDay-1]['hours'] = hours;
                }
            }
            // console.log(temp_activity);
            tempActivityReport = await ActivityReport.findById(activityReport._id);
            tempActivityReport.activity = temp_activity;
            await tempActivityReport.save();
            
            // Activity Report Section End

            await attendance.save();
            
            await Log.create({ 
                action: 'clockout',
                ip: ip,
                date_time: time,
                user_id: logData.user.id,
                username: logData.user.username,
                lat: logData.location['lat'],
                long: logData.location['long'],
                device_id: logData.deviceId
            });
            res.json({ success: true, attendance: attendance });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Clock out error" } });
        }
    },
    async cancelClockIn(req, res) {
        try {
            const {fields, logData} = req.body;
        
            let attendance = await Attendance.findById(fields.id);
            if (!attendance) {
                return res.json({ success: false, errors:  { clockin: "You need to clock in first" } });
            }

            var date = moment().format('MM/DD/YYYY');
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            await Log.create({ 
                action: 'cancelClockIn',
                ip: ip,
                date_time: date,
                user_id: logData.user.id,
                username: logData.user.username,
                lat: logData.location['lat'],
                long: logData.location['long'],
                device_id: logData.deviceId
            });

            // Activity Report Section Start

            var now = moment();
            var firstDateOfWeek = now.clone().weekday(1).toISOString().split('T')[0];
            var lastDateOfWeek = now.clone().weekday(7).toISOString().split('T')[0];
            var nowDay = now.day();

            if(nowDay == 0) nowDay = 7;

            console.log(firstDateOfWeek, lastDateOfWeek);
            var activityReport = await ActivityReport.findOne({
                user_id: attendance.user_id,
                patient_id: attendance.patient_id,
                start_date: firstDateOfWeek,
                end_date: lastDateOfWeek
            });

            if(!activityReport) {
                activityReport = await ActivityReport.create({
                    user_id: attendance.user_id,
                    patient_id: attendance.patient_id,
                    start_date: firstDateOfWeek,
                    end_date: lastDateOfWeek,
                    activity: [
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson))
                    ],
                    observation: observationHeaders,
                    additionalComment: [],
                    sign_status: {
                        status: false
                    }
                });
            }

            var temp_activity = activityReport.activity;
            
            temp_activity[nowDay-1]['check_in'] = '';
            temp_activity[nowDay-1]['hours'] = '';

            tempActivityReport = await ActivityReport.findById(activityReport._id);
            tempActivityReport.activity = temp_activity;
            await tempActivityReport.save();
            
            // Activity Report Section End
            await attendance.delete();

            res.json({ success: true, attendance: null });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Clock out error" } });
        }
    },
    async cancelClockOut(req, res) {
        try {
            const {fields, logData} = req.body;
        
            let attendance = await Attendance.findById(fields.id);
            if (!attendance) {
                return res.json({ success: false, errors:  { clockin: "You need to clock in first" } });
            }

            attendance.clockout_time = "";
            attendance.clockout_ip = "";
            attendance.clockout_lat = "";
            attendance.clockout_long = "";
            attendance.clockout_device_id = "";
            attendance.clockout_distance_from_address = "";
            attendance.status = 'Not completed';

            await attendance.save();
            
            var date = moment().format('MM/DD/YYYY');
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            await Log.create({ 
                action: 'cancelClockOut',
                ip: ip,
                date_time: date,
                user_id: logData.user.id,
                username: logData.user.username,
                lat: logData.location['lat'],
                long: logData.location['long'],
                device_id: logData.deviceId
            });

            // Activity Report Section Start

            var now = moment();
            var firstDateOfWeek = now.clone().weekday(1).toISOString().split('T')[0];
            var lastDateOfWeek = now.clone().weekday(7).toISOString().split('T')[0];
            var nowDay = now.day();

            if(nowDay == 0) nowDay = 7;

            console.log(firstDateOfWeek, lastDateOfWeek);
            var activityReport = await ActivityReport.findOne({
                user_id: attendance.user_id,
                patient_id: attendance.patient_id,
                start_date: firstDateOfWeek,
                end_date: lastDateOfWeek
            });

            if(!activityReport) {
                activityReport = await ActivityReport.create({
                    user_id: attendance.user_id,
                    patient_id: attendance.patient_id,
                    start_date: firstDateOfWeek,
                    end_date: lastDateOfWeek,
                    activity: [
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson))
                    ],
                    observation: observationHeaders,
                    additionalComment: [],
                    sign_status: {
                        status: false
                    }
                });
            }

            var temp_activity = activityReport.activity;
            
            temp_activity[nowDay-1]['check_out'] = '';
            temp_activity[nowDay-1]['hours'] = '';

            tempActivityReport = await ActivityReport.findById(activityReport._id);
            tempActivityReport.activity = temp_activity;
            await tempActivityReport.save();
            
            // Activity Report Section End

            res.json({ success: true, attendance: attendance });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Clock out error" } });
        }
    },
    
    async getPatientList(req, res) {
        try {
            const {fields, logData} = req.body;

            let patientList = await Attendance.find({
                user_id: fields.user_id
            }, '-_id patient_id').populate({
                path: 'patient_id',
                select: ['first_name', 'last_name']
            });
            patientList = patientList.filter((elem, index, self) => {
                return index === self.findIndex(elem1 => elem.patient_id._id === elem1.patient_id._id );
            }).map(patient => patient.patient_id);
            
            res.json({ success: true, patientList: patientList });
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
            
            res.json({ success: true, attendanceList: attendanceList });
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Get attendance list for week error" } });
        }
    },

    async setActivity(req, res) {
        try {
            const {fields, logData} = req.body;

            let activity = await Activity.findById(fields.id);

            if(!activity) {
                res.json({ success: false, errors: { error: "Get Activity item error" } });
            }
            
            var now = moment();
            var firstDateOfWeek = now.clone().weekday(1).toISOString().split('T')[0];
            var lastDateOfWeek = now.clone().weekday(7).toISOString().split('T')[0];
            var nowDay = now.day();

            if(nowDay == 0) nowDay = 7;

            console.log(firstDateOfWeek, lastDateOfWeek);
            var activityReport = await ActivityReport.findOne({
                user_id: activity.user_id,
                patient_id: activity.patient_id,
                start_date: firstDateOfWeek,
                end_date: lastDateOfWeek
            });

            if(!activityReport) {
                activityReport = await ActivityReport.create({
                    user_id: activity.user_id,
                    patient_id: activity.patient_id,
                    start_date: firstDateOfWeek,
                    end_date: lastDateOfWeek,
                    activity: [
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson))
                    ],
                    observation: observationHeaders,
                    additionalComment: [],
                    sign_status: {
                        status: false
                    }
                });
            }

            var temp_activity = activityReport.activity;
            
            temp_activity[nowDay - 1][activity.name] = {
                status: fields.status,
                comment: fields.comment,
                date: new Date()
            };
            // console.log(temp_activity);
            tempActivityReport = await ActivityReport.findById(activityReport._id);
            tempActivityReport.activity = temp_activity;
            await tempActivityReport.save();

            activity.status = fields.status;
            activity.comment = fields.comment;
            activity.update_date = new Date();
            await activity.save();

            res.json({success: true, activity: activity});
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Get Activity item error" } });
        }
    },
    
    async setObservation(req, res) {
        try {
            const {fields, logData} = req.body;

            let observation = await Observation.findById(fields.id);

            if(!observation) {
                res.json({ success: false, errors: { error: "Get observation item error" } });
            }

            var now = moment();
            var firstDateOfWeek = now.clone().weekday(1).toISOString().split('T')[0];
            var lastDateOfWeek = now.clone().weekday(7).toISOString().split('T')[0];

            console.log(firstDateOfWeek, lastDateOfWeek);
            var activityReport = await ActivityReport.findOne({
                user_id: observation.user_id,
                patient_id: observation.patient_id,
                start_date: firstDateOfWeek,
                end_date: lastDateOfWeek
            });

            if(!activityReport) {
                activityReport = await ActivityReport.create({
                    user_id: observation.user_id,
                    patient_id: observation.patient_id,
                    start_date: firstDateOfWeek,
                    end_date: lastDateOfWeek,
                    activity: [
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson))
                    ],
                    observation: observationHeaders,
                    additionalComment: [],
                    sign_status: {
                        status: false
                    }
                });
            }

            var temp_observation = activityReport.observation.slice();
            
            let index = 0;

            for(let i=0; i<observationHeaders.length; i++) {
                if(observationHeaders[i].value == observation.name) {
                    index = i;
                }
            }

            temp_observation[index] = {
                value: observation.name,
                status: fields.status,
                comment: fields.comment,
                date: new Date()
            };
            // console.log(temp_activity);
            // tempActivityReport = await ActivityReport.findById(activityReport._id);
            activityReport.observation = temp_observation;
            await activityReport.save();

            observation.status = fields.status;
            observation.comment = fields.comment;
            observation.update_date = new Date();

            await observation.save();

            res.json({success: true, observation: observation});
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Get observation item error" } });
        }
    },

    async setAdditionalComment(req, res) {
        try {
            const {fields, logData} = req.body;

            
            var now = moment();
            var firstDateOfWeek = now.clone().weekday(1).toISOString().split('T')[0];
            var lastDateOfWeek = now.clone().weekday(7).toISOString().split('T')[0];

            // console.log(firstDateOfWeek, lastDateOfWeek);
            var activityReport = await ActivityReport.findOne({
                user_id: fields.user_id,
                patient_id: fields.patient_id,
                start_date: firstDateOfWeek,
                end_date: lastDateOfWeek
            });

            if(!activityReport) {
                activityReport = await ActivityReport.create({
                    user_id: fields.user_id,
                    patient_id: fields.patient_id,
                    start_date: firstDateOfWeek,
                    end_date: lastDateOfWeek,
                    activity: [
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson))
                    ],
                    observation: observationHeaders,
                    additionalComment: [],
                    sign_status: {
                        status: false
                    }
                });
            }

            // var temp_additionalComment = activityReport.additionalComment.slice();
            
            // temp_additionalComment.push({
            //     date: new Date(),
            //     comment: fields.comment
            // });
            // console.log(temp_activity);
            // tempActivityReport = await ActivityReport.findById(activityReport._id);
            // activityReport.additionalComment = temp_additionalComment;
            // await activityReport.save();

            let additionalComment = await AdditionalComment.create({
                user_id: fields.user_id,
                patient_id: fields.patient_id,
                schedule_id: fields.schedule_id,
                comment: fields.comment
            });

            var monday = now.clone().weekday(1).startOf('day').toDate();
            var sunday = now.clone().weekday(7).endOf('day').toDate();
            let additionalCommentsForReport = await AdditionalComment.find({
                user_id: fields.user_id,
                patient_id: fields.patient_id,
                update_date: {"$gte": monday, "$lt": sunday}
            });

            activityReport.additionalComment = additionalCommentsForReport;
            await activityReport.save();

            res.json({success: true, additional_comment: additionalComment});
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Get observation item error" } });
        }
    },

    async editAdditionalComment(req, res) {
        try {
            const {fields, logData} = req.body;

            var additionalComment = await AdditionalComment.findById(fields.id);

            if(!additionalComment) {
                res.json({ success: false, errors: { error: "Get additional comment item error" } });
            }

            var now = moment();
            var firstDateOfWeek = now.clone().weekday(1).toISOString().split('T')[0];
            var lastDateOfWeek = now.clone().weekday(7).toISOString().split('T')[0];

            console.log(firstDateOfWeek, lastDateOfWeek);
            var activityReport = await ActivityReport.findOne({
                user_id: additionalComment.user_id,
                patient_id: additionalComment.patient_id,
                start_date: firstDateOfWeek,
                end_date: lastDateOfWeek
            });

            if(!activityReport) {
                activityReport = await ActivityReport.create({
                    user_id: additionalComment.user_id,
                    patient_id: additionalComment.patient_id,
                    start_date: firstDateOfWeek,
                    end_date: lastDateOfWeek,
                    activity: [
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson))
                    ],
                    observation: observationHeaders,
                    additionalComment: [],
                    sign_status: {
                        status: false
                    }
                });
            }

            additionalComment.user_id = fields.user_id;
            additionalComment.patient_id = fields.patient_id;
            additionalComment.schedule_id = fields.schedule_id;
            additionalComment.comment = fields.comment;

            await additionalComment.save();

            var monday = now.clone().weekday(1).startOf('day').toDate();
            var sunday = now.clone().weekday(7).endOf('day').toDate();
            console.log(monday, sunday);
            let additionalCommentsForReport = await AdditionalComment.find({
                user_id: fields.user_id,
                patient_id: fields.patient_id,
                update_date: {"$gte": monday, "$lt": sunday}
            });

            activityReport.additionalComment = additionalCommentsForReport;
            await activityReport.save();

            res.json({success: true, additional_comment: additionalComment});
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Get observation item error" } });
        }
    },

    async deleteAdditionalComment(req, res) {
        try {
            const {fields, logData} = req.body;

            var additionalComment = await AdditionalComment.findById(fields.id);

            if(!additionalComment) {
                res.json({ success: false, errors: { error: "Get additional comment item error" } });
            }

            var now = moment();
            var firstDateOfWeek = now.clone().weekday(1).toISOString().split('T')[0];
            var lastDateOfWeek = now.clone().weekday(7).toISOString().split('T')[0];

            console.log(firstDateOfWeek, lastDateOfWeek);
            var activityReport = await ActivityReport.findOne({
                user_id: additionalComment.user_id,
                patient_id: additionalComment.patient_id,
                start_date: firstDateOfWeek,
                end_date: lastDateOfWeek
            });

            if(!activityReport) {
                activityReport = await ActivityReport.create({
                    user_id: additionalComment.user_id,
                    patient_id: additionalComment.patient_id,
                    start_date: firstDateOfWeek,
                    end_date: lastDateOfWeek,
                    activity: [
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson)),
                        JSON.parse(JSON.stringify(initActivityReportActivityJson))
                    ],
                    observation: observationHeaders,
                    additionalComment: [],
                    sign_status: {
                        status: false
                    }
                });
            }

            await additionalComment.delete();

            var monday = now.clone().weekday(1).startOf('day').toDate();
            var sunday = now.clone().weekday(7).endOf('day').toDate();
            console.log(monday, sunday);
            let additionalCommentsForReport = await AdditionalComment.find({
                user_id: fields.user_id,
                patient_id: fields.patient_id,
                update_date: {"$gte": monday, "$lt": sunday}
            });

            activityReport.additionalComment = additionalCommentsForReport;
            await activityReport.save();

            res.json({success: true, additional_comment: additionalComment});
        } catch (e) {
            console.log(e)
            res.json({ success: false, errors: { error: "Get observation item error" } });
        }
    }
};
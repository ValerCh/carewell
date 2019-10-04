const AuthRouter = require('./auth');
const UserRouter = require('./user');
const AttendanceRouter = require('./attendance');
const FamilyRouter = require('./family');
const LogRouter = require('./log');
const PatientRouter = require('./patient');
const ScheduleRouter = require('./schedule');
const RoleRouter = require('./role');

const AppNurseRouter = require('./app-nurse');
const AppFamilyRouter = require('./app-family');

module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'welcome'
    }));

    app.use("/api/auth", AuthRouter);
    app.use("/api/user", UserRouter);
    app.use("/api/attendance", AttendanceRouter);
    app.use("/api/family", FamilyRouter);
    app.use("/api/log", LogRouter);
    app.use("/api/patient", PatientRouter);
    app.use("/api/schedule", ScheduleRouter);
    app.use("/api/role", RoleRouter);

    app.use("/api/app-nurse", AppNurseRouter);
    app.use("/api/app-family", AppFamilyRouter);
};
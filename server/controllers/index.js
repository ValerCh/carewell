const auth = require('./auth');
const user = require('./user');
const attendance = require('./attendance');
const family = require('./family');
const log = require('./log');
const patient = require('./patient');
const role = require('./role');
const schedule = require('./schedule');

const appNurse = require('./app-nurse');
const appFamily = require('./app-family');

module.exports = {
    auth,
    user,
    attendance,
    family,
    log,
    patient,
    role,
    schedule,
    
    appNurse,
    appFamily
};
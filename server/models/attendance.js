const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const AttendanceSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patient_id: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  schedule_id: {
    type: Schema.Types.ObjectId,
    ref: 'Schedule',
    required: true
  },
  // date: {
  //   type: Date
  // },
  clockin_time: {
    type: Date
  },
  clockout_time: {
    type: Date
  },
  clockin_lat: {
    type: String
  },
  clockin_long: {
    type: String
  },
  clokcout_lat: {
    type: String
  },
  clockout_long: {
    type: String
  },
  clockin_ip: {
    type: String
  },
  clockout_ip: {
    type: String
  },
  clockin_device_id: {
    type: String
  },
  clockout_device_id: {
    type: String
  },
  clockin_distance_from_address: {
    type: String
  },
  clockout_distance_from_address: {
    type: String
  },
  clockin_user: {
    type: String
  },
  clockout_user: {
    type: String
  },
  note: {
    type: String
  },
  status: {
    type: String
  },
  activityList: {
    type: Schema.Types.Mixed
  },
  additionalComment: {
    type: Schema.Types.Mixed
  },
  observationList: {
    type: Schema.Types.Mixed
  },
  create_date: {
    type: Date,
    default: Date.now
  },
  update_date: {
    type: Date,
    default: Date.now
  },
  org_id: {
    type: Schema.Types.ObjectId
  }
});

module.exports = Attendance = mongoose.model("Attendance", AttendanceSchema);

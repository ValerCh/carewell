const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ScheduleSchema = new Schema({
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
  date: {
    type: Date
  },
  start_time: {
    type: String
  },
  end_time: {
    type: String
  },
  status: {
    type: String,
    required: true
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

module.exports = Schedule = mongoose.model("Schedule", ScheduleSchema);

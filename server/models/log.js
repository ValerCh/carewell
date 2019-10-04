const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const LogSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  ip: {
    type: String,
    required: true
  },
  lat: {
    type: String,
    required: true
  },
  long: {
    type: String,
    required: true
  },
  device_id: {
    type: String,
    required: true
  },
  date_time: {
    type: Date,
    default: Date.now
  }
});

module.exports = Log = mongoose.model("Log", LogSchema);

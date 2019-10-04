const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  loginid: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email1: {
    type: String
  },
  email2: {
    type: String
  },
  phone1: {
    type: String
  },
  phone2: {
    type: String
  },
  status: {
    type: String,
    default: ""
  },
  create_date: {
    type: Date,
    default: Date.now
  },
  update_date: {
    type: Date,
    default: Date.now
  },
  currently_signed_in: {
    type: Boolean,
    default: false
  },
  currently_loggedin_from_ip: {
    type: String,
    required: true
  },
  role_id: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  family_id: {
    type: Schema.Types.ObjectId,
    ref: 'Family'
  },
  org_id: {
    type: Schema.Types.ObjectId
  }
});

module.exports = User = mongoose.model("User", UserSchema);

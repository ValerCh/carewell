const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const RoleSchema = new Schema({
  role_internal_name: {
    type: String,
    required: true
  },
  role_display_name: {
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
  }
});

module.exports = Role = mongoose.model("Role", RoleSchema);
